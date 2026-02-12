import { ReactNode } from 'react';

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 pl-64 transition-all duration-300">
            <main className="container mx-auto max-w-7xl p-8">
                {children}
            </main>
        </div>
    );
}
