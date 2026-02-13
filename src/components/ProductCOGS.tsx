import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { SavedScenario } from '../types';
import { Card, CardContent } from './ui/card';
import { Trash2, TrendingUp } from 'lucide-react';
import { ScenarioDetailModal } from './ScenarioDetailModal';

export function ProductCOGS() {
    const { savedScenarios, deleteScenario } = useStore();
    const [selectedScenario, setSelectedScenario] = useState<SavedScenario | null>(null);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent opening the modal
        if (window.confirm('Are you sure you want to delete this scenario?')) {
            deleteScenario(id);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Product COGS History</h2>
                <p className="text-slate-500">Manage and review your saved profitability scenarios.</p>
            </div>

            {savedScenarios.length === 0 ? (
                <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <TrendingUp className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">No Scenarios Saved Yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Go to the Calculator and click "Save Scenario" to snapshot your unit economics.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {savedScenarios.map((scenario) => (
                        <Card
                            key={scenario.id}
                            className="hover:shadow-md transition-shadow cursor-pointer group border-slate-200"
                            onClick={() => setSelectedScenario(scenario)}
                        >
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-lg text-slate-900">{scenario.name}</h3>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {scenario.formattedDate}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Yearly Margin: <span className="font-medium text-emerald-600">{scenario.results.yearly.marginPercent.toFixed(1)}%</span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => handleDelete(e, scenario.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Delete Scenario"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {selectedScenario && (
                <ScenarioDetailModal
                    scenario={selectedScenario}
                    onClose={() => setSelectedScenario(null)}
                />
            )}
        </div>
    );
}
