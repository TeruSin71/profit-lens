# ProfitLens: User Manual & Business Guide

## Introduction
ProfitLens is a specialized tool designed to help SaaS business leaders, product managers, and finance teams visualize the true unit economics of their subscription products. By inputting granular cost drivers—from cloud infrastructure to third-party licenses—you can accurately model your **Cost of Goods Sold (COGS)** and identify the break-even point for different pricing strategies.

This guide explains how to use each section of the calculator and what the business terms mean.

---

## 1. Quick Start
1.  **Configure Cost Drivers**: Go to the **Cost Drivers** tab to set your baseline costs (cloud, connectivity, labor).
2.  **Add Licenses**: Use the **License Manager** to input any per-user or third-party software costs (e.g., AI API fees, mapping services).
3.  **Set Pricing**: Go to the **Calculator** tab to set your target sell price and toggle premium features on/off.
4.  **Analyze**: Review the **Profitability Calculator** cards and the **Visualizations** below to see your margin and break-even timeline.

---

## 2. Cost Drivers (Settings Tab)
These inputs define your baseline operational costs. Use this section to input your negotiated rates with vendors.

### Infrastructure & Cloud
*   **Data Rate ($/GB)**: The cost you pay your cloud provider (AWS/Azure/GCP) for data transfer per Gigabyte.
    *   *Business Impact*: High data usage applications (video, heavy IoT) are sensitive to this rate.
*   **Storage Rate ($/GB)**: The monthly cost to store 1GB of customer data.
    *   *Business Impact*: Critical for apps that retain historical data (logs, backups).
*   **Telemetry Fee ($/Device)**: A fixed monthly cost per active device/user for monitoring and logging services (e.g., Datadog, Splunk).
*   **Compute Surcharge ($/User)**: Additional server processing cost for premium users (e.g., dedicated instances).

### Connectivity & Hardware
*   **SIM Fee ($/Active SIM)**: The monthly fee for cellular connectivity if applicable.
    *   *Note*: Only applies if "Cellular Backup" is enabled in the Calculator.
*   **Maintenance ($/Device/Year)**: Annualized cost for physical maintenance or replacement of hardware devices.

### Integration & Gateway
*   **Integration Fixed Fee ($)**: Testing/Setup fee per unit.
*   **Integration Variable Fee ($)**: Per-unit royalty or variable cost.
*   **Gateway Fee (%)**: Percentage fee charged by your payment processor (Stripe, PayPal) per transaction.
*   **Gateway Fixed Fee ($)**: Fixed fee charged per transaction (e.g., $0.30).

### Operational (Labor)
*   **Dunning Cost ($)**: The estimated administrative cost to recover a failed payment (chasing overdue invoices).
    *   *Mitigation*: Yearly plans reduce this risk significantly.
*   **Agent Hourly Rate ($)**: The cost of a support agent per hour.
    *   *Applicability*: Used when "Live Monitoring" is enabled, modeling high-touch support costs.

---

## 3. License Manager
Manage third-party software costs that are passed through to your customer.

### License Types
1.  **Per-User Royalty ("The Pass-Through")**
    *   *Definition*: A direct cost for every active user or seat.
    *   *Example*: Google Maps API per user, specific AI model seat.
    *   *Input*: Cost per unit, Billing frequency.
2.  **Block / Tiered ("The Step Function")**
    *   *Definition*: You buy licenses in packs (e.g., 100 pack). Costs are "lumpy" – buying a new pack increases costs before you fill it with revenue-generating users.
    *   *Example*: 50-pack of device licenses.
    *   *Input*: Block Price, Units Per Block, Projected Fleet Size (to calculate efficiency).
3.  **One-Time Fee ("The Upfront")**
    *   *Definition*: A single activation fee per unit that you amortize (spread out) over a specific term.
    *   *Example*: Provisioning fee, specialized hardware activation.
    *   *Input*: Fee amount, Amortization term (months).

---

## 4. Calculator & Analysis
This is your main comparison dashboard.

### Plan Configuration
*   **Plan Price ($/mo)**: Your target subscription price to the customer.
*   **Labor Mode**:
    *   *Standard*: Minimal support included (Software margins).
    *   *Advanced*: High-touch support model (Service margins).
*   **Avg Data/Storage**: Expected usage per customer.

### Feature Flags (The "Levers")
Toggle these to see how adding features impacts your margin.
*   **AI Premium Features**: Adds the *Compute Surcharge* to the COGS.
*   **Cellular Backup**: Adds the *SIM Fee* to the COGS.
*   **Live Monitoring**: Activates *Advanced Labor* costs.
*   **[Licenses]**: Enable/Disable specific licenses created in the License Manager.

### Understanding the Columns
The calculator compares three common contract terms side-by-side:
1.  **Monthly**: High flexibility for customer, lowest margin for you.
    *   *Pros*: Easy to sell.
    *   *Cons*: Transaction fees paid 12x/year. High churn/billing risk.
2.  **6-Month Term**: A balance of commitment and flexibility.
    *   *Pros*: 1 transaction fee (if paid upfront).
    *   *Cons*: Slightly higher discount expectation.
3.  **Yearly Contract**: Gold standard for SaaS.
    *   *Pros*: 1 transaction fee. 0% billing risk after payment. Cash upfront.
    *   *Cons*: Harder to sell; usually requires a discount (e.g., 10-20%).

---

## 5. Visualizations

### Annualized Cost Composition (Waterfall)
*   **What it shows**: A breakdown of where every dollar of cost goes for each plan type.
*   **Key Insight**: Notice how "Transaction" and "Billing" costs shrink dramatically in the Yearly plan compared to the Monthly plan.

### Break-Even Analysis (Cash)
*   **What it shows**: Cumulative Money In vs. Money Out over 12 months.
*   **Green Line (Yearly Cash)**: Jumps up immediately (upfront payment).
*   **Blue Line (Monthly Rev)**: Climbs slowly over time.
*   **Yellow/Grey Lines (Costs)**: Cumulative costs.
*   **The "Cross"**: Where Revenue lines allow you to profit.

### ASC 606 Revenue Recognition
*   **What it shows**: The difference between **Cash Collected** (Bank Balance) and **Revenue Recognized** (Accounting Revenue).
*   **Why it matters**: For a Yearly plan, you get cash today, but you "earn" it slowly over 12 months. This chart visualizes that liability.
