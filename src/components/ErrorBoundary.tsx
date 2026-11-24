import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Error en Peñas: Sendero del Guardián:', error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAndReload = () => {
    try {
      window.localStorage.removeItem('penas_player_progress_v1');
    } catch {
      // ignore private mode storage restriction
    }
    window.location.reload();
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen min-h-[100dvh] w-full bg-[#0B1D2E] text-[#F5F1E8] flex items-center justify-center p-5">
        <div className="max-w-md w-full rounded-2xl border border-[#D9A05B]/45 bg-[#0D2134] p-6 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#17334E] border border-[#F5B700]/45 flex items-center justify-center text-[#F5B700] font-display text-2xl font-bold">
            !
          </div>
          <h1 className="font-display text-xl font-bold text-[#FFF8E7]">
            No se pudo iniciar esta vista
          </h1>
          <p className="text-sm text-[#D8D3C8] leading-relaxed">
            Tu navegador móvil tuvo un problema momentáneo al cargar el juego. Intenta recargar la página o reiniciar el progreso guardado.
          </p>
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              onClick={this.handleReload}
              className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F5B700] hover:bg-[#FFD166] text-[#1A1207] font-bold text-sm cursor-pointer"
            >
              Reintentar ahora
            </button>
            <button
              type="button"
              onClick={this.handleResetAndReload}
              className="w-full min-h-[44px] px-5 py-2 rounded-xl bg-[#17334E] hover:bg-[#234B70] border border-white/15 text-[#E2DDD2] text-xs font-semibold cursor-pointer"
            >
              Reiniciar partida guardada y recargar
            </button>
          </div>
        </div>
      </div>
    );
  }
}
