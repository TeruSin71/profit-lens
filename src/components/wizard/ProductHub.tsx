import { PlusCircle, Edit3, Eye } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { useState } from 'react';
import { ProductSearch } from './ProductSearch';

interface ProductHubProps {
    onSelectMode: (mode: 'view' | 'edit' | 'create', productId?: string) => void;
}

export function ProductHub({ onSelectMode }: ProductHubProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [targetMode, setTargetMode] = useState<'view' | 'edit' | null>(null);

    const handleModeClick = (mode: 'create' | 'edit' | 'view') => {
        if (mode === 'create') {
            onSelectMode('create');
        } else {
            setTargetMode(mode);
            setIsSearchOpen(true);
        }
    };

    const handleProductSelect = (productId: string) => {
        if (targetMode) {
            onSelectMode(targetMode, productId);
            setIsSearchOpen(false);
            setTargetMode(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Product Management Hub</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Select a transaction type to manage your product catalog.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Create Mode (MM01) */}
                <Card
                    className="group cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    onClick={() => handleModeClick('create')}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent dark:from-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="flex flex-col items-center justify-center p-8 space-y-6 text-center relative z-10">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <PlusCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create Material</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Initial entry of material master data.
                            </p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded dark:bg-slate-800">T-Code: MM01</span>
                    </CardContent>
                </Card>

                {/* Change Mode (MM02) */}
                <Card
                    className="group cursor-pointer hover:border-amber-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    onClick={() => handleModeClick('edit')}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="flex flex-col items-center justify-center p-8 space-y-6 text-center relative z-10">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                            <Edit3 className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Change Material</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Modify existing material records.
                            </p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded dark:bg-slate-800">T-Code: MM02</span>
                    </CardContent>
                </Card>

                {/* Display Mode (MM03) */}
                <Card
                    className="group cursor-pointer hover:border-emerald-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    onClick={() => handleModeClick('view')}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="flex flex-col items-center justify-center p-8 space-y-6 text-center relative z-10">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                            <Eye className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Display Material</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Read-only view of material catalog.
                            </p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded dark:bg-slate-800">T-Code: MM03</span>
                    </CardContent>
                </Card>
            </div>

            {/* Product Search Modal */}
            <ProductSearch
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelect={handleProductSelect}
                mode={targetMode || 'view'}
            />
        </div>
    );
}
