import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { DEFAULT_GAME_TEXTS, DEFAULT_STAGES } from './data/defaultStages';
import { ACHIEVEMENTS, evaluateUnlockedAchievements } from './data/achievements';
import {
  AchievementDefinition,
  AvatarConfig,
  DEFAULT_AVATAR,
  GameScreen,
  GameTexts,
  PlayerProgress,
  StageData,
  TravelerTrait
} from './types/game';
import { TitleScreen } from './components/TitleScreen';
import { AchievementToast } from './components/AchievementToast';
import { generateVoucherCode } from './utils/rewards';
import { soundEngine } from './utils/sound';

const EpicMapView = lazy(() =>
  import('./components/EpicMapView').then((m) => ({ default: m.EpicMapView }))
);
const StageModal = lazy(() =>
  import('./components/StageModal').then((m) => ({ default: m.StageModal }))
);
const VictoryScreen = lazy(() =>
  import('./components/VictoryScreen').then((m) => ({ default: m.VictoryScreen }))
);
const AvatarCreatorModal = lazy(() =>
  import('./components/AvatarCreatorModal').then((m) => ({ default: m.AvatarCreatorModal }))
);
const ProfileModal = lazy(() =>
  import('./components/ProfileModal').then((m) => ({ default: m.ProfileModal }))
);
const StoryPostcardModal = lazy(() =>
  import('./components/StoryPostcardModal').then((m) => ({ default: m.StoryPostcardModal }))
);

const PROGRESS_STORAGE_KEY = 'penas_player_progress_v1';
const SESSION_STORAGE_KEY = 'penas_session_state_v1';

interface SavedSessionState {
  screen: GameScreen;
  activeStageId: number | null;
}

function clearStageCheckpoints() {
  try {
    for (let i = 1; i <= DEFAULT_STAGES.length; i++) {
      window.localStorage.removeItem(`penas_stage_checkpoint_v1_${i}`);
    }
  } catch {
    // ignore storage errors
  }
}

function createFreshProgress(playerName = '', avatar: AvatarConfig = DEFAULT_AVATAR): PlayerProgress {
  return {
    playerName,
    avatar,
    unlockedStage: 1,
    completedStages: [],
    firstTryWins: [],
    traitScores: {
      cultural: 0,
      aventurero: 0,
      naturaleza: 0,
      comunitario: 0
    },
    voucherCode: generateVoucherCode(),
    startedAt: new Date().toISOString(),
    unlockedAchievements: []
  };
}

function ScreenFallback({ label = 'Cargando vista...' }: { label?: string }) {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#0B1D2E] text-[#F5F1E8] flex flex-col items-center justify-center p-6 text-center gap-3">
      <div className="w-9 h-9 rounded-full border-3 border-[#F5B700]/25 border-t-[#F5B700] animate-spin" />
      <p className="text-sm font-medium text-[#E2DDD2]">{label}</p>
    </div>
  );
}

function ModalFallback() {
  return (
    <div className="fixed inset-0 z-50 bg-[#050E17]/85 flex flex-col items-center justify-center p-6 text-center gap-3">
      <div className="w-9 h-9 rounded-full border-3 border-[#F5B700]/25 border-t-[#F5B700] animate-spin" />
      <p className="text-sm font-medium text-[#E2DDD2]">Cargando...</p>
    </div>
  );
}

