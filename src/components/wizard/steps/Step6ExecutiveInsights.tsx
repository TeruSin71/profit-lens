import { useState, useMemo } from 'react';
import { useStore } from '../../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    Line, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import {
    Loader2, Sparkles, TrendingUp,
    AlertCircle, Printer, DollarSign, Target, Users
} from 'lucide-react';
import { fetchCompetitorAnalysis, Competitor, AnalysisResult } from '../../../services/geminiService';
// import { cn } from '../../../lib/utils'; // unused

// Colors for charts
const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6', '#ec4899'];


interface Step6Props {
    mode?: 'view' | 'edit' | 'create';
    draftProduct?: {
        description: string;
        analysisPrompt?: string;
    };
    onPromptChange?: (val: string) => void;
}

export function Step6ExecutiveInsights({ mode = 'view', draftProduct, onPromptChange }: Step6Props) {
    const {
        products, activeProductId,
        globalSettings, costDrivers, licenses, projectedFleetSize
    } = useStore();

    const storedProduct = products.find(p => p.id === activeProductId);

    // Unified Product Data: specific logic for Create vs Edit/View
    const productDescription = mode === 'create' ? draftProduct?.description : storedProduct?.description;
    const analysisPrompt = mode === 'create' ? draftProduct?.analysisPrompt : storedProduct?.analysisPrompt;

    const handlePromptChangeInternal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (mode === 'create' && onPromptChange) {
            onPromptChange(val);
        } else if (activeProductId) {
            // Edit/View Mode - Update Store directly for persistence
            const { updateProduct } = useStore.getState();
            updateProduct(activeProductId, { analysisPrompt: val });
        }
    };

    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [analysisRun, setAnalysisRun] = useState(false);
    const [resultSource, setResultSource] = useState<'live' | 'cached' | null>(null);
    const [resultDate, setResultDate] = useState<string | undefined>(undefined);

    // ... (Charts calculation logic remains same)

    const runAnalysis = async () => {
        if (!productDescription) {
            setAiError("Product description is missing. Please complete Step 1.");
            return;
        }

        setLoadingAI(true);
        setAiError(null);
        setResultSource(null);

        try {
            const result: AnalysisResult = await fetchCompetitorAnalysis(
                productDescription,
                analysisPrompt
            );

            setCompetitors(result.competitors);
            setResultSource(result.source);
            setResultDate(result.cachedAt);
            setAnalysisRun(true);

            // If we got back a "cached" source, it implies live failed. Detailed error might be in result.error
            if (result.source === 'cached' && result.error) {
                setAiError(result.error);
            }

            // Audit Timestamp Update (Only for existing products, only if live success?)
            // We update it anyway to show activity
            if (activeProductId && result.source === 'live') {
                const { updateProduct } = useStore.getState();
                updateProduct(activeProductId, { updatedAt: new Date().toISOString() });
            }
        } catch (e: any) {
            // This catch block might not be reached if service handles everything, 
            // but strictly for safety if service throws unexpected error:
            setAiError(e.message || "An unexpected error occurred.");
            setAnalysisRun(false);
        } finally {
            setLoadingAI(false);
        }
    };

    // ... (Chart logic) ...
    // ... (Render logic update for prompt input value/onChange) ...


    // --- 1. Current Profitability Calculation ---
    // We recreate the logic from Calculator.tsx to get the current snapshot
    const currentFinancials = useMemo(() => {
        // Create a temporary "Scenario" object structure to reuse calculation logic if it existed as a pure function
        // Since we don't have a pure "calculate" function exposed from useStore (it's inside Calculator usually),
        // we might need to manually calculate or rely on a helper.
        // For this step, let's assume we implement a quick calc here or import one.
        // I will implement a local calculation to be safe using the variables we have.

        const monthlyRevenue = globalSettings.planPrice;

        // Costs
        const infra = (globalSettings.avgDataUsageGB * costDrivers.dataRatePerGB) +
            (globalSettings.avgStorageGB * costDrivers.storageRatePerGB) +
            (globalSettings.isAiEnabled ? costDrivers.computeSurchargePerAIUser : 0) +
            costDrivers.telemetryFeePerDevice;

        const connectivity = costDrivers.simFeePerActiveSIM +
            (globalSettings.isCellularEnabled ? costDrivers.connectionMaintenancePerDeviceYear / 12 : 0);

        const licenseCost = licenses.filter(l => l.isEnabled).reduce((acc, l) => {
            if (l.type === 'per-user') return acc + (l.costPerUnit || 0);
            if (l.type === 'block') {
                // Actually strictly, block licenses are usually amortized over fleet.
                // Let's keep it simple: cost per unit = (Block Price / Units Per Block)
                return acc + ((l.blockPrice || 0) / (l.unitsPerBlock || 1));
            }
            return acc;
        }, 0);

        // Hardware Amortization (Roughly over 36 months for visuals?)
        // The user prompt asked for "Hardware/Integration" in pie.
        // Realistically, Hardware is COGS (One-time) vs MRR (Recurring).
        // Let's calculate One-Time margin vs Recurring Margin?
        // Prompt says: "Gross Margin % vs. COGS" and "Cost Breakdown".
        // Let's stick to Monthly Recurring Economics for the main interaction.

        const labor = costDrivers.agentMonthlyRate * (globalSettings.laborMode === 'advanced' ? 1 : 0);

        const totalMonthlyCost = infra + connectivity + licenseCost + labor;
        const margin = monthlyRevenue - totalMonthlyCost;
        const marginPercent = monthlyRevenue > 0 ? (margin / monthlyRevenue) * 100 : 0;

        return {
            revenue: monthlyRevenue,
            totalCost: totalMonthlyCost,
            margin,
            marginPercent,
            breakdown: [
                { name: 'Infra & Data', value: infra },
                { name: 'Connectivity', value: connectivity },
                { name: 'Licenses', value: licenseCost },
                { name: 'Labor', value: labor },
            ].filter(i => i.value > 0)
        };
    }, [globalSettings, costDrivers, licenses]);

    // --- 2. Trend Projection Data ---
    const trendData = useMemo(() => {
        const points = [100, 500, 1000, 5000, 10000, 50000];
        // Calculate economics for each fleet size
        // Key differentiator: Fixed costs (like Licenses blocks) or Volume tiers (if we had them).
        // For now, our model is linear except for "Block" licenses which become more efficient.

        return points.map(size => {
            // Recalculate block license efficiency
            const licenseCostTotal = licenses.filter(l => l.isEnabled).reduce((acc, l) => {
                if (l.type === 'per-user') return acc + (l.costPerUnit || 0) * size;
                if (l.type === 'block') {
                    const blocks = Math.ceil(size / (l.unitsPerBlock || 1));
                    return acc + (blocks * (l.blockPrice || 0));
                }
                return acc;
            }, 0);

            const unitLicenseCost = licenseCostTotal / size;

            // Linear costs
            const unitRevenue = globalSettings.planPrice;
            const unitVariableCost = (currentFinancials.totalCost - (currentFinancials.breakdown.find(b => b.name === 'Licenses')?.value || 0)) + unitLicenseCost;

            const totalRevenue = unitRevenue * size;
            const totalCost = unitVariableCost * size;
            const margin = totalRevenue - totalCost;

            return {
                size,
                revenue: totalRevenue,
                profit: margin,
                marginPercent: (margin / totalRevenue) * 100
            };
        });
    }, [currentFinancials, globalSettings, licenses]);

    // --- 3. Gemini Analysis ---
    // (Consolidated above)


    // --- 4. Currency Symbol ---
    const currencySymbol = useMemo(() => {
        return globalSettings.currency === 'EUR' ? '€' :
            globalSettings.currency === 'GBP' ? '£' : '$';
    }, [globalSettings.currency]);

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* Header / Summary Block */}
            <Card className="bg-slate-50 dark:bg-slate-900 border-indigo-100 dark:border-indigo-900">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-wide">
                                {productDescription || "New Product"}
                            </h2>
                            <span className="px-2 py-0.5 rounded text-xs font-mono bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                                {storedProduct?.materialCode || "000000000"}
                            </span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 flex gap-4">
                            <span>External ID: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{storedProduct?.externalMaterialCode || "N/A"}</span></span>
                            <span>Fleet Size: <span className="font-medium text-slate-700 dark:text-slate-300">{projectedFleetSize.toLocaleString()} devices</span></span>
                        </div>
                    </div>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        <Printer className="w-4 h-4" />
                        Print Material Master
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Profitability Profile (Donut) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-500" />
                            Unit Profitability Profile
                        </CardTitle>
                        <CardDescription>Margin vs. Cost (Monthly Recurring)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Margin', value: currentFinancials.margin },
                                        { name: 'Total Cost', value: currentFinancials.totalCost }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#22c55e" /> {/* Margin Green */}
                                    <Cell fill="#ef4444" /> {/* Cost Red */}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(val: number) => `${currencySymbol}${val.toFixed(2)}`}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                                    <tspan x="50%" dy="-1em" fontSize="12" fill="#888">Gross Margin</tspan>
                                    <tspan x="50%" dy="1.5em" fontSize="24" fontWeight="bold" fill="#22c55e">
                                        {currentFinancials.marginPercent.toFixed(1)}%
                                    </tspan>
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. Cost Breakdown (Pie) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-indigo-500" />
                            Cost Breakdown
                        </CardTitle>
                        <CardDescription>Distribution of Cost Drivers</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={currentFinancials.breakdown}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {currentFinancials.breakdown.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(val: number) => `${currencySymbol}${val.toFixed(2)}`}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Trend Projection (Line) - Spans Full Width */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                            Profitability Scale Projections
                        </CardTitle>
                        <CardDescription>Projected margins as fleet size scales (Efficiency Gains)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="size" tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} />
                                <YAxis yAxisId="left" orientation="left" stroke="#22c55e" tickFormatter={(val) => `${currencySymbol}${val}`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#8884d8" unit="%" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <RechartsTooltip labelFormatter={(val) => `Fleet Size: ${val} devices`} />
                                <Legend />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="profit"
                                    name="Total Profit"
                                    stroke="#22c55e"
                                    fillOpacity={1}
                                    fill="url(#colorProfit)"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="marginPercent"
                                    name="Margin %"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 4. Market Analysis (Gemini) - Spans Full Width */}
                <Card className="lg:col-span-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20">
                    <CardHeader className="flex flex-col space-y-4">
                        <div className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    AI Competitor Analysis
                                </CardTitle>
                                <CardDescription>
                                    Compare "{productDescription || "Product"}" against live market data using Gemini 2.0.
                                </CardDescription>
                            </div>
                        </div>

                        {/* Analysis Prompt Input */}
                        <div className="space-y-2">
                            <div className="relative">
                                <textarea
                                    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y border-indigo-200 dark:border-indigo-800 transition-all duration-300 ${(analysisPrompt?.length || 0) >= 800 ? "border-red-500 focus:border-red-500" : ""
                                        }`}
                                    placeholder="e.g., Analyze top 3 SaaS competitors in the European market with enterprise-grade security features..."
                                    maxLength={800}
                                    value={analysisPrompt || ''}
                                    onChange={handlePromptChangeInternal}
                                    disabled={loadingAI}
                                />
                                <div className={`absolute bottom-2 right-2 text-[10px] font-mono ${(analysisPrompt?.length || 0) >= 800 ? "text-red-500 font-bold" : "text-slate-400"
                                    }`}>
                                    {analysisPrompt?.length || 0} / 800
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={runAnalysis}
                                disabled={loadingAI || !analysisPrompt}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
                            >
                                {loadingAI ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                {loadingAI ? 'Analyzing...' : 'Run Analysis'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {aiError && (
                            <div className="mb-4 p-4 rounded bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 dark:bg-red-900/30 dark:border-red-900 dark:text-red-300">
                                <AlertCircle className="h-4 w-4" />
                                <div>
                                    <p className="font-bold">Analysis Error</p>
                                    <p className="text-sm">{aiError}</p>
                                </div>
                            </div>
                        )}

                        {resultSource === 'cached' && (
                            <div className="mb-4 p-4 rounded bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2 dark:bg-amber-900/20 dark:border-amber-900 dark:text-amber-200">
                                <AlertCircle className="h-4 w-4" />
                                <div>
                                    <p className="font-bold">Using Cached Market Data</p>
                                    <p className="text-xs opacity-80">
                                        Live analysis unavailable. Showing last known snapshot from {resultDate ? new Date(resultDate).toLocaleDateString() : 'Unknown'}.
                                    </p>
                                </div>
                            </div>
                        )}

                        {!analysisRun && !loadingAI && !competitors.length ? (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400 flex flex-col items-center">
                                <Users className="w-12 h-12 opacity-20 mb-2" />
                                <p>Click "Run Analysis" to fetch competitor pricing and feature sets.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-3">
                                {loadingAI ? (
                                    // Skeletons
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-40 bg-white/50 dark:bg-slate-800/50 rounded-lg animate-pulse" />
                                    ))
                                ) : (
                                    competitors.map((comp, idx) => (
                                        <Card key={idx} className="bg-white dark:bg-slate-900 border-indigo-100 dark:border-slate-700">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex justify-between items-center">
                                                    <span className="truncate max-w-[120px]" title={comp.name}>{comp.name}</span>
                                                    <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">{comp.price}</span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="text-xs space-y-2">
                                                <div>
                                                    <span className="font-semibold text-xs text-slate-400 uppercase">Features</span>
                                                    <p className="text-slate-700 dark:text-slate-300 line-clamp-3">{comp.features}</p>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-xs text-slate-400 uppercase">Audience</span>
                                                    <p className="text-slate-600 dark:text-slate-400">{comp.audience}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

// Helper types if needed in this file
export default Step6ExecutiveInsights;
