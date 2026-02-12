import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, ComposedChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

import { Currency } from '../types';

interface PlanData {
    revenue: number;
    totalCost: number;
    margin: number;
    costs: {
        infra: number;
        connectivity: number;
        licenses?: number;
        transaction: number;
        labor: number;
        billing: number;
    };
}

interface VisualizationProps {
    monthlyData: PlanData;
    sixMonthData: PlanData;
    yearlyData: PlanData;
    currency: Currency;
}

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

const CustomTooltip = ({ active, payload, label, currency }: any) => {
    const symbol = getSymbol(currency);
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg text-sm">
                <p className="font-semibold text-slate-900 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex gap-2 items-center text-slate-600">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="capitalize">{entry.name}:</span>
                        <span className="font-mono font-medium">{symbol}{Number(entry.value).toFixed(2)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function Visualization({ monthlyData, sixMonthData, yearlyData, currency }: VisualizationProps) {
    const symbol = getSymbol(currency);
    const [showDeferred, setShowDeferred] = useState(false);

    // 1. True Cost Waterfall Data (Annualized view for comparison)
    // We need to normalize to 1 Year for fair comparison
    const waterfallData = [
        {
            name: 'Monthly Plan (x12)',
            Infra: monthlyData.costs.infra * 12,
            Connectivity: monthlyData.costs.connectivity * 12,
            Licenses: (monthlyData.costs.licenses || 0) * 12,
            Transaction: monthlyData.costs.transaction * 12, // Monthly pays tx fee every month
            Labor: monthlyData.costs.labor * 12,
            Billing: monthlyData.costs.billing * 12, // Monthly risk applied 12 times? Or just high risk factor annualized?
            // In Calculator, 'monthlyData' was for 1 month term. 
            // If we annualize, we multiply everything by 12.
        },
        {
            name: '6-Month Plan (x2)',
            Infra: sixMonthData.costs.infra * 2,
            Connectivity: sixMonthData.costs.connectivity * 2,
            Licenses: (sixMonthData.costs.licenses || 0) * 2,
            Transaction: sixMonthData.costs.transaction * 2, // Paid twice
            Labor: sixMonthData.costs.labor * 2,
            Billing: sixMonthData.costs.billing * 2,
        },
        {
            name: 'Yearly Plan',
            Infra: yearlyData.costs.infra,
            Connectivity: yearlyData.costs.connectivity,
            Licenses: (yearlyData.costs.licenses || 0),
            Transaction: yearlyData.costs.transaction, // Paid once
            Labor: yearlyData.costs.labor,
            Billing: yearlyData.costs.billing,
        }
    ];

    // 2. Break-Even Timeline Data (Cumulative Cash Flow)
    // Compare Monthly vs Yearly over 12 months
    const months = Array.from({ length: 13 }, (_, i) => i); // 0 to 12
    const breakEvenData = months.map(month => {
        // Monthly Plan:
        // Revenue accumulates linearly. Cost accumulates linearly.
        const monthlyRev = (monthlyData.revenue) * month;
        const monthlyCost = (monthlyData.totalCost) * month;

        // Yearly Plan:
        // Revenue: 100% collected at Month 0 (or Month 1 depending on convention, usually Month 0 cash).
        // Cost: 
        // - Transaction: Upfront magnitude
        // - Infra/Labor: Incurred monthly

        // Wait, "Revenue vs Cumulative COGS".
        // If we look at Cash Flow: Yearly gets all cash at M0.
        // If we look at Recognized Revenue: It's linear.
        // Prompt asks for "Break-Even Timeline... Revenue vs Cumulative COGS".
        // Insight: "Show where lines cross (e.g. Month 2 for Monthly, Month 0 for Yearly)".
        // This implies CASH basis for Revenue? Month 0 for Yearly implies instant break even.

        // For Yearly:
        // Rev = Total Annual Price (Constant line? Or Step?) -> Step function at 0.
        // Cost = Tx Fee (at 0) + (Monthly Unit Cost * month).

        // Actually strictly:
        // Tx Fee and Billing risk happened at M0.
        // Infra/Labor happen monthly.
        const yearlyUpfrontCost = yearlyData.costs.transaction + yearlyData.costs.billing;


        // Let's use the explicit totals from props
        // Total Cost = Upfront + (Recurring * 12).
        // Let's approximate Recurring = (Total - Upfront) / 12.
        const yearlyRecurringCost = (yearlyData.totalCost - yearlyUpfrontCost) / 12;
        const yearlyCumCost = month === 0 ? yearlyUpfrontCost : yearlyUpfrontCost + (yearlyRecurringCost * month);

        // For Monthly:
        // Rev = Price * Month
        // Cost = Cost per Month * Month

        return {
            month,
            'Monthly Rev': monthlyRev,
            'Monthly Cost': monthlyCost,
            'Yearly Cash': month === 0 ? yearlyData.revenue : yearlyData.revenue, // Flat line after payment
            'Yearly Cost': yearlyCumCost,
        };
    });

    // 3. Deferred Revenue (Yearly Plan)
    // Cash Collected vs Rev Rec
    const deferredData = months.map(month => ({
        month,
        'Cash Collected': yearlyData.revenue,
        'Revenue Recognized': (yearlyData.revenue / 12) * month
    }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Row: Waterfall & Break-Even */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Annualized Cost Composition</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${symbol}${value}`} />
                                    <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ fill: '#f8fafc' }} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="Infra" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="Connectivity" stackId="a" fill="#8b5cf6" />
                                    <Bar dataKey="Licenses" stackId="a" fill="#10b981" />
                                    <Bar dataKey="Transaction" stackId="a" fill="#f43f5e" />
                                    <Bar dataKey="Labor" stackId="a" fill="#f59e0b" />
                                    <Bar dataKey="Billing" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Break-Even Analysis (Cash)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={breakEvenData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${symbol}${value}`} />
                                    <Tooltip content={<CustomTooltip currency={currency} />} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" dataKey="Monthly Rev" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Monthly Cost" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                    <Line type="stepAfter" dataKey="Yearly Cash" stroke="#10b981" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Yearly Cost" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Deferred Revenue */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">ASC 606 Revenue Recognition (Yearly Plan)</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Label className="text-xs text-slate-500">Show Recognition</Label>
                        <Switch checked={showDeferred} onCheckedChange={setShowDeferred} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={deferredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${symbol}${value}`} />
                                <Tooltip content={<CustomTooltip currency={currency} />} />
                                <Legend />
                                <Area type="stepAfter" dataKey="Cash Collected" fill="#ecfdf5" stroke="#10b981" strokeWidth={2} />
                                {showDeferred && (
                                    <Line type="monotone" dataKey="Revenue Recognized" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: '#6366f1' }} />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
