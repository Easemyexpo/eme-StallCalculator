import PDFDocument from 'pdfkit';

interface QuoteData {
  formData: any;
  costs: any;
  selectedFlights?: any;
  selectedHotel?: any;
  selectedVendors?: any[];
  timestamp: string;
}

export class EnterprisePDFGenerator {
  private doc: any;
  private pageWidth = 595.28; // A4 width
  private pageHeight = 841.89; // A4 height
  private margin = 50;
  private contentWidth: number;
  private currentY = 50;

  constructor() {
    this.contentWidth = this.pageWidth - (2 * this.margin);
    this.doc = new PDFDocument({
      size: 'A4',
      margin: this.margin,
      bufferPages: false, // Force single page
      autoFirstPage: true,
      info: {
        Title: 'EaseMyExpo Professional Quote',
        Author: 'EaseMyExpo',
        Subject: 'Exhibition Cost Estimate',
        Creator: 'EaseMyExpo Platform'
      }
    });
  }

  private formatCurrency(amount: number): string {
    if (!amount || isNaN(amount)) return '₹0';
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  private formatDate(date: string): string {
    if (!date) return 'To Be Determined';
    try {
      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    } catch {
      return 'To Be Determined';
    }
  }

  private addHeader() {
    // Company header background with gradient effect
    this.doc.rect(0, 0, this.pageWidth, 70).fill('#10B981');
    
    // EaseMyExpo logo text with modern styling
    this.doc.fontSize(24).font('Helvetica-Bold').fillColor('white');
    this.doc.text('EaseMyExpo', this.margin, 15);
    
    // Add stylized 'e' logo representation
    this.doc.circle(this.margin + 120, 25, 12).fill('white');
    this.doc.fontSize(16).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text('e', this.margin + 116, 19);
    
    // Tagline
    this.doc.fontSize(10).font('Helvetica').fillColor('#E6F7F1');
    this.doc.text('Professional Exhibition Solutions', this.margin, 45);
    
    // Contact info - compact right alignment
    this.doc.fontSize(9).font('Helvetica').fillColor('white');
    const contactX = this.pageWidth - 180;
    this.doc.text('📧 hello@easemyexpo.in', contactX, 15);
    this.doc.text('📞 +91 9321522751', contactX, 30);
    this.doc.text('🌐 www.easemyexpo.in', contactX, 45);

    this.currentY = 85;
  }

  private addQuoteInfo(data: QuoteData) {
    // Quote title - more compact
    this.doc.fontSize(16).font('Helvetica-Bold').fillColor('#065F46');
    this.doc.text('EXHIBITION COST QUOTATION', this.margin, this.currentY);
    this.currentY += 25;

    // Compact quote details box
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 45).fill('#F3F4F6');

    const quoteNum = `EME-${Date.now().toString().slice(-6)}`;
    const today = new Date().toLocaleDateString('en-IN');

    this.doc.fontSize(9).font('Helvetica-Bold').fillColor('#374151');
    
    // Single row layout for compactness
    this.doc.text('Quote #:', this.margin + 10, this.currentY + 12);
    this.doc.text('Date:', this.margin + 10, this.currentY + 28);
    
    this.doc.font('Helvetica');
    this.doc.text(quoteNum, this.margin + 55, this.currentY + 12);
    this.doc.text(today, this.margin + 55, this.currentY + 28);

    // Right side - exhibition info
    this.doc.font('Helvetica-Bold');
    const rightX = this.margin + 200;
    this.doc.text('Exhibition:', rightX, this.currentY + 12);
    this.doc.text('Location:', rightX, this.currentY + 28);
    
    this.doc.font('Helvetica');
    this.doc.text(data.formData.exhibitionName || 'Exhibition Planning', rightX + 65, this.currentY + 12);
    this.doc.text(`${data.formData.destinationCity}, ${data.formData.destinationState}`, rightX + 65, this.currentY + 28);

    this.currentY += 60;
  }

