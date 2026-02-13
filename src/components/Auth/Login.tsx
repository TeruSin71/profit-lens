import { SignIn } from "@clerk/clerk-react";

export default function Login() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8 flex flex-col items-center">
                <img src="/Logo.png" alt="SinTeru Logo" className="h-16 w-auto mb-4" />
                <h1 className="text-3xl font-bold text-slate-900">ProfitLens</h1>
                <p className="text-slate-600 mt-2 font-medium">Internal Unit Economics Calculator</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Keep dreaming Keep Winning</p>
            </div>
            <SignIn />
        </div>
    );
}
