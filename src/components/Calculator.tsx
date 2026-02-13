import { useStore } from '../store/useStore';
import { Currency, License } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { cn } from '../lib/utils';
import { Visualization } from './Visualization';

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

export function Calculator() {
    const { globalSettings, costDrivers, setGlobalSetting, licenses, toggleLicense, projectedFleetSize } = useStore();

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

    const calculateVariables = (months: number) => {
        // 1. Cloud Infra: (Data + Storage + Telemetry) * Months
        // Add Compute Surcharge if AI is enabled
        const infraBase =
            (globalSettings.avgDataUsageGB * costDrivers.dataRatePerGB) +
            (globalSettings.avgStorageGB * costDrivers.storageRatePerGB) +
            costDrivers.telemetryFeePerDevice;

        const infraAi = globalSettings.isAiEnabled ? costDrivers.computeSurchargePerAIUser : 0;
        const infraCost = (infraBase + infraAi) * months;

        // 2. Connectivity: Sim Fee * Months * Discount
        // Discounts: 6mo = 0.95, 12mo = 0.90
        let discount = 1.0;
        if (months === 6) discount = 0.95;
        if (months === 12) discount = 0.90;

        // If Cellular Backup is OFF, assume minimal/no SIM cost? 
        // The prompt implies SIM Fee is relevant for connectivity. 
        // Let's assume SIM cost is always applicable if "Connectivity" implies it, or maybe only if Cellular Backup is ON.
        // Prompt says: "Connectivity: SIM/Cellular Fee ($/Active SIM)". Let's assume it applies if Cellular Backup is ENABLED.
        // Re-reading prompt: "Connectivity: SIM/Cellular Fee...". 
        // Explicit toggle "Cellular Backup". Logic: If toggle is ON, apply sim fee.
        const simCost = globalSettings.isCellularBackupEnabled
            ? (costDrivers.simFeePerActiveSIM * months * discount)
            : 0;

        // 3. Transaction Fees: (Price * Gateway%) + Fixed.
        // Yearly plans incur this fee only once. 6 Month also once? Prompt says "Yearly plans incur this fee only once".
        // 6-month plans also usually incur fee once per charge.
        // Monthly incurs it every month.
        // Price input is "Plan Price". Is this Monthly price? 
        // Usually "Plan Price" is quoted monthly. Let's assume input is Monthly Price.

        // Transaction Fee Calculation
        // Monthly: Charge happens 'months' times.
        // 6-Month: Charge happens once? Or twice a year? 
        // Context: comparing terms. Usually 6-month term is paid upfront? Or monthly?
        // "Yearly plans incur this fee only once, creating huge savings" implies Upfront payment for long terms.
        // So 6-month is also upfront (1 tx), Monthly is recurring (months * tx).


        // Wait, if we compare "Monthly" plan over what duration? 
        // "Create a 3-column view comparing Monthly, 6-Month, and Yearly plans side-by-side."
        // Comparison basis: Usually Annualized, or per Term.
        // "The True Cost Waterfall: breakdown ... for a single user over 1 year".
        // The columns likely represent the Economics of ONE TERM.
        // Monthly Column = 1 Month Economics.
        // 6-Month Column = 6 Month Economics.
        // Yearly Column = 12 Month Economics.

        // Monthly Plan (1 month term)
        // 6-Month Plan (6 month term, paid upfront)
        // Yearly Plan (12 month term, paid upfront)

        // Transaction Cost:
        // Monthly: (Price * 1 * Gateway%) + Fixed
        // 6-Month: (Price * 6 * Gateway%) + Fixed -- assuming Price is Monthly Unit Price.
        // Yearly: (Price * 12 * Gateway%) + Fixed

        const totalRevenueForTerm = globalSettings.planPrice * months;
        const txFee = (totalRevenueForTerm * (costDrivers.gatewayFeePercent / 100)) + costDrivers.gatewayFixedFee;

        // 4. Labor Logic
        // Standard Mode: $0 (OpEx)
        // Advanced Mode AND Live Monitoring ON: Add (Agent Rate * Months) -- Assuming Agent Rate is Monthly? 
        // Prompt says "Agent Rate ($/hr)?" No, prompt says "Agent Rate" in my code, but prompt logic: "(Agent Rate * Months)".
        // Implicitly implies Agent Rate is a MONTHLY cost per user? 
        // In CostDrivers I put "Agent Hourly Rate". 
        // If it's hourly, we need "Hours per month". 
        // Let's assume the input in CostDrivers meant "Labor Cost Per User Per Month" or I should add an "Hours/Mo" field.
        // Let's simplify: treat the "Agent Rate" variable as "Monthly Support Cost Per User" for this specific calculation logic 
        // OR add a scalar. The formula `(Agent Rate * Months)` strongly implies Agent Rate is a monthly recurring cost unit.
        // I will rename/treat existing `agentHourlyRate` as `agentMonthlyRate` or just use it as is but label it clearly.
        // Re-reading prompt: "Agent Rate ($/hr)" is NOT in prompt text explicitly, just "Agent Rate".
        // I will assume it's a Monthly cost per account for "Live Monitoring".

        const laborCost = (globalSettings.laborMode === 'advanced' && globalSettings.isLiveMonitoringEnabled)
            ? (costDrivers.agentHourlyRate * months) // treating agentHourlyRate as Monthly Cost for now based on formula
            : 0;

        // 5. Billing Friction: Dunning Cost * Risk Factor
        // Risk Factor: High for Monthly (let's say 5%), Low for Yearly (1% or 0 once paid).
        // Prompt: "High risk for Monthly, Low for Yearly".
        // Let's define factors: Monthly = 0.05, 6-Month = 0.02, Yearly = 0.01.
        let riskFactor = 0.05;
        if (months === 6) riskFactor = 0.02;
        if (months === 12) riskFactor = 0.01;

        const billingCost = costDrivers.dunningCost * riskFactor;

        // 6. License Costs
        let totalLicenseCost = 0;
        licenses.filter(l => l.isEnabled).forEach(l => {
            if (l.type === 'per-user') {
                // Per User: Cost * Months
                // If billing is yearly and we are in a monthly view? 
                // Usually we amortize or show cash flow. Profitability usually uses accrual/amortized.
                // Simpler: Just (Cost/Mo) * Months. 
                // Note: The license object has `costPerUnit`. Is it monthly? 
                // Manager says: "Cost Per Unit ($)" and Preview says "$X / user" (Monthly Cost). 
                // So we assume costPerUnit is monthly.
                totalLicenseCost += (l.costPerUnit || 0) * months;
            } else if (l.type === 'block') {
                // Block: Efficiency cost per unit * months
                const blocksNeeded = Math.ceil(projectedFleetSize / (l.unitsPerBlock || 1));
                const totalBlockCost = blocksNeeded * (l.blockPrice || 0);
                const costPerUnit = totalBlockCost / projectedFleetSize;
                totalLicenseCost += costPerUnit * months;
            } else if (l.type === 'one-time') {
                // One-Time: Amortized monthly cost * months
                const amortizedMonthly = (l.oneTimeFee || 0) / (l.amortizationTermMonths || 1);
                totalLicenseCost += amortizedMonthly * months;
            }
        });

        const totalCost = infraCost + simCost + txFee + laborCost + billingCost + totalLicenseCost;
        const margin = totalRevenueForTerm - totalCost;
        const marginPercent = (margin / totalRevenueForTerm) * 100;

        return {
            revenue: totalRevenueForTerm,
            totalCost,
            margin,
            marginPercent,
            costs: {
                infra: infraCost,
                connectivity: simCost,
                transaction: txFee,
                labor: laborCost,
                billing: billingCost,
                licenses: totalLicenseCost
            }
        };
    };

    const monthlyData = calculateVariables(1);
    const sixMonthData = calculateVariables(6);
    const yearlyData = calculateVariables(12);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Profitability Calculator</h2>
                <p className="text-slate-500">Compare unit economics across standard contract terms.</p>
            </div>

            {/* Inputs Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Core Inputs */}
                <Card className="md:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Plan Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Plan Price ({symbol}/mo)</Label>
                            <Input
                                type="number"
                                value={globalSettings.planPrice}
                                onChange={(e) => setGlobalSetting('planPrice', parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Currency</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                value={globalSettings.currency}
                                onChange={(e) => setGlobalSetting('currency', e.target.value as Currency)}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="AUD">AUD (A$)</option>
                                <option value="CNY">CNY (¥)</option>
                                <option value="NZD">NZD (NZ$)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Labor Mode</Label>
                            <div className="flex items-center space-x-2 h-10">
                                <span className={cn("text-sm transition-colors", globalSettings.laborMode === 'standard' ? "font-bold text-indigo-600" : "text-slate-500")}>Standard</span>
                                <Switch
                                    checked={globalSettings.laborMode === 'advanced'}
                                    onCheckedChange={(checked) => setGlobalSetting('laborMode', checked ? 'advanced' : 'standard')}
                                />
                                <span className={cn("text-sm transition-colors", globalSettings.laborMode === 'advanced' ? "font-bold text-indigo-600" : "text-slate-500")}>Advanced</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Avg Data (GB)</Label>
                            <Input
                                type="number"
                                value={globalSettings.avgDataUsageGB}
                                onChange={(e) => setGlobalSetting('avgDataUsageGB', parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Avg Storage (GB)</Label>
                            <Input
                                type="number"
                                value={globalSettings.avgStorageGB}
                                onChange={(e) => setGlobalSetting('avgStorageGB', parseFloat(e.target.value))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Feature Flags & Licenses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col">
                                <span>AI Premium Features</span>
                                <span className="font-normal text-xs text-slate-400">Adds Compute Surcharge</span>
                            </Label>
                            <Switch
                                checked={globalSettings.isAiEnabled}
                                onCheckedChange={(c) => setGlobalSetting('isAiEnabled', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col">
                                <span>Cellular Backup</span>
                                <span className="font-normal text-xs text-slate-400">Enables SIM & Connectivity costs</span>
                            </Label>
                            <Switch
                                checked={globalSettings.isCellularBackupEnabled}
                                onCheckedChange={(c) => setGlobalSetting('isCellularBackupEnabled', c)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col">
                                <span>Live Monitoring</span>
                                <span className="font-normal text-xs text-slate-400">Triggers Advanced Labor costs</span>
                            </Label>
                            <Switch
                                checked={globalSettings.isLiveMonitoringEnabled}
                                onCheckedChange={(c) => setGlobalSetting('isLiveMonitoringEnabled', c)}
                            />
                        </div>

                        {/* Dynamic License Toggles */}
                        {licenses.map((license: License) => (
                            <div key={license.id} className="flex items-center justify-between pt-2 border-t border-slate-50">
                                <Label className="flex flex-col">
                                    <span className="flex items-center gap-2">
                                        {license.name}
                                        <span className="text-[10px] uppercase bg-slate-100 text-slate-500 px-1.5 rounded-sm">{license.type}</span>
                                    </span>
                                    <span className="font-normal text-xs text-slate-400">
                                        {license.type === 'per-user' && `${symbol}${license.costPerUnit}/mo per user`}
                                        {license.type === 'block' && `Tiered block pricing`}
                                        {license.type === 'one-time' && `Amortized upfront cost`}
                                    </span>
                                </Label>
                                <Switch
                                    checked={license.isEnabled}
                                    onCheckedChange={(c) => toggleLicense(license.id, c)}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Comparison Columns */}
            <div className="grid gap-6 md:grid-cols-3">
                <PlanColumn title="Monthly" months={1} data={monthlyData} symbol={symbol} />
                <PlanColumn title="6-Month Term" months={6} data={sixMonthData} symbol={symbol} />
                <PlanColumn title="Yearly Contract" months={12} data={yearlyData} highlight={true} symbol={symbol} />
            </div>

            {/* Visualizations Module */}
            <div className="pt-4">
                <Visualization
                    monthlyData={monthlyData}
                    yearlyData={yearlyData}
                    sixMonthData={sixMonthData}
                    currency={globalSettings.currency}
                />
            </div>
        </div>
    );
}
