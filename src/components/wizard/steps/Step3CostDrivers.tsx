import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { CostDrivers as CostDriversType } from '../../../types';

interface Step3Props {
    data: CostDriversType;
    onChange: (key: keyof CostDriversType, value: number) => void;
    mode: 'view' | 'edit' | 'create';
}

export function Step3CostDrivers({ data, onChange, mode }: Step3Props) {
    const isReadOnly = mode === 'view';

    const handleChange = (key: keyof CostDriversType, valueStr: string) => {
        const num = parseFloat(valueStr);
        if (!isNaN(num)) {
            onChange(key, num);
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Infrastructure Group */}
                <Card className="border-indigo-100 shadow-sm dark:border-indigo-900">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">Infrastructure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Data Rate ($/GB)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.dataRatePerGB}
                                onChange={(e) => handleChange('dataRatePerGB', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Storage Rate ($/GB)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.storageRatePerGB}
                                onChange={(e) => handleChange('storageRatePerGB', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Telemetry ($/Dev)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.telemetryFeePerDevice}
                                onChange={(e) => handleChange('telemetryFeePerDevice', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>AI Compute ($/User)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.computeSurchargePerAIUser}
                                onChange={(e) => handleChange('computeSurchargePerAIUser', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Connectivity Group */}
                <Card className="border-indigo-100 shadow-sm dark:border-indigo-900">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">Connectivity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>SIM Fee ($/SIM)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.simFeePerActiveSIM}
                                onChange={(e) => handleChange('simFeePerActiveSIM', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Maint ($/Dev/Yr)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.connectionMaintenancePerDeviceYear}
                                onChange={(e) => handleChange('connectionMaintenancePerDeviceYear', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Fixed Integration ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.integrationFixedFee}
                                onChange={(e) => handleChange('integrationFixedFee', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Variable Integration ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.integrationVariableFee}
                                onChange={(e) => handleChange('integrationVariableFee', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Billing & Labor Group */}
                <Card className="border-indigo-100 shadow-sm dark:border-indigo-900">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">Billing & Labor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Gateway Fee (%)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={data.gatewayFeePercent}
                                onChange={(e) => handleChange('gatewayFeePercent', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Fixed Transaction ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.gatewayFixedFee}
                                onChange={(e) => handleChange('gatewayFixedFee', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Dunning Cost ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.dunningCost}
                                onChange={(e) => handleChange('dunningCost', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Agent Rate ($/mo)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={data.agentMonthlyRate}
                                onChange={(e) => handleChange('agentMonthlyRate', e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
