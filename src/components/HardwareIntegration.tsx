import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2, Server, Camera, Cable } from 'lucide-react';
import { HardwareItem } from '../types';

export function HardwareIntegration() {
    const { hardware, addHardware, updateHardware, deleteHardware } = useStore();
    const [newItemName, setNewItemName] = useState('');
    const [newItemCost, setNewItemCost] = useState('');

    const handleAdd = () => {
        if (!newItemName || !newItemCost) return;

        const newItem: HardwareItem = {
            id: crypto.randomUUID(),
            name: newItemName,
            cost: parseFloat(newItemCost),
            quantity: 1,
            type: 'other'
        };

        addHardware(newItem);
        setNewItemName('');
        setNewItemCost('');
    };

    const totalCapEx = hardware.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

    const getIcon = (type: string) => {
        switch (type) {
            case 'camera': return <Camera className="w-4 h-4 text-blue-500" />;
            case 'compute': return <Server className="w-4 h-4 text-purple-500" />;
            case 'sensor': return <Cable className="w-4 h-4 text-emerald-500" />;
            default: return <Server className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Hardware & Integration</h2>
                <p className="text-slate-500">Manage Capital Expenditures (CapEx) for physical assets and installation.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Hardware List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="w-[100px]">Quantity</TableHead>
                                    <TableHead className="text-right">Unit Cost ($)</TableHead>
                                    <TableHead className="text-right">Total ($)</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hardware.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{getIcon(item.type)}</TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-muted-foreground capitalize">{item.type}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateHardware(item.id, { quantity: parseInt(e.target.value) || 0 })}
                                                className="w-20 h-8"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="relative">
                                                <span className="absolute left-2 top-1 text-slate-400">$</span>
                                                <Input
                                                    type="number"
                                                    value={item.cost}
                                                    onChange={(e) => updateHardware(item.id, { cost: parseFloat(e.target.value) || 0 })}
                                                    className="w-24 h-8 pl-6 text-right"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ${(item.cost * item.quantity).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteHardware(item.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs">New Item Name</Label>
                                    <Input
                                        placeholder="e.g. Mounting Bracket"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Cost ($)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={newItemCost}
                                        onChange={(e) => setNewItemCost(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleAdd} className="mt-5 self-center">
                                <Plus className="w-4 h-4 mr-2" /> Add Item
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>CapEx Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Total Hardware & Installation</p>
                            <div className="text-4xl font-bold text-slate-900 mt-2">
                                ${totalCapEx.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">One-time operational setup costs</p>
                        </div>

                        <div className="space-y-4 mt-6 border-t pt-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Hardware Count</span>
                                <span className="font-medium text-slate-900">{hardware.length} items</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Total Units</span>
                                <span className="font-medium text-slate-900">
                                    {hardware.reduce((acc, item) => acc + item.quantity, 0)} units
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