  private addSummary(data: QuoteData) {
    // Compact summary section
    this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text('Investment Summary', this.margin, this.currentY);
    this.currentY += 20;

    // Compact summary box
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 55).fill('#F0FDF4');

    const boothSize = Number(data.formData.boothSize) || Number(data.formData.customSize) || 20;
    const teamSize = Number(data.formData.teamSize) || 5;

    // Three columns - more compact
    const col1 = this.margin + 20;
    const col2 = this.margin + 170;
    const col3 = this.margin + 320;

    this.doc.fontSize(10).font('Helvetica-Bold').fillColor('#065F46');
    this.doc.text('Total Investment', col1, this.currentY + 12);
    this.doc.text('Booth Size', col2, this.currentY + 12);
    this.doc.text('Team Size', col3, this.currentY + 12);

    this.doc.fontSize(16).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text(this.formatCurrency(data.costs.total), col1, this.currentY + 26);
    this.doc.text(`${boothSize} sqm`, col2, this.currentY + 26);
    this.doc.text(`${teamSize} people`, col3, this.currentY + 26);

    this.doc.fontSize(8).font('Helvetica').fillColor('#6B7280');
    this.doc.text('ROI: 300-500%', col1, this.currentY + 45);

    this.currentY += 70;
  }

  private addCostBreakdown(data: QuoteData) {
    // Compact cost breakdown
    this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text('Cost Breakdown', this.margin, this.currentY);
    this.currentY += 18;

    // Compact table header
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 20).fill('#10B981');
    this.doc.fontSize(10).font('Helvetica-Bold').fillColor('white');
    this.doc.text('Component', this.margin + 8, this.currentY + 6);
    this.doc.text('Details', this.margin + 180, this.currentY + 6);
    this.doc.text('Amount', this.margin + 350, this.currentY + 6);
    this.currentY += 20;

    // Compact cost items
    const items = [
      {
        component: 'Space Rental',
        description: `${Number(data.formData.boothSize) || 20} sqm space`,
        amount: data.costs.boothCost || data.costs.spaceCost || 0
      },
      {
        component: 'Booth Construction',
        description: 'Design & fabrication',
        amount: data.costs.constructionCost || 0
      },
      {
        component: 'Travel & Stay',
        description: `${Number(data.formData.teamSize) || 5} members`,
        amount: data.costs.travelCost || 0
      },
      {
        component: 'Marketing',
        description: 'Promotional materials',
        amount: data.costs.marketingCost || 0
      },
      {
        component: 'Services',
        description: 'Setup & logistics',
        amount: data.costs.servicesCost || data.costs.logisticsCost || 0
      }
    ];

    items.forEach((item, index) => {
      const bgColor = index % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
      this.doc.rect(this.margin, this.currentY, this.contentWidth, 18).fill(bgColor);
      
      this.doc.fontSize(9).font('Helvetica-Bold').fillColor('#374151');
      this.doc.text(item.component, this.margin + 8, this.currentY + 5);
      
      this.doc.font('Helvetica').fillColor('#6B7280');
      this.doc.text(item.description, this.margin + 180, this.currentY + 5);
      
      this.doc.font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text(this.formatCurrency(item.amount), this.margin + 350, this.currentY + 5);
      
      this.currentY += 18;
    });

    // Compact total row
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 25).fill('#065F46');
    this.doc.fontSize(12).font('Helvetica-Bold').fillColor('white');
    this.doc.text('TOTAL INVESTMENT', this.margin + 8, this.currentY + 8);
    this.doc.text(this.formatCurrency(data.costs.total), this.margin + 350, this.currentY + 8);
    
    this.currentY += 35;
  }

  private addServiceDetails(data: QuoteData) {
    if (!data.selectedFlights?.outbound && !data.selectedHotel && (!data.selectedVendors || data.selectedVendors.length === 0)) {
      return; // Skip if no services
    }

    this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text('Selected Services', this.margin, this.currentY);
    this.currentY += 20;

    // Flight details
    if (data.selectedFlights?.outbound) {
      this.doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151');
      this.doc.text('Flight:', this.margin, this.currentY);
      
      this.doc.font('Helvetica').fillColor('#6B7280');
      this.doc.text(`${data.selectedFlights.outbound.airline} ${data.selectedFlights.outbound.flightNumber}`, this.margin + 50, this.currentY);
      this.doc.text(`${data.selectedFlights.outbound.departure} - ${data.selectedFlights.outbound.arrival}`, this.margin + 250, this.currentY);
      this.currentY += 15;
    }

    // Hotel details
    if (data.selectedHotel) {
      this.doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151');
      this.doc.text('Hotel:', this.margin, this.currentY);
      
      this.doc.font('Helvetica').fillColor('#6B7280');
      this.doc.text(data.selectedHotel.name, this.margin + 50, this.currentY);
      this.doc.text(`${this.formatCurrency(data.selectedHotel.pricePerNight)}/night`, this.margin + 250, this.currentY);
      this.currentY += 15;
    }

    // Vendors (max 2 to save space)
    if (data.selectedVendors && data.selectedVendors.length > 0) {
      this.doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151');
      this.doc.text('Partners:', this.margin, this.currentY);
      
      this.doc.font('Helvetica').fillColor('#6B7280');
      const vendorNames = data.selectedVendors.slice(0, 2).map((v: any) => v.name || v).join(', ');
      this.doc.text(vendorNames, this.margin + 50, this.currentY);
      this.currentY += 15;
    }

    this.currentY += 10;
  }

  private addTermsAndFooter() {
    // Ensure we stay on single page - calculate remaining space
    const maxY = this.pageHeight - 120;
    
    if (this.currentY > maxY - 100) {
      this.currentY = maxY - 80; // Force position for terms
    }

    // Compact terms section
    this.doc.fontSize(11).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text('Terms & Conditions', this.margin, this.currentY);
    this.currentY += 12;

    const terms = [
      '• Quote valid 30 days • 50% advance required • Final pricing subject to availability',
      '• Prices include taxes & coordination fees • Cancellation per vendor terms'
    ];

    this.doc.fontSize(8).font('Helvetica').fillColor('#6B7280');
    terms.forEach(term => {
      this.doc.text(term, this.margin, this.currentY);
      this.currentY += 10;
    });

    // Fixed footer position
    const footerY = this.pageHeight - 50;
    this.doc.rect(0, footerY, this.pageWidth, 50).fill('#10B981');
    
    this.doc.fontSize(11).font('Helvetica-Bold').fillColor('white');
    this.doc.text('Thank you for choosing EaseMyExpo!', this.margin, footerY + 12);
    
    this.doc.fontSize(9).font('Helvetica').fillColor('#E6F7F1');
    this.doc.text('We look forward to making your exhibition a success.', this.margin, footerY + 30);
    this.doc.text('hello@easemyexpo.in | +91 9321522751', this.pageWidth - 200, footerY + 30);
  }

  async generateQuotePDF(data: QuoteData): Promise<Buffer> {
    try {
      // Build the single-page PDF
      this.addHeader();
      this.addQuoteInfo(data);
      this.addSummary(data);
      this.addCostBreakdown(data);
      this.addServiceDetails(data);
      this.addTermsAndFooter();

      // Finalize
      this.doc.end();

      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        this.doc.on('data', (chunk: any) => chunks.push(chunk));
        this.doc.on('end', () => resolve(Buffer.concat(chunks)));
        this.doc.on('error', reject);
      });
    } catch (error) {
      console.error('Enterprise PDF generation error:', error);
      throw error;
    }
  }
}

// Export for compatibility
export const ProfessionalPDFGenerator = EnterprisePDFGenerator;