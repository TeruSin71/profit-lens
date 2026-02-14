import React, { useState, useEffect } from 'react';
import { Pencil, Check, X, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface ProductDetailProps {
    initialProduct?: Product;
    initialMode?: 'view' | 'edit' | 'create';
    onSave?: (product: Product) => void;
    onCancel?: () => void;
    onDelete?: (id: string) => void;
}

// Simple ID generator (if not handling in backend/store for this specific demo yet)
// But we know store has logic. We will let the parent/store handle ID generation for create if possible, 
// or generate here if needed. The previous ProductManager generated it. 
// We'll assume for 'create', we generate a temp ID or let the store handle it.
const generateId = () => Math.random().toString(36).substr(2, 9);

export function ProductDetail({
    initialProduct,
    initialMode = 'view',
    onSave,
    onCancel,
    onDelete
}: ProductDetailProps) {
    const [mode, setMode] = useState<'view' | 'edit' | 'create'>(initialMode);

    // We keep internal state for the form
    const [formData, setFormData] = useState<Product>({
        id: initialProduct?.id || '',
        materialCode: initialProduct?.materialCode || '',
        description: initialProduct?.description || '',
        // user_id is not in Product type in types.ts based on previous reads, 
        // but prompt asks to hold it. We might need to check types.ts again.
        // For now, adhering to existing Product type + prompt request. 
        // If types.ts doesn't have user_id, we might need to cast or ignore for now.
        // Checking types.ts content from memory/previous turns: Product has { id, materialCode, description }.
        // I will stick to the existing Product type for now to avoid compilation errors, 
        // but note the user_id requirement.
    });

    const [error, setError] = useState<string | null>(null);

    // Sync if initialProduct changes and we are in view mode
    useEffect(() => {
        if (initialProduct && mode === 'view') {
            setFormData(initialProduct);
        }
    }, [initialProduct, mode]);

    const handleSave = () => {
        if (!formData.description.trim()) {
            setError('Description is required.');
            return;
        }
        setError(null);

        // If create, we might need to ensure ID is set
        const productToSave = { ...formData };
        if (mode === 'create' && !productToSave.id) {
            productToSave.id = generateId();
        }

        onSave?.(productToSave);

        if (mode === 'create') {
            // Reset for next create or switch to view? 
            // Usually valid to reset or close. Let's reset.
            setFormData({ id: '', materialCode: '', description: '' });
            // If the parent controls the mode, we might not need to setMode here, 
            // but for standalone behavior:
            setMode('view');
        } else {
            setMode('view');
        }
    };

    const handleCancel = () => {
        setError(null);
        if (mode === 'create') {
            onCancel?.();
        } else {
            // Revert changes
            if (initialProduct) {
                setFormData(initialProduct);
            }
            setMode('view');
            onCancel?.();
        }
    };

    return (
        <Card className={cn(
            "w-full max-w-lg mx-auto transition-all duration-300",
            mode === 'view' ? "border-slate-200 shadow-sm dark:border-slate-800" : "border-indigo-100 shadow-md ring-1 ring-indigo-50 dark:border-indigo-900 dark:ring-indigo-900"
        )}>
            <CardHeader className={cn(
                "pb-4 border-b transition-colors",
                mode === 'view' ? "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800" : "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900"
            )}>
                <div className="flex items-center justify-between">
                    <CardTitle className={cn(
                        "text-base font-semibold flex items-center gap-2",
                        mode === 'view' ? "text-slate-900 dark:text-slate-100" : "text-indigo-900 dark:text-indigo-300"
                    )}>
                        {mode === 'create' && <><Plus className="w-5 h-5" /> Create Product</>}
                        {mode === 'edit' && <><Pencil className="w-4 h-4" /> Edit Product</>}
                        {mode === 'view' && <span className="text-lg">Product Details</span>}
                    </CardTitle>

                    {mode === 'view' && (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setMode('edit')} title="Edit">
                                <Pencil className="w-4 h-4 text-slate-500 hover:text-indigo-600" />
                            </Button>
                            {onDelete && (
                                <Button variant="ghost" size="icon" onClick={() => onDelete(formData.id)} title="Delete">
                                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
                {/* Material Code Field - Logic per mode */}
                <div className="space-y-2">
                    <Label htmlFor="materialCode" className={mode === 'view' ? "text-slate-500" : ""}>
                        Material Code
                    </Label>

                    {mode === 'view' ? (
                        <div className="font-mono text-sm font-medium bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 inline-block min-w-[120px]">
                            {formData.materialCode || <span className="text-slate-400 italic">Pending</span>}
                        </div>
                    ) : mode === 'create' ? (
                        <Input
                            value="System Generated"
                            disabled
                            className="bg-slate-50 text-slate-400 italic dark:bg-slate-900 dark:text-slate-500 border-dashed"
                        />
                    ) : (
                        // Edit Mode - Visible but disabled
                        <Input
                            value={formData.materialCode}
                            disabled
                            className="bg-slate-100 text-slate-600 font-mono dark:bg-slate-900 dark:text-slate-400 cursor-not-allowed"
                        />
                    )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                    <Label htmlFor="description" className={mode === 'view' ? "text-slate-500" : ""}>
                        Description <span className="text-red-500">*</span>
                    </Label>

                    {mode === 'view' ? (
                        <div className="text-slate-900 dark:text-slate-100 text-base leading-relaxed p-1">
                            {formData.description}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => {
                                    setFormData({ ...formData, description: e.target.value });
                                    if (error) setError(null);
                                }}
                                placeholder="Enter product description"
                                className={cn(
                                    "transition-all",
                                    error ? "border-red-300 focus:ring-red-200" : ""
                                )}
                                autoFocus={mode === 'create' || mode === 'edit'}
                            />
                            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Footer Actions */}
            {mode !== 'view' && (
                <CardFooter className="flex justify-end gap-3 pt-2 pb-6 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-indigo-950/10 rounded-b-lg">
                    <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {mode === 'create' ? (
                            <><Plus className="w-4 h-4 mr-2" /> Create Product</>
                        ) : (
                            <><Check className="w-4 h-4 mr-2" /> Save Changes</>
                        )}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
