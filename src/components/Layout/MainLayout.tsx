import { ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 pl-64 transition-all duration-300 relative">
            <div className="absolute top-6 right-8 flex items-center gap-3 z-50 pointer-events-none font-bold text-2xl tracking-tight select-none">
                <span className="text-sky-300 drop-shadow-[0_0_8px_rgba(125,211,252,0.6)]">Keep Dreaming</span>
                <span className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">Keep Winning</span>
            </div>
            <main className="container mx-auto max-w-7xl p-8">
                {children}
            </main>
        </div>
    );
}
