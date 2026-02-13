export interface CostDrivers {
    // Infrastructure
    dataRatePerGB: number;
    storageRatePerGB: number;
    telemetryFeePerDevice: number;
    computeSurchargePerAIUser: number;

    // Connectivity
    simFeePerActiveSIM: number;
    connectionMaintenancePerDeviceYear: number;

    // Integrations
    integrationFixedFee: number;
    integrationVariableFee: number;

    // Billing
    gatewayFeePercent: number;
    gatewayFixedFee: number;
    dunningCost: number;

    // Labor
    agentHourlyRate: number; // Added to standard labor logic if needed, primarily for 'Advanced Service Mode' calculation context
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CNY' | 'NZD';

export interface GlobalSettings {
    // Currency
    currency: Currency;

    // Plan Inputs
    planPrice: number;
    avgDataUsageGB: number;
    avgStorageGB: number;

    // Toggles
    isAiEnabled: boolean;
    isCellularBackupEnabled: boolean;
    isLiveMonitoringEnabled: boolean;

    // Labor Mode
    laborMode: 'standard' | 'advanced'; // Standard = OpEx, Advanced = COGS
}

// License Types
export type LicenseType = 'per-user' | 'block' | 'one-time';

export interface License {
    id: string;
    name: string;
    type: LicenseType;
    isEnabled: boolean; // Calculating toggle state

    // Type A: Per-User
    costPerUnit?: number;
    billingFrequency?: 'monthly' | 'yearly';

    // Type B: Block
    blockPrice?: number;
    unitsPerBlock?: number;

    // Type C: One-Time
    oneTimeFee?: number;
    amortizationTermMonths?: number;
}

export interface StoreState {
    costDrivers: CostDrivers;
    globalSettings: GlobalSettings;
    licenses: License[];
    projectedFleetSize: number; // For Block efficiency calc

    setCostDriver: (key: keyof CostDrivers, value: number) => void;
    setGlobalSetting: <K extends keyof GlobalSettings>(key: K, value: GlobalSettings[K]) => void;

    // License Actions
    addLicense: (license: License) => void;
    updateLicense: (id: string, updates: Partial<License>) => void;
    toggleLicense: (id: string, isEnabled: boolean) => void;
    setProjectedFleetSize: (size: number) => void;

    resetDefaults: () => void;

    // Product Data
    products: Product[];
    activeProductId: string | null;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    setActiveProduct: (id: string | null) => void;
}

export interface Product {
    id: string;
    materialCode: string;
    description: string;
}
