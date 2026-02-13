import { LayoutDashboard, Settings, Calculator, Server, FileKey, Package, History, Scale } from 'lucide-react';
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
                    ? "bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            )}
        >
            <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
            {label}
        </button>
    );
};


export function Sidebar({ currentView, setView }: { currentView: string; setView: (view: string) => void }) {

    return (
        <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
            <div className="flex flex-col h-full">
                <div className="flex flex-col h-16 px-6 border-b border-slate-100 justify-center dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">ProfitLens</span>
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
                    <NavItem
                        icon={History}
                        label="Product COGS"
                        isActive={currentView === 'product-cogs'}
                        onClick={() => setView('product-cogs')}
                    />
                    <NavItem
                        icon={Scale}
                        label="Market Analysis"
                        isActive={currentView === 'market-comparison'}
                        onClick={() => setView('market-comparison')}
                    />
                </div>


            </div>
        </aside>
    );
}
