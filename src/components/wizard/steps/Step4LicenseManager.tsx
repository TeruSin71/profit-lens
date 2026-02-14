import { Switch } from '../../ui/switch';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { License } from '../../../types';
import { cn } from '../../../lib/utils';
import { Check, ShieldCheck } from 'lucide-react';

interface Step4Props {
    licenses: License[];
    onToggle: (id: string, isEnabled: boolean) => void;
    mode: 'view' | 'edit' | 'create';
}

export function Step4LicenseManager({ licenses, onToggle, mode }: Step4Props) {
    const isReadOnly = mode === 'view';

    return (
        <Card className="border-indigo-100 shadow-sm dark:border-indigo-900 animate-in slide-in-from-right-8 duration-500">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    License Configuration
                </CardTitle>
                <CardDescription>
                    Enable software licenses and integrations needed for this product.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                {licenses.map((license) => (
                    <div
                        key={license.id}
                        className={cn(
                            "flex items-center justify-between p-4 rounded-lg border transition-all",
                            license.isEnabled
                                ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
                                : "bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                license.isEnabled
                                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400"
                                    : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                            )}>
                                {license.isEnabled ? <Check className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{license.name}</span>
                                    <span className="text-[10px] uppercase bg-slate-100 text-slate-500 px-1.5 rounded-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                                        {license.type}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {license.type === 'per-user' && `$${license.costPerUnit}/user/mo`}
                                    {license.type === 'block' && `$${license.blockPrice} per block of ${license.unitsPerBlock}`}
                                    {license.type === 'one-time' && `$${license.oneTimeFee} upfront`}
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={license.isEnabled}
                            onCheckedChange={(c) => onToggle(license.id, c)}
                            disabled={isReadOnly}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
