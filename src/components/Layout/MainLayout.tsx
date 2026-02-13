import { ReactNode } from 'react';
import { ThemeToggle } from '../ThemeToggle';

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pl-64 transition-all duration-300 relative">
            <div className="absolute top-6 right-8 flex items-center gap-4 z-50">
                <div className="flex items-end gap-3 pointer-events-none select-none" style={{ fontFamily: '"Akaya Kanadaka", system-ui' }}>
                    <span className="text-sky-300 text-3xl drop-shadow-[0_0_8px_rgba(125,211,252,0.6)]">Keep Dreaming</span>
                    <span className="text-red-500 text-3xl relative -top-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">Keep Winning</span>
                </div>
                <ThemeToggle />
            </div>
            <main className="container mx-auto max-w-7xl p-8">
                {children}
            </main>
        </div>
    );
}
