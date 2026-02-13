import { useState } from 'react';
import { useStore } from '../store/useStore';
import { fetchCompetitors, Competitor } from '../services/geminiService';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, TrendingDown, Scale } from 'lucide-react';
import { cn } from '../lib/utils';
import { CalculatorData } from '../types';

export function MarketComparison() {
    const { savedScenarios } = useStore();
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
    const [description, setDescription] = useState('');
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [loading, setLoading] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);

    const selectedScenario = savedScenarios.find(s => s.id === selectedScenarioId);

    const handleAnalyze = async () => {
        if (!description.trim()) return;

        setLoading(true);
        setAnalyzed(false);
        try {
            const results = await fetchCompetitors(description);
            setCompetitors(results);
            setAnalyzed(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getPriceValue = (priceStr: string) => {
        // Extract number from string like "$55.00"
        return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    };

    const isCheaper = (ourPrice: number, competitorPriceStr: string) => {
        const theirPrice = getPriceValue(competitorPriceStr);
        return ourPrice < theirPrice;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Market Comparison</h2>
                <p className="text-slate-500">Benchmark your unit economics against real-world competitors using AI.</p>
            </div>

            {/* Controller Section */}
            <Card className="border-indigo-100 shadow-sm bg-white">
                <CardContent className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">1. Select Your Product Scenario</Label>
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
                            {savedScenarios.length === 0 && (
                                <p className="text-sm text-red-500">No saved scenarios found. Please create and save one in the Calculator first.</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-base font-semibold">2. Describe for Market Analysis</Label>
                                <span className={cn("text-xs", description.length > 800 ? "text-red-500" : "text-slate-400")}>
                                    {description.length}/800
                                </span>
                            </div>
                            <Textarea
                                placeholder="E.g., Enterprise-grade IoT tracking solution for logistics, including hardware and global connectivity..."
                                className="min-h-[100px] resize-none"
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value.slice(0, 800))}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={handleAnalyze}
                            disabled={!selectedScenarioId || !description || loading}
                            className="bg-indigo-600 hover:bg-indigo-700 min-w-[200px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing Market...
                                </>
                            ) : (
                                <>
                                    <Scale className="mr-2 h-4 w-4" />
                                    Analyze Market
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Comparison Grid */}
            {selectedScenario && (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Our Economics */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                            <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                            <h3 className="text-xl font-bold text-slate-900">Our Unit Economics</h3>
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

                    {/* Right Column: Competitor Landscape */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                            <h3 className="text-xl font-bold text-slate-900">Competitor Landscape</h3>
                        </div>

                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-slate-100 rounded-xl" />
                                ))}
                            </div>
                        ) : analyzed ? (
                            <div className="space-y-4">
                                {competitors.map((comp, idx) => (
                                    <Card key={idx} className="border-slate-200 shadow-sm bg-slate-50/50">
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg text-slate-800">{comp.name}</h4>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-slate-900">{comp.price_monthly}</div>
                                                    <span className="text-xs text-slate-500">per month</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-3 italic">"{comp.differentiation}"</p>

                                            {isCheaper(selectedScenario.inputs.globalSettings.planPrice, comp.price_monthly) && (
                                                <div className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md">
                                                    <TrendingDown className="w-3 h-3 mr-1" />
                                                    We are cheaper
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400">
                                <Scale className="w-12 h-12 mb-4 opacity-50" />
                                <p>Ready to analyze</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function EconomicsCard({ title, data, price, currency, highlight }: { title: string, data: CalculatorData, price: number, currency: string, highlight?: boolean }) {
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

    return (
        <Card className={cn("border-l-4 transition-all hover:shadow-md", highlight ? "border-l-indigo-500 ring-1 ring-indigo-50" : "border-l-slate-300")}>
            <CardContent className="p-5 flex justify-between items-center">
                <div>
                    <h4 className="font-semibold text-slate-500 text-sm uppercase tracking-wide">{title}</h4>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                        {symbol}{price.toFixed(2)}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-500">COGS: <span className="font-medium">{symbol}{data.totalCost.toFixed(2)}</span></div>
                    <div className={cn(
                        "text-sm font-bold mt-1",
                        data.marginPercent > 70 ? "text-emerald-600" : data.marginPercent > 40 ? "text-amber-600" : "text-red-500"
                    )}>
                        {data.marginPercent.toFixed(1)}% Margin
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
