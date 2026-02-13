# ProfitLens: Business User Manual

## Access the Application
**Live Application URL:**  
[https://profit-lens-kh85ykxff-terulins-projects.vercel.app/](https://profit-lens-kh85ykxff-terulins-projects.vercel.app/)

---

## Introduction
ProfitLens is a strategic visualizer for SaaS unit economics. It empowers product managers and finance leaders to model the true cost of their software, identify break-even points, and benchmark against competitors.

> [!IMPORTANT]
> **AI Market Analysis Disclaimer:** 
> The "Market Analysis" feature uses experimental AI (Google Gemini) to discover competitor data. Results are for estimation only and may vary in accuracy. This feature is currently under active development.

---

## 1. Getting Started

Simply click the link above in a supported browser (Chrome, Safari, Edge) to access the dashboard. No installation or login is required. The application runs entirely in your browser.

---

## 2. Standard Workflow

Follow these steps to generate a complete strategic report:

### Phase 1: Internal Cost Modeling
1.  **Input Product Data**: Go to the **Calculator** or **Market Analysis** tab. Enter your *Product Code* and *Description* to define what you are modeling.
2.  **Define Costs**:
    *   Navigate to **Cost Drivers** to set your baseline operational rates.
    *   Go to **Hardware** to add physical device costs.
    *   Go to **Licenses** to add third-party software costs.
3.  **Snapshot the Model**: Click the **Save Scenario** icon (floppy disk) in the Calculator.
    *   *Why?* This locks your current internal unit economics so you can reference them later.

### Phase 2: Market Intelligence
4.  **Load a Scenario**: Go to **Product COGS** in the sidebar. Select your saved scenario from the list to reload those specific cost settings.
5.  **Run Market Analysis**: 
    *   Navigate to the **Market Analysis** tab.
    *   Select your product/material code from the dropdown (or ensure the description is correct).
    *   Click **"Analyze Market"**. The AI will scout for 3 real-world competitors and estimate their pricing.
6.  **Review Competitors**: Check the "Estimated Price" and "Differentiator" columns to see how your internal costs compare to the market reality.

### Phase 3: Strategic Reporting
7.  **Finalize & Print**:
    *   Once you are satisfied with the comparison, click **"Download Report"**.
    *   This generates a PDF combining your *Internal Unit Economics* (Phase 1) with the *External Market Data* (Phase 2), ready for executive review.

---

## 3. Dashboard Sections & Fields

### A. Global Settings (Sidebar)
These top-level inputs affect the entire model.
*   **Plan Price ($)**: The monthly subscription price you intend to charge your customer.
*   **Currency**: Select your reporting currency (USD, EUR, GBP, etc.). All calculations usually convert 1:1 for simplicity in this model.
*   **Avg Data Usage (GB)**: Expected monthly data transfer per user. Drives *Infrastructure* costs.
*   **Avg Storage (GB)**: Expected database storage per user. Drives *Storage* costs.

### B. Feature Toggles
Enable or disable specific cost centers to see their impact on margins.
*   **AI Premium Features**: Adds a *Compute Surcharge* (e.g., for heavy LLM usage).
*   **Cellular Backup**: Adds a *SIM Fee* (e.g., for IoT devices requiring 4G/5G).
*   **Live Monitoring**: Switches Labor from "Standard" to "Advanced", modeling high-touch support costs.

### C. Cost Drivers (Settings Page)
Your baseline operational costs. Negotiate these with vendors.
*   **Data Rate ($/GB)**: Cost paid to cloud provider (AWS/Azure) for data transfer.
*   **Storage Rate ($/GB)**: Monthly cost to store 1GB of data.
*   **Telemetry Fee**: Fixed monitoring cost (e.g., Datadog) per active device/user.
*   **Integration Fees**: Costs associated with third-party setups or royalties.
*   **Dunning Cost**: Estimated loss/cost to recover failed payments.

### D. Hardware Integration (Hardware Page)
Model Capital Expenditure (CapEx) for physical devices sent to customers.
*   **Hardware Item**: Name of the device (e.g., "Sensor Type A").
*   **Cost**: Unit cost to you.
*   **Quantity**: Number of units per customer setup.
*   **Type**: Category (Camera, Sensor, Compute, etc.).
*   *Impact*: Hardware costs are typically amortized or charged upfront.

### E. License Manager (Settings Page)
Pass-through costs for third-party software.
*   **Per-User**: You pay this for every single active user (e.g., Google Maps API).
*   **Block**: You buy in bulk (e.g., 100-pack). Efficiency calculation is included.
*   **One-Time**: Activation fees usually amortized over the contract.

---

### F. Profitability Tiles (The 3 Cards)
The dashboard displays three key scenarios side-by-side to help you compare contract terms.
1.  **Monthly**: High flexibility for the customer, but often lower margin for you due to recurring transaction fees and higher churn risk.
2.  **6-Month**: A balance of commitment and flexibility.
3.  **Yearly**: The "Gold Standard". Usually offers the best cash flow (upfront payment) and lowest transaction overhead.
    *   *Green Highlight*: The tile with the highest profit margin is automatically highlighted in green.

**Data in Each Tile:**
*   **Revenue**: Total contract value (e.g., $10/mo * 12 = $120).
*   **Total Cost**: Sum of ALL operational costs + amortized hardware + support.
*   **Margin**: The percentage of revenue you keep as profit.

---

## 3. Key Features

### Scenario History
*   **Save Scenario**: Click the "Save" icon to timestamp your current model.
*   **History View**: Access "Product COGS History" from the sidebar to compare different pricing strategies over time (e.g., "Aggressive Growth" vs "Conservative").

### Live Market Analysis (Experimental)
*   **Competitor Discovery**: Enter your product description to find 3 real-world competitors.
*   **Price Benchmarking**: The AI estimates their pricing to see if you are competitive.
*   **PDF Report**: Click **"Download Report"** to generate a professional PDF summary of your unit economics and the competitor data, ready for stakeholder presentation.

### Visualizations
*   **Waterfall Chart**: Break down where every dollar of revenue goes.
*   **Break-Even Analysis**: See exactly when a customer becomes profitable (Cash View vs. Revenue Recognition).

---

## 4. Troubleshooting Support
If you encounter issues:
*   **PDF Download Fails**: Ensure you have a stable internet connection as the report generator needs to load fonts and assets.
*   **Market Analysis Errors**: If the AI returns no results or fails, please try simplifying your product description. The feature is experimental and may occasionally be temporarily unavailable.

For further assistance or feature requests, please contact the development team.
