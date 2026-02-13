import { LayoutDashboard, Settings, Calculator, Server, FileKey, Package } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    onClick: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg group",
                isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
            {label}
        </button>
    );
};

export function Sidebar({ currentView, setView }: { currentView: string; setView: (view: string) => void }) {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200">
            <div className="flex flex-col h-full">
                <div className="flex items-center h-16 px-6 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900">ProfitLens</span>
                    </div>
                </div>

                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2">Main</div>
                    <NavItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        isActive={currentView === 'dashboard'}
                        onClick={() => setView('dashboard')}
                    />
                    <NavItem
                        icon={Calculator}
                        label="Calculator"
                        isActive={currentView === 'calculator'}
                        onClick={() => setView('calculator')}
                    />

                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mt-8 mb-2">Configuration</div>
                    <NavItem
                        icon={Settings}
                        label="Cost Drivers"
                        isActive={currentView === 'cost-drivers'}
                        onClick={() => setView('cost-drivers')}
                    />
                    <NavItem
                        icon={FileKey}
                        label="License Manager"
                        isActive={currentView === 'licenses'}
                        onClick={() => setView('licenses')}
                    />
                    <NavItem
                        icon={Server}
                        label="Hardware & Integration"
                        isActive={currentView === 'hardware'}
                        onClick={() => setView('hardware')}
                    />
                    <NavItem
                        icon={Package}
                        label="Product Data"
                        isActive={currentView === 'products'}
                        onClick={() => setView('products')}
                    />
                </div>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                            TS
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-900">Terulin S.</p>
                            <p className="text-xs text-slate-500">Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
