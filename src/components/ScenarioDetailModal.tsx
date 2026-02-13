
import { SavedScenario, Currency } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Visualization } from './Visualization';

interface ScenarioDetailModalProps {
    scenario: SavedScenario;
    onClose: () => void;
}

const PlanColumn = ({
    title,
    data,
    highlight = false,
    symbol
}: {
    title: string;
    months: number;
    data: any;
    highlight?: boolean;
    symbol: string;
}) => {
    const { margin, marginPercent, revenue } = data;

    return (
        <Card className={cn(
            "relative transition-all duration-300",
            highlight ? "border-indigo-200 shadow-md ring-1 ring-indigo-50" : "border-slate-100"
        )}>
            {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Best Margin
                </div>
            )}
            <CardHeader className="pb-4">
                <CardTitle className="text-xl text-center text-slate-700">{title}</CardTitle>
                <div className="text-center pt-2">
                    <span className="text-3xl font-bold text-slate-900">{symbol}{margin.toFixed(2)}</span>
                    <span className="text-sm text-slate-500 block">Net Margin</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                    <span className="text-slate-500">Revenue</span>
                    <span className="font-medium text-slate-900">{symbol}{revenue.toFixed(2)}</span>
                </div>

                <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost Breakdown</p>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Cloud Infra</span>
                        <span className="text-red-500 font-medium">-{symbol}{data.costs.infra.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Connectivity</span>
                        <span className="text-red-500 font-medium">-{symbol}{data.costs.connectivity.toFixed(2)}</span>
                    </div>
                    {data.costs.licenses > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Licenses (SW)</span>
                            <span className="text-red-500 font-medium">-{symbol}{data.costs.licenses.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Transaction</span>
                        <span className="text-red-500 font-medium">-{symbol}{data.costs.transaction.toFixed(2)}</span>
                    </div>
                    {data.costs.labor > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Labor (COGS)</span>
                            <span className="text-red-500 font-medium">-{symbol}{data.costs.labor.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Billing Friction</span>
                        <span className="text-red-500 font-medium">-{symbol}{data.costs.billing.toFixed(2)}</span>
                    </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">Margin %</span>
                        <span className={cn(
                            "text-lg font-bold",
                            marginPercent > 70 ? "text-emerald-500" : marginPercent > 40 ? "text-amber-500" : "text-red-500"
                        )}>{marginPercent.toFixed(1)}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export function ScenarioDetailModal({ scenario, onClose }: ScenarioDetailModalProps) {
    if (!scenario) return null;

    const { inputs, results } = scenario;
    const { globalSettings } = inputs;
    const { monthly, sixMonth, yearly } = results;

    const getSymbol = (currency: Currency) => {
        switch (currency) {
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'AUD': return 'A$';
            case 'CNY': return '¥';
            case 'NZD': return 'NZ$';
            default: return '$';
        }
    };

    const symbol = getSymbol(globalSettings.currency);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto py-10">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 my-auto relative flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-xl z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{scenario.name}</h2>
                        <p className="text-slate-500">Saved on {scenario.formattedDate}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto">
                    {/* Comparison Columns */}
                    <div className="grid gap-6 md:grid-cols-3 mb-8">
                        <PlanColumn title="Monthly" months={1} data={monthly} symbol={symbol} />
                        <PlanColumn title="6-Month Term" months={6} data={sixMonth} symbol={symbol} />
                        <PlanColumn title="Yearly Contract" months={12} data={yearly} highlight={true} symbol={symbol} />
                    </div>

                    {/* Visualization */}
                    <div className="pt-4 border-t border-slate-100">
                        <Visualization
                            monthlyData={monthly}
                            yearlyData={yearly}
                            sixMonthData={sixMonth}
                            currency={globalSettings.currency}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
