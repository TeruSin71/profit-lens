import { ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 pl-64 transition-all duration-300 relative">
            <div className="absolute top-6 right-6 flex flex-col items-end z-50 pointer-events-none">
                <img src="/Logo.png" alt="Branding" className="h-20 w-auto object-contain" />
                <p className="text-xs text-slate-500 text-right mt-1 font-medium tracking-wide">KEEP DREAMING KEEP WINNING</p>
            </div>
            <main className="container mx-auto max-w-7xl p-8">
                {children}
            </main>
        </div>
    );
}
