import { create } from 'zustand';
import { CostDrivers, GlobalSettings, StoreState, License, Product } from '../types';

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
    agentHourlyRate: 25.00,
};

const defaultGlobalSettings: GlobalSettings = {
    currency: 'USD',
    planPrice: 49.00,
    avgDataUsageGB: 10,
    avgStorageGB: 50,
    isAiEnabled: false,
    isCellularBackupEnabled: false,
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

export const useStore = create<StoreState>((set) => ({
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

    // Product Actions
    products: [],
    activeProductId: null,

    addProduct: (product: Product) =>
        set((state) => ({
            products: [...state.products, product]
        })),

    updateProduct: (id: string, updates: Partial<Product>) =>
        set((state) => ({
            products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
        })),

    deleteProduct: (id: string) =>
        set((state) => ({
            products: state.products.filter(p => p.id !== id),
            activeProductId: state.activeProductId === id ? null : state.activeProductId
        })),

    setActiveProduct: (id: string | null) =>
        set({ activeProductId: id }),

    resetDefaults: () =>
        set({
            costDrivers: defaultCostDrivers,
            globalSettings: defaultGlobalSettings,
            licenses: defaultLicenses,
            projectedFleetSize: 100,
            products: [],
            activeProductId: null
        }),
}));