export default function App() {
  const stages: StageData[] = DEFAULT_STAGES;

  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const fresh = createFreshProgress();
    try {
      const saved = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && typeof parsed.unlockedStage === 'number') {
          const parsedAvatar =
            parsed.avatar && typeof parsed.avatar === 'object' ? parsed.avatar : {};
          const parsedTraits =
            parsed.traitScores && typeof parsed.traitScores === 'object' ? parsed.traitScores : {};

          const normalized: PlayerProgress = {
            ...fresh,
            playerName: typeof parsed.playerName === 'string' ? parsed.playerName : '',
            avatar: { ...DEFAULT_AVATAR, ...parsedAvatar },
            unlockedStage: Math.max(1, Math.min(DEFAULT_STAGES.length, parsed.unlockedStage)),
            completedStages: Array.isArray(parsed.completedStages)
              ? parsed.completedStages.filter((id: unknown): id is number => typeof id === 'number')
              : [],
            firstTryWins: Array.isArray(parsed.firstTryWins)
              ? parsed.firstTryWins.filter((id: unknown): id is number => typeof id === 'number')
              : [],
            traitScores: {
              cultural: Number(parsedTraits.cultural) || 0,
              aventurero: Number(parsedTraits.aventurero) || 0,
              naturaleza: Number(parsedTraits.naturaleza) || 0,
              comunitario: Number(parsedTraits.comunitario) || 0
            },
            voucherCode:
              typeof parsed.voucherCode === 'string' && parsed.voucherCode
                ? parsed.voucherCode
                : fresh.voucherCode,
            startedAt:
              typeof parsed.startedAt === 'string' && parsed.startedAt
                ? parsed.startedAt
                : fresh.startedAt,
            completedAt:
              typeof parsed.completedAt === 'string' ? parsed.completedAt : undefined,
            unlockedAchievements: Array.isArray(parsed.unlockedAchievements)
              ? parsed.unlockedAchievements.filter((id: unknown): id is string => typeof id === 'string')
              : []
          };
          normalized.unlockedAchievements = evaluateUnlockedAchievements(normalized);
          return normalized;
        }
      }
    } catch {
      // ignore storage errors (private mode / restricted WebView)
    }
    return fresh;
  });

  const gameTexts: GameTexts = DEFAULT_GAME_TEXTS;

  const [initialSession] = useState<SavedSessionState>(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedSessionState>;
        const validScreen: GameScreen =
          parsed.screen === 'VICTORY_SCREEN' && progress.completedStages.length >= stages.length
            ? 'VICTORY_SCREEN'
            : parsed.screen === 'MAP_VIEW' || parsed.screen === 'VICTORY_SCREEN'
              ? 'MAP_VIEW'
              : 'TITLE_MENU';
        const validStageId =
          validScreen === 'MAP_VIEW' &&
          typeof parsed.activeStageId === 'number' &&
          parsed.activeStageId >= 1 &&
          parsed.activeStageId <= Math.max(progress.unlockedStage, ...progress.completedStages, 1)
            ? parsed.activeStageId
            : null;
        return { screen: validScreen, activeStageId: validStageId };
      }
    } catch {
      // ignore storage errors
    }
    return { screen: 'TITLE_MENU', activeStageId: null };
  });

  const [screen, setScreen] = useState<GameScreen>(initialSession.screen);
  const [activeStageId, setActiveStageId] = useState<number | null>(initialSession.activeStageId);
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStoryPostcardOpen, setIsStoryPostcardOpen] = useState(false);
  const [toastAchievements, setToastAchievements] = useState<AchievementDefinition[]>([]);
  const [recentAchievementIds, setRecentAchievementIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage quota errors
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ screen, activeStageId } satisfies SavedSessionState)
      );
    } catch {
      // ignore storage quota errors
    }
  }, [screen, activeStageId]);

  useEffect(() => {
    soundEngine.syncAmbientContext(screen, activeStageId);
  }, [screen, activeStageId]);

  useEffect(() => {
    if (toastAchievements.length === 0) return;
    const timer = window.setTimeout(() => {
      setToastAchievements([]);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [toastAchievements]);

  const toggleMute = useCallback(() => {
    soundEngine.setMuted(!soundEngine.isMuted());
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inInput =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');
      if (inInput) return;

      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'Escape') {
        if (isStoryPostcardOpen) setIsStoryPostcardOpen(false);
        else if (isAvatarCreatorOpen) setIsAvatarCreatorOpen(false);
        else if (isProfileOpen) {
          setIsProfileOpen(false);
          setRecentAchievementIds([]);
        } else if (activeStageId !== null) setActiveStageId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeStageId, isAvatarCreatorOpen, isProfileOpen, isStoryPostcardOpen, toggleMute]);

  const handleContinueSaved = useCallback(() => {
    soundEngine.startMusic();
    soundEngine.playClick();
    setScreen('MAP_VIEW');
  }, []);

  const handleStartNew = useCallback(() => {
    soundEngine.startMusic();
    soundEngine.playClick();
    clearStageCheckpoints();
    setToastAchievements([]);
    setRecentAchievementIds([]);
    setProgress((prev) => createFreshProgress(prev.playerName, prev.avatar));
    setActiveStageId(null);
    setScreen('MAP_VIEW');
  }, []);

  const handleCompleteStage = (stageId: number, firstTry: boolean, selectedTrait: TravelerTrait) => {
    const alreadyDone = progress.completedStages.includes(stageId);
    const completedStages = alreadyDone
      ? progress.completedStages
      : [...progress.completedStages, stageId];
    const firstTryWins =
      !alreadyDone && firstTry && !progress.firstTryWins.includes(stageId)
        ? [...progress.firstTryWins, stageId]
        : progress.firstTryWins;
    const unlockedStage = Math.min(stages.length, Math.max(progress.unlockedStage, stageId + 1));
    const traitScores = alreadyDone
      ? progress.traitScores
      : {
          ...progress.traitScores,
          [selectedTrait]: (progress.traitScores[selectedTrait] || 0) + 1
        };

    const isNowComplete = completedStages.length >= stages.length;
    const completedAt = isNowComplete ? progress.completedAt || new Date().toISOString() : progress.completedAt;
    const startedAt = progress.startedAt || new Date().toISOString();

    const candidateProgress: PlayerProgress = {
      ...progress,
      unlockedStage,
      completedStages,
      firstTryWins,
      traitScores,
      startedAt,
      completedAt
    };

    const prevUnlocked = new Set(progress.unlockedAchievements || []);
    const nextUnlockedIds = evaluateUnlockedAchievements(candidateProgress);
    candidateProgress.unlockedAchievements = nextUnlockedIds;

    const newlyUnlockedIds = nextUnlockedIds.filter((id) => !prevUnlocked.has(id));
    if (newlyUnlockedIds.length > 0) {
      setRecentAchievementIds((prev) => Array.from(new Set([...prev, ...newlyUnlockedIds])));
      const newlyUnlockedDefs = newlyUnlockedIds
        .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
        .filter((a): a is AchievementDefinition => Boolean(a));
      if (newlyUnlockedDefs.length > 0) {
        setToastAchievements(newlyUnlockedDefs);
        soundEngine.playRelicUnlock();
      }
    }

    setProgress(candidateProgress);

    if (isNowComplete) {
      window.setTimeout(() => {
        soundEngine.playVictoryFanfare();
        setScreen('VICTORY_SCREEN');
      }, 250);
    }
  };

  const activeStage = stages.find((s) => s.id === activeStageId) || null;

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#0B1D2E] text-[#F5F1E8]">
      {screen !== 'VICTORY_SCREEN' && (
        <AchievementToast
          achievements={toastAchievements}
          onDismiss={() => setToastAchievements([])}
          onOpenProfile={() => {
            setToastAchievements([]);
            setIsProfileOpen(true);
          }}
        />
      )}

      {screen === 'TITLE_MENU' && (
        <TitleScreen
          playerName={progress.playerName}
          avatarConfig={progress.avatar}
          gameTexts={gameTexts}
          hasSavedProgress={
            progress.completedStages.length > 0 ||
            progress.unlockedStage > 1 ||
            activeStageId !== null
          }
          onChangeName={(name) => setProgress((p) => ({ ...p, playerName: name }))}
          onContinue={handleContinueSaved}
          onStart={handleStartNew}
          onOpenAvatarCreator={() => setIsAvatarCreatorOpen(true)}
        />
      )}

      {screen === 'MAP_VIEW' && (
        <Suspense fallback={<ScreenFallback label="Cargando mapa de Peñas..." />}>
          <EpicMapView
            stages={stages}
            progress={progress}
            gameTexts={gameTexts}
            onSelectStage={(id) => setActiveStageId(id)}
            onOpenAvatarCreator={() => setIsAvatarCreatorOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenVictory={() => {
              soundEngine.playVictoryFanfare();
              setScreen('VICTORY_SCREEN');
            }}
            onBackToTitle={() => setScreen('TITLE_MENU')}
          />
        </Suspense>
      )}

      {screen === 'VICTORY_SCREEN' && (
        <Suspense fallback={<ScreenFallback label="Preparando tu premio de Guardián..." />}>
          <VictoryScreen
            stages={stages}
            progress={progress}
            gameTexts={gameTexts}
            onBackToMap={() => setScreen('MAP_VIEW')}
            onPlayAgain={handleStartNew}
            onOpenStoryPostcard={() => setIsStoryPostcardOpen(true)}
          />
        </Suspense>
      )}

      {activeStage && screen === 'MAP_VIEW' && (
        <Suspense fallback={<ModalFallback />}>
          <StageModal
            stage={activeStage}
            alreadyCompleted={progress.completedStages.includes(activeStage.id)}
            playerAvatar={progress.avatar}
            playerName={progress.playerName}
            gameTexts={gameTexts}
            onClose={() => setActiveStageId(null)}
            onCompleteStage={handleCompleteStage}
          />
        </Suspense>
      )}

      {isProfileOpen && (
        <Suspense fallback={<ModalFallback />}>
          <ProfileModal
            progress={progress}
            totalStages={stages.length}
            recentAchievementIds={recentAchievementIds}
            onEditAvatar={() => {
              setIsProfileOpen(false);
              setIsAvatarCreatorOpen(true);
            }}
            onOpenStoryPostcard={() => {
              setIsProfileOpen(false);
              setIsStoryPostcardOpen(true);
            }}
            onClose={() => {
              setIsProfileOpen(false);
              setRecentAchievementIds([]);
            }}
          />
        </Suspense>
      )}

      {isStoryPostcardOpen && (
        <Suspense fallback={<ModalFallback />}>
          <StoryPostcardModal
            progress={progress}
            totalStages={stages.length}
            onClose={() => setIsStoryPostcardOpen(false)}
          />
        </Suspense>
      )}

      {isAvatarCreatorOpen && (
        <Suspense fallback={<ModalFallback />}>
          <AvatarCreatorModal
            initialConfig={progress.avatar}
            playerName={progress.playerName}
            onSave={(avatar, updatedName) => {
              setProgress((prev) => ({
                ...prev,
                avatar,
                playerName: updatedName
              }));
              setIsAvatarCreatorOpen(false);
            }}
            onClose={() => setIsAvatarCreatorOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
