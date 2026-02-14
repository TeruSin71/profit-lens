import { ArrowLeft, ArrowRight, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface WizardHeaderProps {
    currentStep: number;
    totalSteps: number;
    title: string;
    materialCode?: string;
    onBack: () => void;
    onNext: () => void;
    onSave?: () => void;
    onClose?: () => void;
    isNextDisabled?: boolean;
    isBackDisabled?: boolean;
    mode: 'view' | 'edit' | 'create';
}

export function WizardHeader({
    currentStep,
    totalSteps,
    title,
    materialCode,
    onBack,
    onNext,
    onSave,
    onClose,
    isNextDisabled = false,
    isBackDisabled = false,
    mode
}: WizardHeaderProps) {
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="flex flex-col space-y-4 mb-6 sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur z-10 py-4 border-b border-slate-200 dark:border-slate-800 transition-all">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        disabled={isBackDisabled}
                        className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Button>

                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none mt-1">
                            {title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {materialCode && (
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Material Code</span>
                            <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                                {materialCode}
                            </span>
                        </div>
                    )}

                    {!isLastStep ? (
                        <Button
                            onClick={onNext}
                            disabled={isNextDisabled}
                            className={cn(
                                "flex items-center gap-2",
                                isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:translate-x-0.5 transition-transform"
                            )}
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={onSave}
                            disabled={mode === 'view' || isNextDisabled} // Disable save in view mode
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                        >
                            <Save className="w-4 h-4" />
                            {mode === 'create' ? 'Create Product' : mode === 'edit' ? 'Save Changes' : 'Done'}
                        </Button>
                    )}

                    <div className="pl-2 border-l border-slate-200 dark:border-slate-800 ml-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </div>
        </div>
    );
}
