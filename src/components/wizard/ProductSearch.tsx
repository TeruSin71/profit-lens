import { useState, useEffect } from 'react';
import { Search, Loader2, X, Package } from 'lucide-react';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { productService, SearchResult } from '../../services/productService';

interface ProductSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (productId: string) => void;
    mode: 'edit' | 'view';
}

export function ProductSearch({ isOpen, onClose, onSelect, mode }: ProductSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce Logic (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Search Effect
    useEffect(() => {
        if (debouncedQuery.trim().length > 0) {
            setLoading(true);
            productService.searchProducts(debouncedQuery)
                .then(data => {
                    setResults(data);
                    setLoading(false);
                });
        } else {
            setResults([]);
            setLoading(false);
        }
    }, [debouncedQuery]);

    const handleSelect = (productId: string) => {
        onSelect(productId);
        onClose();
        setQuery(''); // Reset on select
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <DialogHeader className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {mode === 'edit' ? <Package className="w-5 h-5 text-blue-600" /> : <Search className="w-5 h-5 text-indigo-600" />}
                        {mode === 'edit' ? 'Change Material' : 'Display Material'}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Search for a material to {mode}.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by Material ID (e.g. 000000001), External Code, or Description..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9 h-10 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="min-h-[300px] max-h-[300px] overflow-y-auto rounded-md border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20">
                        {loading ? (
                            <div className="flex h-full items-center justify-center text-slate-500">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                Searching...
                            </div>
                        ) : results.length > 0 ? (
                            <div className="p-2 space-y-1">
                                {results.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSelect(product.id)}
                                        className="w-full text-left p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 transition-all group flex items-start gap-3"
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                {product.materialCode}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 truncate">
                                                {product.description}
                                            </div>
                                            {product.externalMaterialCode && (
                                                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                    <span className="uppercase tracking-wider opacity-70">Ext:</span>
                                                    <span className="font-mono">{product.externalMaterialCode}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-1 rounded-full">
                                                Select
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : query.length > 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-slate-500 gap-2">
                                <Search className="h-8 w-8 opacity-20" />
                                <p>No results found for "{query}"</p>
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-2 opacity-60">
                                <Package className="h-8 w-8 opacity-20" />
                                <p>Start typing to search products...</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
