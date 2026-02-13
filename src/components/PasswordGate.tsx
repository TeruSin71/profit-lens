import { useState, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface PasswordGateProps {
    children: React.ReactNode;
}

const PASSWORD_STORAGE_KEY = 'profitlens_auth_token';
const CORRECT_PASSWORD = 'ProjectSafety2026'; // Client-side simple protection

export function PasswordGate({ children }: PasswordGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedAuth = localStorage.getItem(PASSWORD_STORAGE_KEY);
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CORRECT_PASSWORD) {
            localStorage.setItem(PASSWORD_STORAGE_KEY, 'true');
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setPassword('');
        }
    };

    if (isLoading) {
        return null; // Or a loading spinner if preferred
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 pb-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        ProfitLens Access
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Please enter the project password to continue.
                    </p>
                </div>

                <div className="p-8 pt-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError(false);
                                }}
                                placeholder="Enter password"
                                className={cn(
                                    "w-full px-4 py-3 rounded-lg border bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all",
                                    error
                                        ? "border-red-300 focus:ring-red-200 text-red-900 placeholder-red-300"
                                        : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900 text-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
                                )}
                                autoFocus
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-600 font-medium">
                                    Incorrect password. Please try again.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group"
                        >
                            <span>Access Application</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-400">
                            Authorized personnel only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
