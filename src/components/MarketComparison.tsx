import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchCompetitorAnalysis, Competitor } from '../services/geminiService';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { generateMarketReport } from '../utils/pdfGenerator';
import { Loader2, TrendingDown, Scale, Search, Sparkles, AlertCircle, FileDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { CalculatorData } from '../types';

export function MarketComparison() {
    const { savedScenarios } = useStore();
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [loading, setLoading] = useState(false);
    const [productDescription, setProductDescription] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const selectedScenario = savedScenarios.find(s => s.id === selectedScenarioId);

    // Auto-select first scenario if valid
    useEffect(() => {
        if (savedScenarios.length > 0 && !selectedScenarioId) {
            setSelectedScenarioId(savedScenarios[0].id);
        }
    }, [savedScenarios, selectedScenarioId]);

    const handleDownloadReport = () => {
        if (!selectedScenario) return;
        // Use monthly data as the baseline for the report
        generateMarketReport(
            selectedScenario.results.monthly,
            selectedScenario.inputs.globalSettings.planPrice,
            "Monthly",
            competitors
        );
    };

    const handleManualAnalyze = async () => {
        if (!productDescription.trim()) return;

        setLoading(true);
        setHasSearched(true);
        setError(null);
        try {
            const results = await fetchCompetitorAnalysis(productDescription);
            if (results.competitors.length === 0) {
                setError("Unable to fetch data. Please check your network or try again.");
            }
            setCompetitors(results.competitors);

            // Optional: Warn if using cached data
            if (results.source === 'cached') {
                setError("Live analysis unavailable. Showing cached data.");
            }
        } catch (err: any) {
            console.error("Market analysis failed:", err);
            // Display the specific error message thrown by the service
            const msg = err.message || "An unexpected error occurred. Please check console.";
            setError(msg);
            window.alert(`Analysis Error: ${msg}\n\nSee console for step-by-step logs.`);
            setCompetitors([]);
        } finally {
            setLoading(false);
        }
    };

    const getPriceValue = (priceStr: string) => {
        if (!priceStr) return 0;
        // Extract number from string like "$55.00", handle "Per Camera" text gracefully (returns 0 or NaN)
        return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    };

    const isCheaper = (ourPrice: number, competitorPriceStr: string) => {
        const theirPrice = getPriceValue(competitorPriceStr);
        // Only compare if we successfully extracted a number
        if (theirPrice === 0) return false;
        return ourPrice < theirPrice;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Live Market Analysis</h2>
                    <p className="text-slate-500 dark:text-slate-400">Benchmark your unit economics against real-world data from the Gemini API.</p>
                </div>
                {selectedScenario && (
                    <Button
                        variant="outline"
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                        <FileDown className="w-4 h-4" />
                        Download Report
                    </Button>
                )}
            </div>

            {/* Controller Section */}
            <Card className="border-indigo-100 shadow-sm bg-white dark:bg-slate-900 dark:border-indigo-900">
                <CardContent className="p-6 space-y-6">
                    {/* Scenario Selection */}
                    <div className="flex items-center gap-6">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Scenario to Compare</label>
                            <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose a saved scenario..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {savedScenarios.map(scenario => (
                                        <SelectItem key={scenario.id} value={scenario.id}>
                                            {scenario.name} ({scenario.formattedDate})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-4 dark:border-slate-800"></div>

                    {/* Interactive competitor Search */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 dark:text-slate-300">
                                <Search className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                Find Real Competitors
                            </label>
                            <span className={cn("text-xs", productDescription.length > 800 ? "text-red-500" : "text-slate-400")}>
                                {productDescription.length}/800
                            </span>
                        </div>
                        <div className="flex gap-4 items-start">
                            <Textarea
                                placeholder="Describe your product (e.g., 'A solar-powered coffee maker for camping')..."
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value.slice(0, 800))}
                                className="flex-1 min-h-[80px] resize-none bg-slate-50 focus:bg-white transition-colors dark:bg-slate-800 dark:focus:bg-slate-900 dark:border-slate-700"
                            />
                            <Button
                                onClick={handleManualAnalyze}
                                disabled={!productDescription.trim() || loading}
                                className="h-[80px] w-[160px] flex flex-col gap-1 bg-indigo-600 hover:bg-indigo-700"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="text-xs">Searching...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Analyze Market</span>
                                    </>
                                )}
                            </Button>
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 font-medium pl-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </p>
                        )}
                        {!hasSearched && !error && (
                            <p className="text-sm text-slate-500 italic pl-1">
                                Enter your product description above to scan the market for real competitors and prices.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Comparison Grid */}
            {selectedScenario ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Our Economics */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Our Unit Economics</h3>
                        </div>

                        <div className="space-y-4">
                            <EconomicsCard
                                title="Monthly Plan"
                                data={selectedScenario.results.monthly}
                                price={selectedScenario.inputs.globalSettings.planPrice}
                                currency={selectedScenario.inputs.globalSettings.currency}
                            />
                            <EconomicsCard
                                title="6-Month Term"
                                data={selectedScenario.results.sixMonth}
                                price={selectedScenario.inputs.globalSettings.planPrice}
                                currency={selectedScenario.inputs.globalSettings.currency}
                            />
                            <EconomicsCard
                                title="Yearly Contract"
                                data={selectedScenario.results.yearly}
                                price={selectedScenario.inputs.globalSettings.planPrice}
                                currency={selectedScenario.inputs.globalSettings.currency}
                                highlight
                            />
                        </div>
                    </div>

                    {/* Right Column: Generic Competitor Landscape */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Market Intelligence</h3>
                            </div>
                            {loading && <span className="text-xs text-indigo-600 font-medium animate-pulse">Live Updating...</span>}
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl dark:bg-slate-800/10 dark:border-slate-800">
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Searching live market...</p>
                                        <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Fetching competitors via Gemini AI</p>
                                    </div>
                                </div>
                                {[1, 2].map(i => (
                                    <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : hasSearched && competitors.length > 0 ? (
                            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[25%]">Competitor</TableHead>
                                            <TableHead className="w-[20%]">Price</TableHead>
                                            <TableHead className="w-[30%]">Key Features</TableHead>
                                            <TableHead className="w-[25%]">Target Audience</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {competitors.map((comp, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                                                    {comp.name}
                                                    {isCheaper(selectedScenario.inputs.globalSettings.planPrice, comp.price) && (
                                                        <span className="block mt-1 text-xs font-bold text-emerald-600 flex items-center dark:text-emerald-400">
                                                            <TrendingDown className="w-3 h-3 mr-1" />
                                                            We're Lower
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-slate-600 dark:text-slate-400">
                                                    <span className="inline-block px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                                                        {comp.price}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                    {comp.features}
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                                    {comp.audience}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : hasSearched && competitors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 dark:bg-slate-800/10 dark:border-slate-800 dark:text-slate-400">
                                <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                                <p>No competitors found. Try a different description.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 dark:bg-slate-800/10 dark:border-slate-800 dark:text-slate-500">
                                <Search className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-medium text-slate-600 dark:text-slate-400">No Market Data Yet</p>
                                <p className="text-sm px-8 text-center mt-2">Enter a product description above to see real-world competitor pricing.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 mt-8 dark:bg-slate-800/10 dark:border-slate-800 dark:text-slate-500">
                    <Scale className="w-12 h-12 mb-4 opacity-50" />
                    <p className="font-medium text-slate-600 dark:text-slate-400">No Scenario Selected</p>
                    <p className="text-sm">Please select or create a scenario to begin analysis.</p>
                </div>
            )}
        </div>
    );
}

function EconomicsCard({ title, data, price, currency, highlight }: { title: string, data: CalculatorData, price: number, currency: string, highlight?: boolean }) {
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

    return (
        <Card className={cn("border-l-4 transition-all hover:shadow-md dark:bg-slate-900 dark:border-slate-800", highlight ? "border-l-indigo-500 ring-1 ring-indigo-50 dark:ring-indigo-900" : "border-l-slate-300 dark:border-l-slate-600")}>
            <CardContent className="p-5 flex justify-between items-center">
                <div>
                    <h4 className="font-semibold text-slate-500 text-sm uppercase tracking-wide dark:text-slate-400">{title}</h4>
                    <div className="text-2xl font-bold text-slate-900 mt-1 dark:text-slate-100">
                        {symbol}{price.toFixed(2)}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-400">COGS: <span className="font-medium">{symbol}{data.totalCost.toFixed(2)}</span></div>
                    <div className={cn(
                        "text-sm font-bold mt-1",
                        data.marginPercent > 70 ? "text-emerald-600 dark:text-emerald-400" : data.marginPercent > 40 ? "text-amber-600 dark:text-amber-400" : "text-red-500 dark:text-red-400"
                    )}>
                        {data.marginPercent.toFixed(1)}% Margin
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
