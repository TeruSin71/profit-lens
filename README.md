# ProfitLens: SaaS Unit Economics Calculator

ProfitLens is a specialized tool for modeling the unit economics of SaaS businesses, specifically those with complex cost structures involving hardware, connectivity, and third-party software licenses.

## Features

*   **Cost Drivers**: Configurable inputs for cloud infrastructure, connectivity, and labor costs.
*   **License Manager**: Manage Per-User, Block, and One-Time software license costs.
*   **Sensitivity Analysis**: Compare Monthly, 6-Month, and Yearly contract terms.
*   **Visualizations**: Waterfall charts for COGS breakdown and Break-Even analysis.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm (v9 or higher)

### Installation

1.  Navigate to the project directory:
    ```bash
    cd profit-lens
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to the local URL shown in the terminal (usually `http://localhost:5173`).

---

## Project Structure

*   `src/components/Calculator.tsx`: Core logic for profitability calculations.
*   `src/components/LicenseManager.tsx`: UI for managing software licenses.
*   `src/store/useStore.ts`: Central state management (Zustand) for costs and settings.
*   `src/types.ts`: TypeScript definitions for the application domain.

## Documentation

For a detailed guide on the business logic and field definitions, please refer to the **User Manual** artifact generated during development.
