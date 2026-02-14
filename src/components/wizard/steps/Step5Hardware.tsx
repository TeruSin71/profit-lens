import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { HardwareItem } from '../../../types';
import { Trash2, Plus, Server } from 'lucide-react';
import { Button } from '../../ui/button';

interface Step5Props {
    projectedFleetSize: number;
    onFleetSizeChange: (size: number) => void;
    hardware: HardwareItem[];
    onAddHardware: (item: HardwareItem) => void;
    onUpdateHardware: (id: string, updates: Partial<HardwareItem>) => void;
    onDeleteHardware: (id: string) => void;
    mode: 'view' | 'edit' | 'create';
}

export function Step5Hardware({
    projectedFleetSize,
    onFleetSizeChange,
    hardware,
    onAddHardware,
    onUpdateHardware,
    onDeleteHardware,
    mode
}: Step5Props) {
    const isReadOnly = mode === 'view';

    return (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            {/* Projected Fleet Size */}
            <Card className="border-indigo-100 shadow-sm dark:border-indigo-900 border-l-4 border-l-indigo-500">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">Scale Projection</CardTitle>
                    <CardDescription>
                        Estimated fleet size for volume-based calculations (e.g. Licenses).
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-2">
                        <Label>Projected Fleet Size (Units)</Label>
                        <Input
                            type="number"
                            min="1"
                            value={projectedFleetSize}
                            onChange={(e) => onFleetSizeChange(parseInt(e.target.value) || 0)}
                            disabled={isReadOnly}
                            className="text-lg font-bold text-indigo-600"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Hardware List */}
            <Card className="border-indigo-100 shadow-sm dark:border-indigo-900">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">Hardware Bill of Materials</CardTitle>
                        <CardDescription>
                            Define the physical components per unit.
                        </CardDescription>
                    </div>
                    {!isReadOnly && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddHardware({
                                id: Math.random().toString(36).substr(2, 9),
                                name: 'New Component',
                                cost: 0,
                                quantity: 1,
                                type: 'other'
                            })}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    {hardware.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 border border-dashed rounded-lg">
                            <Server className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No hardware defined.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {hardware.map((item) => (
                                <div key={item.id} className="flex gap-4 items-end p-3 bg-slate-50 rounded-lg dark:bg-slate-900/50">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-xs text-slate-500">Item Name</Label>
                                        <Input
                                            value={item.name}
                                            onChange={(e) => onUpdateHardware(item.id, { name: e.target.value })}
                                            disabled={isReadOnly}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="w-24 space-y-1">
                                        <Label className="text-xs text-slate-500">Cost ($)</Label>
                                        <Input
                                            type="number"
                                            value={item.cost}
                                            onChange={(e) => onUpdateHardware(item.id, { cost: parseFloat(e.target.value) })}
                                            disabled={isReadOnly}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="w-20 space-y-1">
                                        <Label className="text-xs text-slate-500">Qty</Label>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => onUpdateHardware(item.id, { quantity: parseInt(e.target.value) })}
                                            disabled={isReadOnly}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    {!isReadOnly && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                                            onClick={() => onDeleteHardware(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
