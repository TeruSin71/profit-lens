import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';


interface Step1Props {
    data: {
        internalMaterialCode: string;
        externalMaterialCode: string;
        cogsType?: string;
        description: string;
        createdAt?: string;
        updatedAt?: string;
    };
    onChange: (field: string, value: string) => void;
    mode: 'view' | 'edit' | 'create';
}

export function Step1ProductData({ data, onChange, mode }: Step1Props) {
    const isReadOnly = mode === 'view';
    // Internal Code is ALWAYS Read-Only
    // External Code is Read-Only in View mode, Editable in Create/Edit
    // Description is Read-Only in View mode, Editable in Create/Edit

    return (
        <Card className="border-indigo-100 shadow-sm dark:border-indigo-900 animate-in slide-in-from-right-8 duration-500">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Basic Data
                </CardTitle>
                <CardDescription>
                    Define the core identification for this material.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

                {/* Internal Material Code (System Generated) */}
                <div className="grid gap-2">
                    <Label className="text-slate-500">Internal Material Code (System)</Label>
                    <div className="relative">
                        <Input
                            value={data.internalMaterialCode || "Generated on Save"}
                            disabled
                            className="bg-slate-100/50 font-mono text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono dark:bg-slate-800 dark:text-slate-400">
                            LOCKED
                        </span>
                    </div>
                </div>

                {/* External Material Code (Manual Entry) */}
                <div className="grid gap-2">
                    <Label htmlFor="ext-code">External Material Code (Legacy/ERP)</Label>
                    <Input
                        id="ext-code"
                        value={data.externalMaterialCode}
                        onChange={(e) => onChange('externalMaterialCode', e.target.value)}
                        placeholder="e.g. MAT-001-X"
                        maxLength={9}
                        disabled={isReadOnly}
                        className={isReadOnly ? "border-transparent px-0 shadow-none font-medium text-slate-900 dark:text-slate-100" : ""}
                    />
                    {!isReadOnly && (
                        <p className="text-[10px] text-slate-400">
                            Optional. Max 9 characters.
                        </p>
                    )}
                </div>

                {/* COGS Type Dropdown */}
                <div className="grid gap-2">
                    <Label>COGS Type</Label>
                    <Select
                        value={data.cogsType || ""}
                        onValueChange={(val) => onChange('cogsType', val)}
                        disabled={isReadOnly}
                    >
                        <SelectTrigger className={isReadOnly ? "border-transparent px-0 shadow-none font-medium text-slate-900 dark:text-slate-100" : ""}>
                            <SelectValue placeholder="Select COGS Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Subscription">Subscription</SelectItem>
                            <SelectItem value="License">License</SelectItem>
                            <SelectItem value="Subscription & License">Subscription & License</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Description */}
                <div className="grid gap-2">
                    <Label htmlFor="desc">Material Description</Label>
                    <Input
                        id="desc"
                        value={data.description}
                        onChange={(e) => onChange('description', e.target.value)}
                        placeholder="e.g. Premium Industrial Sensor Kit"
                        maxLength={45}
                        disabled={isReadOnly}
                        className={isReadOnly ? "border-transparent px-0 shadow-none text-lg font-semibold text-slate-900 dark:text-slate-100" : ""}
                    />
                    {!isReadOnly && (
                        <p className="text-[10px] text-slate-400">
                            Required. Max 45 characters.
                        </p>
                    )}
                </div>
            </CardContent>

            {/* System Information Footer - Display Only, View/Edit Modes */}
            {(mode === 'view' || mode === 'edit') && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-800 rounded-b-lg">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">System Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Created On</span>
                            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                                {data.createdAt ? new Date(data.createdAt).toLocaleDateString('de-DE', {
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                }) : '-'}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Last Changed</span>
                            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                                {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('de-DE', {
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                }) : '-'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
