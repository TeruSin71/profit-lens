import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { MainLayout } from './components/Layout/MainLayout';
import { CostDrivers } from './components/CostDrivers';
import { Calculator } from './components/Calculator';

import { LicenseManager } from './components/LicenseManager';


// Placeholder Dashboard component until fully implemented
const DashboardPlaceholder = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <span className="text-sm text-slate-500">Overview of profitability</span>
        </div>
        <div className="p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-500">Welcome to ProfitLens. Use the sidebar to navigate to the Calculator.</p>
        </div>
    </div>
);

function App() {
    const [currentView, setCurrentView] = useState('dashboard');

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardPlaceholder />;
            case 'calculator':
                return <Calculator />;
            case 'licenses':
                return <LicenseManager />;
            case 'cost-drivers':
                return <CostDrivers />;
            case 'hardware':
                return <CostDrivers />; // Reusing CostDrivers for simplicity as requested logic is similar or part of it
            default:
                return <DashboardPlaceholder />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar currentView={currentView} setView={setCurrentView} />
            <MainLayout>
                {renderContent()}
            </MainLayout>
        </div>
    );
}

export default App;
