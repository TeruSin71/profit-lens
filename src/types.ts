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

// Hardware Types
export interface HardwareItem {
    id: string;
    name: string;
    cost: number;
    quantity: number;
    type: 'camera' | 'compute' | 'sensor' | 'installation' | 'other';
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

    // Hardware Actions
    hardware: HardwareItem[];
    addHardware: (item: HardwareItem) => void;
    updateHardware: (id: string, updates: Partial<HardwareItem>) => void;
    deleteHardware: (id: string) => void;

    // Product Data
    products: Product[];
    activeProductId: string | null;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    setActiveProduct: (id: string | null) => void;

    // History / Scenarios
    savedScenarios: SavedScenario[];
    saveScenario: (scenario: SavedScenario) => void;
    deleteScenario: (id: string) => void;
}

export interface Product {
    id: string;
    materialCode: string;
    description: string;
}

export interface CalculatorData {
    revenue: number;
    totalCost: number;
    margin: number;
    marginPercent: number;
    costs: {
        infra: number;
        connectivity: number;
        transaction: number;
        labor: number;
        billing: number;
        licenses: number;
    };
}

export interface SavedScenario {
    id: string;
    name: string;
    timestamp: string; // ISO String
    formattedDate: string; // dd/mm/yyyy hh:mm
    inputs: {
        globalSettings: GlobalSettings;
        costDrivers: CostDrivers;
        licenses: License[];
        projectedFleetSize: number;
        activeProductId: string | null;
    };
    results: {
        monthly: CalculatorData;
        sixMonth: CalculatorData;
        yearly: CalculatorData;
    };
}
