import { AchievementDefinition, PlayerProgress } from '../types/game';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'primer_paso',
    title: 'Chaski (mensajero andino) de la Plaza',
    description: 'Completaste la primera etapa en la Plaza de Túpac Katari.',
    criterion: 'Completa la Etapa 1 de la travesía',
    tier: 'bronce',
    icon: 'compass'
  },
  {
    id: 'sin_errores_etapa',
    title: 'Sabiduría de Amauta (sabio andino)',
    description: 'Superaste un desafío al primer intento sin ningún tropiezo.',
    criterion: 'Completa cualquier etapa sin errores',
    tier: 'plata',
    icon: 'star'
  },
  {
    id: 'maestro_telar',
    title: 'Viajero del Trueque',
    description: 'Superaste el Camino Prehispánico y Saca Cuellos con totora (junco andino) o aguayo (tejido andino).',
    criterion: 'Completa la Etapa 3 (Camino Prehispánico)',
    tier: 'esmeralda',
    icon: 'loom'
  },
  {
    id: 'racha_tres',
    title: 'Paso Firme de Altura',
    description: 'Dominaste tres paradas del sendero sin cometer errores.',
    criterion: 'Completa 3 etapas distintas al primer intento',
    tier: 'plata',
    icon: 'flame'
  },
  {
    id: 'protector_pachamama',
    title: 'Guardián de las Cuevas',
    description: 'Descifraste la Cueva Kunkuntiji (gruta sagrada) y restauraste el arte de Qillqantiji (abrigo pintado).',
    criterion: 'Completa las etapas 4 y 5 (Cuevas Sagradas)',
    tier: 'esmeralda',
    icon: 'leaf'
  },
  {
    id: 'ojo_del_condor',
    title: 'Ojo del Cóndor',
    description: 'Coronaste el Mirador Nido de Cóndores y el Parque de Escalada.',
    criterion: 'Completa la Etapa 7 (Mirador y Escalada)',
    tier: 'plata',
    icon: 'mountain'
  },
  {
    id: 'guardian_perfecto',
    title: 'Corazón de Guardián',
    description: 'Conquistaste las 7 etapas completando tus desafíos sin errores.',
    criterion: 'Logra 7/7 etapas sin tropiezos',
    tier: 'oro',
    icon: 'crown'
  },
  {
    id: 'veloz_como_el_viento',
    title: 'Veloz como el Wayra (viento andino)',
    description: 'Recorriste las 7 etapas desde la Plaza hasta el Mirador en tiempo récord.',
    criterion: 'Completa el juego en menos de 20 minutos',
    tier: 'oro',
    icon: 'clock'
  }
];

export const TWENTY_MINUTES_MS = 20 * 60 * 1000;

export function evaluateUnlockedAchievements(progress: PlayerProgress): string[] {
  const earned = new Set<string>(progress.unlockedAchievements || []);
  const completed = progress.completedStages || [];
  const firstTry = progress.firstTryWins || [];

  if (completed.length >= 1) {
    earned.add('primer_paso');
  }
  if (firstTry.length >= 1) {
    earned.add('sin_errores_etapa');
  }
  if (completed.includes(3)) {
    earned.add('maestro_telar');
  }
  if (firstTry.length >= 3) {
    earned.add('racha_tres');
  }
  if (completed.includes(4) && completed.includes(5)) {
    earned.add('protector_pachamama');
  }
  if (completed.includes(7)) {
    earned.add('ojo_del_condor');
  }
  if (completed.length >= 7 && firstTry.length >= 7) {
    earned.add('guardian_perfecto');
  }

  if (completed.length >= 7 && progress.startedAt && progress.completedAt) {
    const startMs = new Date(progress.startedAt).getTime();
    const endMs = new Date(progress.completedAt).getTime();
    if (!Number.isNaN(startMs) && !Number.isNaN(endMs) && endMs >= startMs) {
      if (endMs - startMs <= TWENTY_MINUTES_MS) {
        earned.add('veloz_como_el_viento');
      }
    }
  }

  return ACHIEVEMENTS.map((a) => a.id).filter((id) => earned.has(id));
}

export function getAchievementProgressHint(id: string, progress: PlayerProgress): string {
  const completed = progress.completedStages || [];
  const firstTry = progress.firstTryWins || [];

  switch (id) {
    case 'primer_paso':
      return `${Math.min(1, completed.length)}/1 etapa`;
    case 'sin_errores_etapa':
      return `${Math.min(1, firstTry.length)}/1 etapa perfecta`;
    case 'maestro_telar':
      return completed.includes(3) ? 'Completado' : 'Etapa 3 pendiente';
    case 'racha_tres':
      return `${Math.min(3, firstTry.length)}/3 al 1er intento`;
    case 'protector_pachamama': {
      const count = (completed.includes(4) ? 1 : 0) + (completed.includes(5) ? 1 : 0);
      return `${count}/2 etapas (4 y 5)`;
    }
    case 'ojo_del_condor':
      return completed.includes(7) ? 'Completado' : 'Etapa 7 pendiente';
    case 'guardian_perfecto':
      return `${firstTry.length}/7 al 1er intento`;
    case 'veloz_como_el_viento':
      return completed.length >= 7 ? 'Meta: < 20:00 min' : `${completed.length}/7 · < 20 min`;
    default:
      return '';
  }
}

export function formatElapsedTime(startedAt?: string, completedAt?: string): string {
  if (!startedAt) return '00:00';
  const start = new Date(startedAt).getTime();
  const end = completedAt ? new Date(completedAt).getTime() : Date.now();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return '00:00';
  const totalSec = Math.floor((end - start) / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
