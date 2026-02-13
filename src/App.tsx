import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { MainLayout } from './components/Layout/MainLayout';
import { CostDrivers } from './components/CostDrivers';
import { Calculator } from './components/Calculator';

import { LicenseManager } from './components/LicenseManager';


import { ProductManager } from './components/ProductManager';
import { ProductCOGS } from './components/ProductCOGS';
import { MarketComparison } from './components/MarketComparison';
import { Package, History, Scale } from 'lucide-react';

// Placeholder Dashboard component until fully implemented
const DashboardPlaceholder = ({ setView }: { setView: (view: string) => void }) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <span className="text-sm text-slate-500">Overview of profitability</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
                onClick={() => setView('products')}
                className="group relative flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
            >
                <div className="p-4 bg-indigo-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Package className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Product Data</h3>
                <p className="text-sm text-center text-slate-500 mt-2">Manage material codes and descriptions</p>
            </div>

            <div
                onClick={() => setView('product-cogs')}
                className="group relative flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
            >
                <div className="p-4 bg-purple-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <History className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Product COGS</h3>
                <p className="text-sm text-center text-slate-500 mt-2">View saved profitability scenarios</p>
            </div>

            <div
                onClick={() => setView('market-comparison')}
                className="group relative flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
            >
                <div className="p-4 bg-emerald-50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Scale className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Market Analysis</h3>
                <p className="text-sm text-center text-slate-500 mt-2">Compare against AI-sourced competitors</p>
            </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-500">Welcome to ProfitLens. Use the sidebar to navigate to the Calculator.</p>
        </div>
    </div>
);

import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Login from "./components/Auth/Login";
import DomainGuard from "./components/Auth/DomainGuard";

// ... existing code ...

function App() {
    const [currentView, setCurrentView] = useState('dashboard');

    const renderContent = () => {
        // ... existing switch statement ...
        switch (currentView) {
            case 'dashboard':
                return <DashboardPlaceholder setView={setCurrentView} />;
            case 'calculator':
                return <Calculator />;
            case 'licenses':
                return <LicenseManager />;
            case 'cost-drivers':
                return <CostDrivers />;
            case 'hardware':
                return <CostDrivers />;
            case 'products':
                return <ProductManager />;
            case 'product-cogs':
                return <ProductCOGS />;
            case 'market-comparison':
                return <MarketComparison />;
            default:
                return <DashboardPlaceholder setView={setCurrentView} />;
        }
    };

    return (
        <>
            <SignedOut>
                <Login />
            </SignedOut>
            <SignedIn>
                <DomainGuard>
                    <div className="min-h-screen bg-slate-50 font-sans">
                        <Sidebar currentView={currentView} setView={setCurrentView} />
                        <MainLayout>
                            {renderContent()}
                        </MainLayout>
                    </div>
                </DomainGuard>
            </SignedIn>
        </>
    );
}

export default App;
