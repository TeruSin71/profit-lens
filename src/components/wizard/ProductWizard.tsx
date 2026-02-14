import { useState, useEffect } from 'react';
import { WizardHeader } from './WizardHeader';
import { Step1ProductData } from './steps/Step1ProductData';
import { Step2InputConfig } from './steps/Step2InputConfig';
import { Step3CostDrivers } from './steps/Step3CostDrivers';
import { Step4LicenseManager } from './steps/Step4LicenseManager';
import { Step5Hardware } from './steps/Step5Hardware';
import { Step6ExecutiveInsights } from './steps/Step6ExecutiveInsights';
import { ProductHub } from './ProductHub';
import { UnsavedChangesModal } from '../modals/UnsavedChangesModal';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export function ProductWizard() {
    // Top-Level Mode: 'hub' (selector) or 'wizard' (active flow)
    const [view, setView] = useState<'hub' | 'wizard'>('hub');

    // Wizard State
    const [currentStep, setCurrentStep] = useState(1);
    const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');
    const [activeProductId, setActiveProductId] = useState<string | null>(null);

    // Dirty State & Navigation Guard
    const [isDirty, setIsDirty] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<'exit' | null>(null);

    // Store Access
    const {
        products,
        globalSettings,
        costDrivers,
        licenses,
        hardware,
        projectedFleetSize,
        setGlobalSetting,
        setCostDriver,
        toggleLicense,
        setProjectedFleetSize,
        addHardware,
        updateHardware,
        deleteHardware,
        addProduct,
        updateProduct
    } = useStore();

    // Local Product State (for Step 1)
    const [productData, setProductData] = useState<{
        internalMaterialCode: string;
        externalMaterialCode: string;
        cogsType?: 'Subscription' | 'License' | 'Subscription & License';
        description: string;
        analysisPrompt?: string; // Track prompt in wizard state
        createdAt?: string;
        updatedAt?: string;
    }>({
        internalMaterialCode: '',
        externalMaterialCode: '',
        cogsType: undefined,
        description: '',
        analysisPrompt: '' // Init default
    });

    // Browser Navigation Guard
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; // Standard for modern browsers
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // Keyboard Navigation Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                // Check if focused element is a textarea
                const activeElement = document.activeElement;
                const isTextarea = activeElement?.tagName === 'TEXTAREA';

                // Skip if in textarea (allow new lines)
                if (isTextarea) return;

                // Check validation before proceeding
                if (isStepValid() && currentStep < 6) {
                    // Prevent default to avoid form submissions if strict
                    e.preventDefault();
                    setCurrentStep(prev => prev + 1);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentStep, productData, isDirty]); // Dependencies for validation check

    // --- ACTIONS ---

    const handleStartWizard = (newMode: 'view' | 'edit' | 'create', productId?: string) => {
        setMode(newMode);
        setCurrentStep(1);
        setActiveProductId(productId || null);
        setIsDirty(false); // Reset dirty state on start

        if (newMode === 'create') {
            // Reset for new entry
            setProductData({
                internalMaterialCode: '', // Will be generated on save
                externalMaterialCode: '',
                cogsType: undefined,
                description: ''
            });
            // Ideally we'd reset other store parts too, but for now we keep global settings
        } else if (productId) {
            // Load existing data
            const product = products.find(p => p.id === productId);
            if (product) {
                setProductData({
                    internalMaterialCode: product.materialCode,
                    externalMaterialCode: product.externalMaterialCode || '',
                    cogsType: product.cogsType,
                    description: product.description,
                    analysisPrompt: product.analysisPrompt,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                });
            }
        }

        setView('wizard');
    };

    const markDirty = () => {
        if (!isDirty && mode !== 'view') {
            setIsDirty(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            // Attempting to exit to Hub
            if (isDirty && mode !== 'view') {
                setPendingAction('exit');
                setShowModal(true);
            } else {
                setView('hub');
                setIsDirty(false);
            }
        }
    };

    const handleNext = () => {
        if (currentStep < 6) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleSave = () => {
        if (mode === 'create') {
            // Create new product
            const newProduct: Product = {
                id: uuidv4(),
                materialCode: '', // Handled by store/backend
                description: productData.description,
                cogsType: productData.cogsType,
                externalMaterialCode: productData.externalMaterialCode
            };
            addProduct(newProduct);
        } else if (mode === 'edit' && activeProductId) {
            // Update existing product
            updateProduct(activeProductId, {
                description: productData.description,
                cogsType: productData.cogsType,
                externalMaterialCode: productData.externalMaterialCode
            });
        }

        // Return to Hub after save
        setIsDirty(false);
        setView('hub');
    };

    // Modal Actions
    const handleDiscard = () => {
        setShowModal(false);
        setIsDirty(false);
        if (pendingAction === 'exit') {
            setView('hub');
        }
        setPendingAction(null);
    };

    const handleSaveAndExit = () => {
        handleSave(); // This handles saving and navigation
        setShowModal(false);
        setPendingAction(null);
    };

    const handleCancelExit = () => {
        setShowModal(false);
        setPendingAction(null);
    };

    const handleClose = () => {
        if (isDirty && mode !== 'view') {
            setPendingAction('exit');
            setShowModal(true);
        } else {
            setView('hub');
            setIsDirty(false);
        }
    };

    // --- VALIDATION ---
    const isStepValid = () => {
        if (currentStep === 1) {
            // Description is required
            return productData.description.trim().length > 0;
        }
        return true;
    };

    // --- RENDER ---

    if (view === 'hub') {
        return <ProductHub onSelectMode={handleStartWizard} />;
    }

    const stepTitles = [
        "Material Identification",
        "Profitability Configuration",
        "Cost Drivers Definition",
        "License Management",
        "Hardware & Integration",
        "Executive Market Insights"
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <UnsavedChangesModal
                isOpen={showModal}
                onSaveAndExit={handleSaveAndExit}
                onDiscard={handleDiscard}
                onCancel={handleCancelExit}
                sectionName={stepTitles[currentStep - 1]}
            />

            <WizardHeader
                currentStep={currentStep}
                totalSteps={6}
                title={stepTitles[currentStep - 1]}
                materialCode={productData.internalMaterialCode || (mode === 'create' ? 'NEW' : '')}
                onBack={handleBack}
                onNext={handleNext}
                onSave={handleSave}
                onClose={handleClose}
                isNextDisabled={!isStepValid()}
                mode={mode}
            />

            <main className="max-w-4xl mx-auto px-4 md:px-8">
                {currentStep === 1 && (
                    <Step1ProductData
                        data={productData}
                        onChange={(field, value) => {
                            setProductData(prev => ({ ...prev, [field]: value }));
                            markDirty();
                        }}
                        mode={mode}
                    />
                )}
                {currentStep === 2 && (
                    <Step2InputConfig
                        settings={globalSettings}
                        onChange={(k, v) => {
                            setGlobalSetting(k, v);
                            markDirty();
                        }}
                        mode={mode}
                    />
                )}
                {currentStep === 3 && (
                    <Step3CostDrivers
                        data={costDrivers}
                        onChange={(k, v) => {
                            setCostDriver(k, v);
                            markDirty();
                        }}
                        mode={mode}
                    />
                )}
                {currentStep === 4 && (
                    <Step4LicenseManager
                        licenses={licenses}
                        onToggle={(id, val) => {
                            toggleLicense(id, val);
                            markDirty();
                        }}
                        mode={mode}
                    />
                )}
                {currentStep === 5 && (
                    <Step5Hardware
                        projectedFleetSize={projectedFleetSize}
                        onFleetSizeChange={(val) => {
                            setProjectedFleetSize(val);
                            markDirty();
                        }}
                        hardware={hardware}
                        onAddHardware={(item) => {
                            addHardware(item);
                            markDirty();
                        }}
                        onUpdateHardware={(id, updates) => {
                            updateHardware(id, updates);
                            markDirty();
                        }}
                        onDeleteHardware={(id) => {
                            deleteHardware(id);
                            markDirty();
                        }}
                        mode={mode}
                    />
                )}
                {currentStep === 6 && (
                    <Step6ExecutiveInsights
                        mode={mode}
                        draftProduct={{
                            description: productData.description,
                            analysisPrompt: productData.analysisPrompt
                        }}
                        onPromptChange={(val) => {
                            setProductData(prev => ({ ...prev, analysisPrompt: val }));
                            markDirty();
                        }}
                    />
                )}
            </main>
        </div>
    );
}
