import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Product } from '../types';
import { Plus, Save } from 'lucide-react';
import { cn } from '../lib/utils';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

export const ProductManager = () => {
    const { addProduct } = useStore();
    const [newDescription, setNewDescription] = useState('');

    const handleAddProduct = () => {
        if (!newDescription.trim()) return;

        const newProduct: Product = {
            id: generateId(),
            materialCode: '', // Auto-assigned by store
            description: newDescription
        };

        addProduct(newProduct);
        setNewDescription('');
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Product Data</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage product catalog for profitability analysis.</p>
                </div>
            </div>

            <div className="max-w-lg mx-auto">
                {/* Add New Product Form */}
                <Card className="border-indigo-100 shadow-sm dark:border-indigo-900">
                    <CardHeader className="bg-indigo-50/50 pb-4 dark:bg-indigo-950/20">
                        <CardTitle className="text-base font-semibold text-indigo-900 flex items-center dark:text-indigo-300">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Product
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="materialCode">Material Code</Label>
                            <Input
                                id="materialCode"
                                placeholder="ID will be assigned"
                                value=""
                                disabled
                                className="bg-slate-50 text-slate-500 italic dark:bg-slate-900 dark:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="e.g. Premium Widget"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleAddProduct}
                            disabled={!newDescription}
                            className={cn(
                                "flex items-center justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                (!newDescription) ? "opacity-50 cursor-not-allowed" : ""
                            )}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Product
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
