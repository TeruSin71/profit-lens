import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { License, LicenseType, Currency } from '../types';
import { Zap, Box, Clock, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export const LicenseManager = () => {
    const { licenses, updateLicense, projectedFleetSize, setProjectedFleetSize, globalSettings } = useStore();
    const [activeTab, setActiveTab] = useState<LicenseType>('per-user');

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

    const filteredLicenses = licenses.filter(l => l.type === activeTab);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">License Manager</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage third-party software and integration costs.</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('per-user')}
                    className={cn(
                        "flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        activeTab === 'per-user'
                            ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-900/30 dark:text-indigo-400"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50"
                    )}
                >
                    <Users className="w-4 h-4 mr-2" />
                    Per-User
                </button>
                <button
                    onClick={() => setActiveTab('block')}
                    className={cn(
                        "flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        activeTab === 'block'
                            ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-900/30 dark:text-indigo-400"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50"
                    )}
                >
                    <Box className="w-4 h-4 mr-2" />
                    Block / Tiered
                </button>
                <button
                    onClick={() => setActiveTab('one-time')}
                    className={cn(
                        "flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        activeTab === 'one-time'
                            ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-900/30 dark:text-indigo-400"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50"
                    )}
                >
                    <Clock className="w-4 h-4 mr-2" />
                    One-Time
                </button>
            </div>

            {/* Global Settings for Block Licenses */}
            {activeTab === 'block' && (
                <Card className="bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-indigo-900 dark:text-indigo-300">Projected Fleet Size</Label>
                                <p className="text-sm text-indigo-600/80 dark:text-indigo-400/80">Used to calculate efficiency for block licenses.</p>
                            </div>
                            <div className="w-32">
                                <Input
                                    type="number"
                                    value={projectedFleetSize}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectedFleetSize(Number(e.target.value))}
                                    className="bg-white border-indigo-200 focus-visible:ring-indigo-500 dark:bg-slate-900 dark:border-indigo-800"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {filteredLicenses.map((license) => (
                    <LicenseCard key={license.id} license={license} updateLicense={updateLicense} fleetSize={projectedFleetSize} symbol={symbol} />
                ))}
            </div>
        </div>
    );
};

interface LicenseCardProps {
    license: License;
    updateLicense: (id: string, updates: Partial<License>) => void;

    fleetSize: number;
    symbol: string;
}

const LicenseCard = ({ license, updateLicense, fleetSize, symbol }: LicenseCardProps) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={cn(
                            "p-2 rounded-lg",
                            license.type === 'per-user' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" :
                                license.type === 'block' ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" :
                                    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                        )}>
                            {license.type === 'per-user' && <Users className="w-5 h-5" />}
                            {license.type === 'block' && <Box className="w-5 h-5" />}
                            {license.type === 'one-time' && <Zap className="w-5 h-5" />}
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">{license.name}</CardTitle>
                            <p className="text-sm text-slate-500 capitalize dark:text-slate-400">{license.type.replace('-', ' ')} License</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inputs based on type */}
                    <div className="space-y-4">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <Label>License Name</Label>
                            <Input
                                value={license.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLicense(license.id, { name: e.target.value })}
                            />
                        </div>

                        {license.type === 'per-user' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Cost Per Unit ({symbol})</Label>
                                    <Input
                                        type="number"
                                        value={license.costPerUnit}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLicense(license.id, { costPerUnit: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Billing Frequency</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:text-slate-50"
                                        value={license.billingFrequency}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateLicense(license.id, { billingFrequency: e.target.value as 'monthly' | 'yearly' })}
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {license.type === 'block' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Block Price ({symbol})</Label>
                                    <Input
                                        type="number"
                                        value={license.blockPrice}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLicense(license.id, { blockPrice: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Units Per Block</Label>
                                    <Input
                                        type="number"
                                        value={license.unitsPerBlock}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLicense(license.id, { unitsPerBlock: Number(e.target.value) })}
                                    />
                                </div>
                            </>
                        )}

                        {license.type === 'one-time' && (
                            <>
                                <div className="space-y-2">
                                    <Label>One-Time Fee ({symbol})</Label>
                                    <Input
                                        type="number"
                                        value={license.oneTimeFee}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLicense(license.id, { oneTimeFee: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Amortization Term (Months)</Label>
                                    <Input
                                        type="number"
                                        value={license.amortizationTermMonths}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLicense(license.id, { amortizationTermMonths: Number(e.target.value) })}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Summary / Preview */}
                    <div className="bg-slate-50 rounded-lg p-4 flex flex-col justify-center space-y-3 dark:bg-slate-800/50">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Cost Impact Preview</h4>

                        {license.type === 'per-user' && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Monthly Cost:</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{symbol}{license.costPerUnit?.toFixed(2)} / user</span>
                            </div>
                        )}

                        {license.type === 'block' && (
                            <>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Blocks Needed:</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">{Math.ceil(fleetSize / (license.unitsPerBlock || 1))}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Efficiency Cost:</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {symbol}{((Math.ceil(fleetSize / (license.unitsPerBlock || 1)) * (license.blockPrice || 0)) / fleetSize).toFixed(2)} / unit
                                    </span>
                                </div>
                            </>
                        )}

                        {license.type === 'one-time' && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Amortized Monthly:</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    {symbol}{((license.oneTimeFee || 0) / (license.amortizationTermMonths || 1)).toFixed(2)} / mo
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
