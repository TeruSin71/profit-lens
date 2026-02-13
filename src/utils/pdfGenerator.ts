import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Competitor } from '../services/geminiService';
import { CalculatorData } from '../types';

export const generateMarketReport = (
    calculatorData: CalculatorData,
    planPrice: number,
    term: string,
    competitors: Competitor[]
) => {
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Helper for centering text
    const centerText = (text: string, y: number, fontSize: number = 12, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        const textWidth = doc.getTextWidth(text);
        doc.text(text, (pageWidth - textWidth) / 2, y);
    };

    // --- Header ---
    centerText("Profit Lens: Strategic Analysis Report", 20, 18, true);
    centerText("Generated via Profit Lens Dashboard", 28, 12, false);

    // Draw a line
    doc.setLineWidth(0.5);
    doc.line(20, 35, pageWidth - 20, 35);


    // --- Section A: Internal Unit Economics ---
    let yPos = 45;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Section A: Internal Unit Economics", 20, yPos);

    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    // Overview
    doc.text(`Selling Price: $${planPrice.toFixed(2)}`, 20, yPos);
    doc.text(`Term: ${term}`, 120, yPos);

    yPos += 10;

    // COGS Breakdown
    const headers = [["Component", "Cost"]];
    const data = [
        ["Infrastructure & Cloud", `$${calculatorData.costs.infra.toFixed(2)}`],
        ["Connectivity", `$${calculatorData.costs.connectivity.toFixed(2)}`],
        ["Labor & Support", `$${calculatorData.costs.labor.toFixed(2)}`],
        ["Transaction Fees", `$${calculatorData.costs.transaction.toFixed(2)}`],
        ["Licenses & Billing", `$${(calculatorData.costs.licenses + calculatorData.costs.billing).toFixed(2)}`],
        ["TOTAL COGS", `$${calculatorData.totalCost.toFixed(2)}`]
    ];

    autoTable(doc, {
        startY: yPos,
        head: headers,
        body: data,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] }, // Blue header
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
    });

    // Get Y position after table
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Margin Analysis
    // Margin is calculated as (Price - Cost) / Price
    const margin = calculatorData.marginPercent.toFixed(1);

    doc.setFont("helvetica", "bold");
    doc.text(`Gross Margin: ${margin}%`, 20, yPos);

    yPos += 7;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Formula: Margin = (Price - COGS) / Price * 100", 20, yPos);
    doc.setTextColor(0); // Reset color


    // --- Section B: Competitor Market Intelligence ---
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Section B: Competitor Market Intelligence", 20, yPos);

    yPos += 10;

    if (competitors.length > 0) {
        const compHeaders = [["Competitor Name", "Price", "Key Features", "Target Audience"]];
        const compData = competitors.map(c => [
            c.name,
            c.price,
            c.features,
            c.audience
        ]);

        autoTable(doc, {
            startY: yPos,
            head: compHeaders,
            body: compData,
            theme: 'grid',
            headStyles: { fillColor: [39, 174, 96] }, // Green header for market data
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 40 }, // Name
                1: { cellWidth: 40 }, // Price
                2: { cellWidth: 'auto' } // Differentiator
            },
            margin: { left: 20, right: 20 }
        });
    } else {
        doc.setFontSize(11);
        doc.setFont("helvetica", "italic");
        doc.text("No competitor data available at time of print.", 20, yPos);
    }


    // --- Footer: Timestamp ---
    const dateStr = new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true
    });

    // Add page numbers and timestamp to bottom of every page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Report Generated: ${dateStr}`, 20, doc.internal.pageSize.height - 10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
    }

    // Save File
    const filenameDate = new Date().toISOString().split('T')[0];
    doc.save(`ProfitLens_Report_${filenameDate}.pdf`);
};
