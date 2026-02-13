import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Product } from '../types';
import { Trash2, Package, Plus, Save } from 'lucide-react';
import { cn } from '../lib/utils';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

export const ProductManager = () => {
    const { products, addProduct, deleteProduct } = useStore();
    const [newMaterialCode, setNewMaterialCode] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const handleAddProduct = () => {
        if (!newMaterialCode.trim() || !newDescription.trim()) return;

        const newProduct: Product = {
            id: generateId(),
            materialCode: newMaterialCode,
            description: newDescription
        };

        addProduct(newProduct);
        setNewMaterialCode('');
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

            <div className="grid gap-6 md:grid-cols-3">
                {/* Add New Product Form */}
                <Card className="md:col-span-1 border-indigo-100 shadow-sm dark:border-indigo-900">
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
                                placeholder="e.g. MAT-001"
                                value={newMaterialCode}
                                onChange={(e) => setNewMaterialCode(e.target.value)}
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
                            disabled={!newMaterialCode || !newDescription}
                            className={cn(
                                "flex items-center justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                (!newMaterialCode || !newDescription) ? "opacity-50 cursor-not-allowed" : ""
                            )}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Product
                        </button>
                    </CardContent>
                </Card>

                {/* Product List */}
                <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-base text-slate-700 dark:text-slate-200">Existing Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {products.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg dark:border-slate-700 dark:text-slate-400">
                                <Package className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                                <p>No products added yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    <div className="col-span-3">Material Code</div>
                                    <div className="col-span-8">Description</div>
                                    <div className="col-span-1 text-right">Action</div>
                                </div>
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="grid grid-cols-12 gap-4 items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors dark:bg-slate-800/50 dark:border-slate-800 dark:hover:border-indigo-800"
                                    >
                                        <div className="col-span-3 font-medium text-slate-900 truncate dark:text-slate-200">
                                            {product.materialCode}
                                        </div>
                                        <div className="col-span-8 text-slate-600 truncate dark:text-slate-400">
                                            {product.description}
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
