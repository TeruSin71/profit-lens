import { AlertTriangle, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface UnsavedChangesModalProps {
    isOpen: boolean;
    onSaveAndExit: () => void;
    onDiscard: () => void;
    onCancel: () => void;
    sectionName?: string;
}

export function UnsavedChangesModal({
    isOpen,
    onSaveAndExit,
    onDiscard,
    onCancel,
    sectionName = "Transaction"
}: UnsavedChangesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md p-6 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Unsaved Changes</h2>
                    </div>

                    {/* Body */}
                    <div className="space-y-2">
                        <p className="text-slate-600 dark:text-slate-300">
                            You have unsaved changes in your <strong>{sectionName}</strong>.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Do you want to save your progress before leaving?
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            className="order-3 sm:order-1 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onDiscard}
                            className="order-2 sm:order-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Discard
                        </Button>
                        <Button
                            onClick={onSaveAndExit}
                            className="order-1 sm:order-3 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            Save & Exit
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
