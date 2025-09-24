import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface QuoteData {
  formData: {
    exhibitionName?: string;
    destinationCity: string;
    destinationState: string;
    eventStartDate: string;
    eventEndDate: string;
    boothSize: number;
    customSize?: number;
    teamSize: number;
    industry?: string;
  };
  costs: {
    total: number;
    breakdown: {
      boothRental: number;
      stallConstruction: number;
      travel: number;
      accommodation: number;
      marketing: number;
      logistics: number;
      additionalServices: number;
    };
  };
  selectedFlights?: any;
  selectedHotel?: any;
  selectedVendors: any[];
  timestamp: string;
}

export class LetterheadPDFGenerator {
  private doc: PDFKit.PDFDocument;
  private letterheadPath: string;

  constructor() {
    this.doc = new PDFDocument({ 
      size: 'A4',
      margins: { top: 100, bottom: 50, left: 50, right: 50 }
    });
    this.letterheadPath = path.join(process.cwd(), 'attached_assets', 'Tvastar PI-2.pdf-2_1755357417916.pdf');
  }

  private formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private addLetterheadHeader() {
    // Add EASEMYEXPO branding header
    this.doc.fontSize(24)
           .font('Helvetica-Bold')
           .fillColor('#10B981')
           .text('EASEMYEXPO', 50, 50);
    
    this.doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#666666')
           .text('Redefining the future of exhibitions', 50, 80);

    // Contact information in header
    this.doc.fontSize(9)
           .fillColor('#333333')
           .text('+91 9321522751', 400, 50)
           .text('hello@easemyexpo.in', 400, 65)
           .text('#101, Dasarahalli Main Rd, near Anjaneya Temple', 400, 80)
           .text('Maruthi Layout, Karnataka 560024', 400, 95);

    // Add a line separator
    this.doc.moveTo(50, 120)
           .lineTo(545, 120)
           .strokeColor('#10B981')
           .lineWidth(2)
           .stroke();
  }

  private addQuoteHeader(quoteData: QuoteData) {
    const startY = 140;
    
    // Quote title
    this.doc.fontSize(18)
           .font('Helvetica-Bold')
           .fillColor('#333333')
           .text('EXHIBITION COST QUOTATION', 50, startY);

    // Quote number and date
    const quoteNumber = `EXH-${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString('en-IN');
    
    this.doc.fontSize(10)
           .font('Helvetica')
           .text(`Quote #: ${quoteNumber}`, 400, startY)
           .text(`Date: ${currentDate}`, 400, startY + 15);

    // Exhibition details
    const detailsY = startY + 40;
    this.doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#10B981')
           .text('Exhibition Details:', 50, detailsY);

    this.doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#333333')
           .text(`Exhibition: ${quoteData.formData.exhibitionName || 'TBD'}`, 50, detailsY + 20)
           .text(`Location: ${quoteData.formData.destinationCity}, ${quoteData.formData.destinationState}`, 50, detailsY + 35)
           .text(`Dates: ${this.formatDate(quoteData.formData.eventStartDate)} - ${this.formatDate(quoteData.formData.eventEndDate)}`, 50, detailsY + 50)
           .text(`Booth Size: ${quoteData.formData.customSize || quoteData.formData.boothSize} sqm`, 50, detailsY + 65)
           .text(`Team Size: ${quoteData.formData.teamSize} members`, 50, detailsY + 80)
           .text(`Industry: ${quoteData.formData.industry || 'General'}`, 50, detailsY + 95);
  }

