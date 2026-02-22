import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Error boundary specifically for the R3F Canvas.
 * Catches errors like failed HDR/asset loads when offline
 * and renders a graceful fallback instead of crashing the page.
 */
export class CanvasErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.warn('[CardioTwin] 3D scene error caught by boundary:', error.message);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? (
                <div className="flex items-center justify-center w-full h-full min-h-[400px]">
                    <div className="text-center p-8">
                        <div className="text-4xl mb-4">🫀</div>
                        <h3 className="text-lg font-bold text-background-dark mb-2">3D View Unavailable</h3>
                        <p className="text-sm text-background-dark/60">
                            The 3D model could not load. Please check your internet connection and refresh.
                        </p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
