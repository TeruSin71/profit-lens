import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { ShieldAlert } from "lucide-react";

interface DomainGuardProps {
    children: React.ReactNode;
}

export default function DomainGuard({ children }: DomainGuardProps) {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) return null;

    const email = user.primaryEmailAddress?.emailAddress || "";
    const isValidDomain = email.endsWith("@gallagher.com");

    if (!isValidDomain) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
                    <p className="text-slate-600 mb-6">
                        This application is only available to authorized employees with a <strong>@gallagher.com</strong> email address.
                    </p>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6">
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Signed in as</p>
                        <p className="text-sm font-medium text-slate-900">{email}</p>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => signOut()}
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