  private addCostBreakdown(quoteData: QuoteData) {
    const startY = 320;
    
    // Cost breakdown title
    this.doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#10B981')
           .text('Cost Breakdown:', 50, startY);

    // Table headers
    const tableY = startY + 25;
    this.doc.fontSize(10)
           .font('Helvetica-Bold')
           .fillColor('#333333')
           .text('Description', 50, tableY)
           .text('Amount', 450, tableY);

    // Draw header line
    this.doc.moveTo(50, tableY + 15)
           .lineTo(545, tableY + 15)
           .strokeColor('#cccccc')
           .lineWidth(1)
           .stroke();

    // Safely access cost breakdown with fallbacks
    const breakdown: any = quoteData.costs?.breakdown || {};
    const items = [
      { name: 'Booth Rental', amount: breakdown.boothRental || breakdown.space || 0 },
      { name: 'Stall Construction & Design', amount: breakdown.stallConstruction || breakdown.construction || breakdown.booth || 0 },
      { name: 'Travel & Flights', amount: breakdown.travel || breakdown.transportation || 0 },
      { name: 'Accommodation', amount: breakdown.accommodation || breakdown.hotel || 0 },
      { name: 'Marketing & Branding', amount: breakdown.marketing || breakdown.branding || 0 },
      { name: 'Logistics & Freight', amount: breakdown.logistics || breakdown.freight || 0 },
      { name: 'Staff & Operations', amount: breakdown.staff || breakdown.operations || 0 },
      { name: 'Additional Services', amount: breakdown.additionalServices || breakdown.additional || breakdown.extras || 0 }
    ];

    let currentY = tableY + 25;
    this.doc.fontSize(10).font('Helvetica').fillColor('#333333');

    items.forEach((item, index) => {
      if (item.amount && item.amount > 0) {
        this.doc.text(item.name, 50, currentY)
               .text(this.formatCurrency(item.amount), 450, currentY);
        currentY += 20;
      }
    });

    // Total line
    currentY += 10;
    this.doc.moveTo(50, currentY)
           .lineTo(545, currentY)
           .strokeColor('#10B981')
           .lineWidth(2)
           .stroke();

    // Total amount with fallback
    const totalCost = quoteData.costs?.total || 0;
    this.doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#10B981')
           .text('TOTAL ESTIMATED COST:', 50, currentY + 15)
           .text(this.formatCurrency(totalCost), 450, currentY + 15);
  }

  private addSelectedServices(quoteData: QuoteData) {
    const startY = 580;

    if (quoteData.selectedVendors.length > 0) {
      this.doc.fontSize(12)
             .font('Helvetica-Bold')
             .fillColor('#10B981')
             .text('Selected Vendors:', 50, startY);

      let currentY = startY + 20;
      this.doc.fontSize(9).font('Helvetica').fillColor('#333333');
      
      quoteData.selectedVendors.slice(0, 3).forEach((vendor, index) => {
        this.doc.text(`• ${vendor}`, 50, currentY);
        currentY += 15;
      });
    }

    // Travel details if available
    if (quoteData.selectedFlights || quoteData.selectedHotel) {
      const travelY = startY + 100;
      this.doc.fontSize(12)
             .font('Helvetica-Bold')
             .fillColor('#10B981')
             .text('Travel Arrangements:', 50, travelY);

      let currentY = travelY + 20;
      this.doc.fontSize(9).font('Helvetica').fillColor('#333333');

      if (quoteData.selectedFlights?.outbound) {
        this.doc.text(`Outbound: ${quoteData.selectedFlights.outbound.airline} ${quoteData.selectedFlights.outbound.flightNumber}`, 50, currentY);
        currentY += 15;
      }
      
      if (quoteData.selectedHotel) {
        this.doc.text(`Hotel: ${quoteData.selectedHotel.name}`, 50, currentY);
        currentY += 15;
      }
    }
  }

  private addFooter() {
    const footerY = 750;
    
    // Terms and conditions
    this.doc.fontSize(8)
           .font('Helvetica')
           .fillColor('#666666')
           .text('Terms & Conditions:', 50, footerY)
           .text('• Prices are estimates and may vary based on final requirements', 50, footerY + 12)
           .text('• Final pricing will be confirmed upon booking', 50, footerY + 24)
           .text('• All prices are inclusive of applicable taxes', 50, footerY + 36);

    // Contact for queries
    this.doc.fontSize(9)
           .font('Helvetica-Bold')
           .fillColor('#10B981')
           .text('For queries, contact: hello@easemyexpo.in | +91 9321522751', 50, footerY + 60);
  }

  public async generateQuotePDF(quoteData: QuoteData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        
        this.doc.on('data', (chunk) => chunks.push(chunk));
        this.doc.on('end', () => resolve(Buffer.concat(chunks)));
        this.doc.on('error', reject);

        // Build the PDF with letterhead styling
        this.addLetterheadHeader();
        this.addQuoteHeader(quoteData);
        this.addCostBreakdown(quoteData);
        this.addSelectedServices(quoteData);
        this.addFooter();

        // Finalize the PDF
        this.doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}