import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { GlobalSettings, Currency } from '../../../types';
import { cn } from '../../../lib/utils';

interface Step2Props {
    settings: GlobalSettings;
    onChange: <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => void;
    mode: 'view' | 'edit' | 'create';
}

export function Step2InputConfig({ settings, onChange, mode }: Step2Props) {
    const isReadOnly = mode === 'view';
    const symbol = settings.currency === 'USD' ? '$' : settings.currency === 'EUR' ? '€' : '$'; // Simplification

    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <Card className="border-indigo-100 shadow-sm dark:border-indigo-900">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Plan Configuration
                    </CardTitle>
                    <CardDescription>
                        Define the base parameters for this profitability scenario.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
                    {/* Plan Price */}
                    <div className="space-y-2">
                        <Label>Plan Price ({symbol}/mo)</Label>
                        <Input
                            type="number"
                            value={settings.planPrice}
                            onChange={(e) => onChange('planPrice', parseFloat(e.target.value))}
                            disabled={isReadOnly}
                        />
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                        <Label>Currency</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:text-slate-50"
                            value={settings.currency}
                            onChange={(e) => onChange('currency', e.target.value as Currency)}
                            disabled={isReadOnly}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="AUD">AUD (A$)</option>
                            <option value="CNY">CNY (¥)</option>
                            <option value="NZD">NZD (NZ$)</option>
                        </select>
                    </div>

                    {/* Average Data */}
                    <div className="space-y-2">
                        <Label>Avg Data Usage (GB)</Label>
                        <Input
                            type="number"
                            value={settings.avgDataUsageGB}
                            onChange={(e) => onChange('avgDataUsageGB', parseFloat(e.target.value))}
                            disabled={isReadOnly}
                        />
                    </div>

                    {/* Average Storage */}
                    <div className="space-y-2">
                        <Label>Avg Storage (GB)</Label>
                        <Input
                            type="number"
                            value={settings.avgStorageGB}
                            onChange={(e) => onChange('avgStorageGB', parseFloat(e.target.value))}
                            disabled={isReadOnly}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-indigo-100 shadow-sm dark:border-indigo-900">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Feature Flags
                    </CardTitle>
                    <CardDescription>
                        Toggle advanced features that impact cost structure.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                    <div className="flex items-center justify-between">
                        <Label className="flex flex-col">
                            <span>AI Premium Features</span>
                            <span className="font-normal text-xs text-slate-400">Adds Compute Surcharge</span>
                        </Label>
                        <Switch
                            checked={settings.isAiEnabled}
                            onCheckedChange={(c) => onChange('isAiEnabled', c)}
                            disabled={isReadOnly}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="flex flex-col">
                            <span>Cellular Backup</span>
                            <span className="font-normal text-xs text-slate-400">Enables SIM & Connectivity costs</span>
                        </Label>
                        <Switch
                            checked={settings.isCellularEnabled}
                            onCheckedChange={(c) => onChange('isCellularEnabled', c)}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                        <Label className="flex flex-col">
                            <span className={cn("transition-colors", settings.isLiveMonitoringEnabled ? "text-indigo-600 font-semibold" : "")}>Live Monitoring</span>
                            <span className="font-normal text-xs text-slate-400">Triggers 'Advanced' Labor costs</span>
                        </Label>
                        <Switch
                            checked={settings.isLiveMonitoringEnabled}
                            onCheckedChange={(c) => {
                                onChange('isLiveMonitoringEnabled', c);
                                // Auto-set labor mode if monitoring is enabled/disabled logic could go here, 
                                // but simpler to just let user toggle both or handle side-effect in parent.
                                // For now, explicit toggles.
                                if (c) onChange('laborMode', 'advanced');
                                else onChange('laborMode', 'standard');
                            }}
                            disabled={isReadOnly}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="flex flex-col">
                            <span>Labor Mode</span>
                            <span className="font-normal text-xs text-slate-400">{settings.laborMode === 'standard' ? 'Standard (OpEx)' : 'Advanced (COGS)'}</span>
                        </Label>
                        <div className="flex items-center space-x-2">
                            <span className={cn("text-xs uppercase font-bold", settings.laborMode === 'standard' ? "text-slate-600" : "text-slate-300")}>Std</span>
                            <Switch
                                checked={settings.laborMode === 'advanced'}
                                onCheckedChange={(c) => onChange('laborMode', c ? 'advanced' : 'standard')}
                                disabled={isReadOnly}
                            />
                            <span className={cn("text-xs uppercase font-bold", settings.laborMode === 'advanced' ? "text-indigo-600" : "text-slate-300")}>Adv</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
