import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CostDrivers, GlobalSettings, StoreState, License, Product, SavedScenario, HardwareItem } from '../types';

const defaultCostDrivers: CostDrivers = {
    dataRatePerGB: 0.05,
    storageRatePerGB: 0.02,
    telemetryFeePerDevice: 1.00,
    computeSurchargePerAIUser: 2.50,
    simFeePerActiveSIM: 5.00,
    connectionMaintenancePerDeviceYear: 12.00,
    integrationFixedFee: 2.00,
    integrationVariableFee: 0.05,
    gatewayFeePercent: 2.9,
    gatewayFixedFee: 0.30,
    dunningCost: 15.00,
    agentMonthlyRate: 25.00,
};

const defaultGlobalSettings: GlobalSettings = {
    currency: 'USD',
    planPrice: 49.00,
    avgDataUsageGB: 10,
    avgStorageGB: 50,
    isAiEnabled: false,
    isCellularEnabled: false,
    isLiveMonitoringEnabled: false,
    laborMode: 'standard',
};

const defaultLicenses: License[] = [
    {
        id: 'tencent-ai',
        name: 'Tencent AI Integration',
        type: 'per-user',
        isEnabled: false,
        costPerUnit: 0.50,
        billingFrequency: 'monthly'
    },
    {
        id: 'agriwebb',
        name: 'AgriWebb Integration',
        type: 'per-user',
        isEnabled: false,
        costPerUnit: 2.00,
        billingFrequency: 'monthly'
    },
    {
        id: 'farmo-dashboard',
        name: 'Farmo Dashboard',
        type: 'block',
        isEnabled: false,
        blockPrice: 15.00,
        unitsPerBlock: 10
    },
    {
        id: 'nabto-connectivity',
        name: 'Nabto Connectivity',
        type: 'one-time',
        isEnabled: false,
        oneTimeFee: 5.00,
        amortizationTermMonths: 60
    }
];

const defaultHardware: HardwareItem[] = [
    { id: '1', name: 'High-speed Industrial Camera', cost: 2000, quantity: 1, type: 'camera' },
    { id: '2', name: 'Edge Server / IPC', cost: 5000, quantity: 1, type: 'compute' },
    { id: '3', name: 'IoT Sensors & Cabling', cost: 500, quantity: 1, type: 'sensor' },
    { id: '4', name: 'Professional Installation', cost: 1500, quantity: 1, type: 'installation' },
];

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            costDrivers: defaultCostDrivers,
            globalSettings: defaultGlobalSettings,
            licenses: defaultLicenses,
            projectedFleetSize: 100,

            setCostDriver: (key, value) =>
                set((state) => ({
                    costDrivers: { ...state.costDrivers, [key]: value },
                })),

            setGlobalSetting: (key, value) =>
                set((state) => ({
                    globalSettings: { ...state.globalSettings, [key]: value },
                })),

            addLicense: (license: License) =>
                set((state) => ({
                    licenses: [...state.licenses, license]
                })),

            updateLicense: (id: string, updates: Partial<License>) =>
                set((state) => ({
                    licenses: state.licenses.map(l => l.id === id ? { ...l, ...updates } : l)
                })),

            toggleLicense: (id: string, isEnabled: boolean) =>
                set((state) => ({
                    licenses: state.licenses.map(l => l.id === id ? { ...l, isEnabled } : l)
                })),

            setProjectedFleetSize: (size: number) =>
                set({ projectedFleetSize: size }),

            // Hardware Actions
            hardware: defaultHardware,
            addHardware: (item: HardwareItem) =>
                set((state) => ({
                    hardware: [...state.hardware, item]
                })),
            updateHardware: (id: string, updates: Partial<HardwareItem>) =>
                set((state) => ({
                    hardware: state.hardware.map(h => h.id === id ? { ...h, ...updates } : h)
                })),
            deleteHardware: (id: string) =>
                set((state) => ({
                    hardware: state.hardware.filter(h => h.id !== id)
                })),

            // Product Actions
            products: [],
            activeProductId: null,

            addProduct: (product: Product) =>
                set((state) => {
                    // Auto-increment logic for Material Code (Simulation of DB Sequence)
                    const currentMax = state.products.reduce((max, p) => {
                        const val = parseInt(p.materialCode, 10);
                        return isNaN(val) ? max : Math.max(max, val);
                    }, 0);
                    const nextCode = (currentMax + 1).toString().padStart(9, '0');

                    const newProduct: Product = {
                        ...product,
                        materialCode: nextCode,
                        externalMaterialCode: product.externalMaterialCode || '',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    return { products: [...state.products, newProduct] };
                }),

            updateProduct: (id: string, updates: Partial<Product>) =>
                set((state) => ({
                    products: state.products.map(p =>
                        p.id === id
                            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                            : p
                    )
                })),

            deleteProduct: (id: string) =>
                set((state) => ({
                    products: state.products.filter(p => p.id !== id),
                    activeProductId: state.activeProductId === id ? null : state.activeProductId
                })),

            setActiveProduct: (id: string | null) =>
                set({ activeProductId: id }),

            // History / Scenarios
            savedScenarios: [],
            saveScenario: (scenario: SavedScenario) =>
                set((state) => ({
                    savedScenarios: [scenario, ...state.savedScenarios]
                })),

            deleteScenario: (id: string) =>
                set((state) => ({
                    savedScenarios: state.savedScenarios.filter(s => s.id !== id)
                })),

            resetDefaults: () =>
                set({
                    costDrivers: defaultCostDrivers,
                    globalSettings: defaultGlobalSettings,
                    licenses: defaultLicenses,
                    projectedFleetSize: 100,
                    hardware: defaultHardware,
                    products: [],
                    activeProductId: null,
                    savedScenarios: []
                }),
        }),
        {
            name: 'profit-lens-storage',
            // storage: createJSONStorage(() => localStorage), // implicit default
        }
    )
);
