import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

// Bounded in-memory cache so repeated Tata lines play instantaneously
const MAX_CACHE_ENTRIES = 60;
const ttsCache = new Map<string, Buffer>();

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

type TtsLanguage = 'es' | 'en' | 'pt';

const STYLE_PROMPTS: Record<TtsLanguage, string> = {
  es: 'Voz masculina madura y muy calmada de Bolivia. Hombre sereno de tono grave, cálido y pausado, hablando con tranquilidad y cariño como un abuelo guía en español latinoamericano.',
  en: 'Mature, very calm elder male voice with warm Andean serenity. Deep, gentle, unhurried grandfatherly tone speaking clearly and warmly in English.',
  pt: 'Voz masculina madura, serena e muito calma de um avô guia andino. Tom grave, acolhedor e pausado, falando com tranquilidade e carinho em português.'
};

async function generateTataAudioWav(text: string, lang: TtsLanguage = 'es'): Promise<Buffer> {
  const cacheKey = `${lang}::${text}`;
  const cached = ttsCache.get(cacheKey);
  if (cached) return cached;

  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const stylePrompt = STYLE_PROMPTS[lang] || STYLE_PROMPTS.es;

  const tryModels = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'] as const;
  let lastError: unknown = null;

  for (const model of tryModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style: stylePrompt
                }
              }
            ]
          }
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Charon' }
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const wavBuffer = Buffer.from(base64Audio, 'base64');
        if (ttsCache.size >= MAX_CACHE_ENTRIES) {
          const firstKey = ttsCache.keys().next().value;
          if (firstKey) ttsCache.delete(firstKey);
        }
        ttsCache.set(cacheKey, wavBuffer);
        return wavBuffer;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('TTS_GENERATION_FAILED');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/tata-tts/status', (_req, res) => {
    res.json({ available: Boolean(getGeminiClient()) });
  });

  app.post('/api/tata-tts', async (req, res) => {
    const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!rawText) {
      res.status(400).json({ error: 'Text is required for speech generation.' });
      return;
    }

    const lang: TtsLanguage =
      req.body?.lang === 'en' ? 'en' : req.body?.lang === 'pt' ? 'pt' : 'es';
    const boundedText = rawText.slice(0, 1200);

    try {
      const wavBuffer = await generateTataAudioWav(boundedText, lang);
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(wavBuffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'TTS failed';
      const status = message === 'GEMINI_API_KEY_NOT_CONFIGURED' ? 503 : 502;
      res.status(status).json({ error: message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(import.meta.dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build not found. Run npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
