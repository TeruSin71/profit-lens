import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function CostDrivers() {
    const { costDrivers, setCostDriver } = useStore();

    const handleChange = (key: keyof typeof costDrivers, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setCostDriver(key, numValue);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Cost Drivers</h2>
                <p className="text-slate-500 dark:text-slate-400">Configure the unit economics and underlying costs for the platform.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Infrastructure Group */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Infrastructure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Data Rate ($/GB)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.dataRatePerGB}
                                onChange={(e) => handleChange('dataRatePerGB', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Storage Rate ($/GB/mo)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.storageRatePerGB}
                                onChange={(e) => handleChange('storageRatePerGB', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Telemetry Fee ($/Device)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.telemetryFeePerDevice}
                                onChange={(e) => handleChange('telemetryFeePerDevice', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Compute Surcharge ($/AI User)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.computeSurchargePerAIUser}
                                onChange={(e) => handleChange('computeSurchargePerAIUser', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Connectivity Group */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Connectivity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>SIM Fee ($/Active SIM)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.simFeePerActiveSIM}
                                onChange={(e) => handleChange('simFeePerActiveSIM', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Maintenance ($/Device/Year)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.connectionMaintenancePerDeviceYear}
                                onChange={(e) => handleChange('connectionMaintenancePerDeviceYear', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Fixed Integration Fee ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.integrationFixedFee}
                                onChange={(e) => handleChange('integrationFixedFee', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Variable Integration API ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.integrationVariableFee}
                                onChange={(e) => handleChange('integrationVariableFee', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Billing & Labor Group */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Billing & Labor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Gateway Fee (%)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={costDrivers.gatewayFeePercent}
                                onChange={(e) => handleChange('gatewayFeePercent', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Fixed Transaction Fee ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.gatewayFixedFee}
                                onChange={(e) => handleChange('gatewayFixedFee', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Dunning/Retry Cost ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.dunningCost}
                                onChange={(e) => handleChange('dunningCost', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Agent Hourly Rate ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={costDrivers.agentHourlyRate}
                                onChange={(e) => handleChange('agentHourlyRate', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
