import PDFDocument from 'pdfkit';

interface QuoteData {
  formData: any;
  costs: any;
  selectedFlights?: any;
  selectedHotel?: any;
  selectedVendors?: any[];
  timestamp: string;
}

export class ProfessionalPDFGenerator {
  private doc: PDFKit.PDFDocument;
  private pageWidth: number = 595.28; // A4 width in points
  private pageHeight: number = 841.89; // A4 height in points
  private margin: number = 40;
  private contentWidth: number;
  private currentY: number = 40;
  
  // Brand colors
  private primaryGreen = '#10B981';
  private secondaryGreen = '#059669';
  private accentColor = '#065F46';
  private textDark = '#1F2937';
  private textGray = '#6B7280';
  private lightGray = '#F3F4F6';

  constructor() {
    this.contentWidth = this.pageWidth - (2 * this.margin);
    this.doc = new PDFDocument({
      size: 'A4',
      margin: this.margin,
      info: {
        Title: 'EaseMyExpo Professional Exhibition Quote',
        Author: 'EaseMyExpo',
        Subject: 'Exhibition Cost Estimate & Planning',
        Creator: 'EaseMyExpo Platform',
        Keywords: 'exhibition, trade show, booth, cost estimate'
      }
    });
  }

  private formatCurrency(amount: number, currency: string = 'INR'): string {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '₹0';
    }
    
    if (currency === 'INR') {
      // Indian format with proper lakhs/crores
      if (amount >= 10000000) { // 1 crore
        return `₹${(amount / 10000000).toFixed(2)}Cr`;
      } else if (amount >= 100000) { // 1 lakh
        return `₹${(amount / 100000).toFixed(2)}L`;
      } else {
        return `₹${amount.toLocaleString('en-IN')}`;
      }
    }
    return `${currency} ${amount.toLocaleString()}`;
  }

  private formatDate(dateString: string): string {
    if (!dateString || dateString === 'TBD') return 'To Be Determined';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'To Be Determined';
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'To Be Determined';
    }
  }

  private addProfessionalHeader() {
    // Green gradient header background
    this.doc.rect(0, 0, this.pageWidth, 120)
           .fill('#10B981');

    // EaseMyExpo logo and brand
    this.doc.fontSize(32)
           .font('Helvetica-Bold')
           .fillColor('white')
           .text('EaseMyExpo', this.margin, 30);

    this.doc.fontSize(14)
           .font('Helvetica')
           .fillColor('#E8F5E8')
           .text('Professional Exhibition Solutions', this.margin, 70);

    // Contact information - right aligned
    const contactX = this.pageWidth - this.margin - 200;
    this.doc.fontSize(10)
           .font('Helvetica')
           .fillColor('white')
           .text('📧 hello@easemyexpo.in', contactX, 30)
           .text('📞 +91 9321522751', contactX, 45)
           .text('🌐 www.easemyexpo.in', contactX, 60)
           .text('📍 Bangalore, Karnataka', contactX, 75);

    this.currentY = 140;
  }

  private addQuoteHeader(quoteData: QuoteData) {
    // Quote title and metadata
    this.doc.fontSize(24)
           .font('Helvetica-Bold')
           .fillColor(this.textDark)
           .text('EXHIBITION COST QUOTATION', this.margin, this.currentY);

    this.currentY += 40;

    // Quote details box
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 80)
           .fill(this.lightGray);

    const leftColX = this.margin + 20;
    const rightColX = this.margin + (this.contentWidth / 2) + 20;
    const boxY = this.currentY + 15;

    this.doc.fontSize(11)
           .font('Helvetica-Bold')
           .fillColor(this.textDark)
           .text('Quote Number:', leftColX, boxY)
           .text('Date Generated:', leftColX, boxY + 20)
           .text('Valid Until:', leftColX, boxY + 40);

    this.doc.fontSize(11)
           .font('Helvetica')
           .fillColor(this.textGray)
           .text(`EME-${Date.now().toString().slice(-8)}`, leftColX + 100, boxY)
           .text(new Date().toLocaleDateString('en-IN'), leftColX + 100, boxY + 20)
           .text(new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-IN'), leftColX + 100, boxY + 40);

    // Exhibition details
    this.doc.fontSize(11)
           .font('Helvetica-Bold')
           .fillColor(this.textDark)
           .text('Exhibition:', rightColX, boxY)
           .text('Location:', rightColX, boxY + 20)
           .text('Industry:', rightColX, boxY + 40);

    this.doc.fontSize(11)
           .font('Helvetica')
           .fillColor(this.textGray)
           .text(quoteData.formData.exhibitionName || 'Exhibition Planning', rightColX + 70, boxY)
           .text(`${quoteData.formData.destinationCity}, ${quoteData.formData.destinationState}`, rightColX + 70, boxY + 20)
           .text(quoteData.formData.industry || 'General Trade', rightColX + 70, boxY + 40);

    this.currentY += 100;
  }

  private addExecutiveSummary(quoteData: QuoteData) {
    this.currentY += 20;
    
    // Executive Summary Header
    this.doc.fontSize(18)
           .font('Helvetica-Bold')
           .fillColor(this.primaryGreen)
           .text('Executive Summary', this.margin, this.currentY);

    this.currentY += 30;

    // Summary box with gradient
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 120)
           .fill('#F0FDF4');

    const summaryY = this.currentY + 20;
    const boothSize = Number(quoteData.formData.boothSize) || Number(quoteData.formData.customSize) || 20;
    const teamSize = Number(quoteData.formData.teamSize) || 5;

    // Main metrics in grid
    const col1X = this.margin + 30;
    const col2X = this.margin + 180;
    const col3X = this.margin + 330;

    this.doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor(this.accentColor)
           .text('Total Investment', col1X, summaryY)
           .text('Booth Area', col2X, summaryY)
           .text('Team Size', col3X, summaryY);

    this.doc.fontSize(20)
           .font('Helvetica-Bold')
           .fillColor(this.primaryGreen)
           .text(this.formatCurrency(quoteData.costs.total, quoteData.formData.currency), col1X, summaryY + 20)
           .text(`${boothSize} sqm`, col2X, summaryY + 20)
           .text(`${teamSize} people`, col3X, summaryY + 20);

    // ROI expectation
    this.doc.fontSize(10)
           .font('Helvetica')
           .fillColor(this.textGray)
           .text('Expected ROI: 300-500% within 12 months', col1X, summaryY + 50)
           .text('Cost per sqm: ' + this.formatCurrency(quoteData.costs.total / boothSize), col2X, summaryY + 50)
           .text('Cost per person: ' + this.formatCurrency(quoteData.costs.total / teamSize), col3X, summaryY + 50);

    this.currentY += 140;
  }

  private addDetailedBreakdown(quoteData: QuoteData) {
    this.currentY += 20;

    // Detailed Breakdown Header
    this.doc.fontSize(18)
           .font('Helvetica-Bold')
           .fillColor(this.primaryGreen)
           .text('Detailed Cost Breakdown', this.margin, this.currentY);

    this.currentY += 30;

    // Table header
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 30)
           .fill(this.primaryGreen);

    this.doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('white')
           .text('Description', this.margin + 20, this.currentY + 10)
           .text('Details', this.margin + 250, this.currentY + 10)
           .text('Amount', this.margin + 400, this.currentY + 10);

    this.currentY += 30;

    // Cost items
    const costItems = [
      {
        description: 'Exhibition Space Rental',
        details: `${Number(quoteData.formData.boothSize) || 20} sqm booth space`,
        amount: quoteData.costs.boothCost || quoteData.costs.spaceCost || 0
      },
      {
        description: 'Booth Construction & Design',
        details: 'Professional stall fabrication with branding',
        amount: quoteData.costs.constructionCost || 0
      },
      {
        description: 'Team Travel & Accommodation',
        details: `${Number(quoteData.formData.teamSize) || 5} team members`,
        amount: quoteData.costs.travelCost || 0
      },
      {
        description: 'Marketing & Promotional',
        details: 'Brochures, banners, giveaways',
        amount: quoteData.costs.marketingCost || 0
      },
      {
        description: 'Logistics & Support',
        details: 'Setup, coordination, project management',
        amount: quoteData.costs.logisticsCost || quoteData.costs.servicesCost || 0
      }
    ];

    costItems.forEach((item, index) => {
      const bgColor = index % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
      
      this.doc.rect(this.margin, this.currentY, this.contentWidth, 25)
             .fill(bgColor);

      this.doc.fontSize(11)
             .font('Helvetica-Bold')
             .fillColor(this.textDark)
             .text(item.description, this.margin + 20, this.currentY + 8);

      this.doc.fontSize(10)
             .font('Helvetica')
             .fillColor(this.textGray)
             .text(item.details, this.margin + 250, this.currentY + 8);

      this.doc.fontSize(11)
             .font('Helvetica-Bold')
             .fillColor(this.primaryGreen)
             .text(this.formatCurrency(item.amount, quoteData.formData.currency), this.margin + 400, this.currentY + 8);

      this.currentY += 25;
    });

    // Total row
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 35)
           .fill(this.accentColor);

    this.doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('white')
           .text('TOTAL INVESTMENT', this.margin + 20, this.currentY + 12)
           .text(this.formatCurrency(quoteData.costs.total, quoteData.formData.currency), this.margin + 400, this.currentY + 12);

    this.currentY += 55;
  }

  private addServiceDetails(quoteData: QuoteData) {
    // Travel details if available
    if (quoteData.selectedFlights?.outbound || quoteData.selectedHotel) {
      this.doc.fontSize(16)
             .font('Helvetica-Bold')
             .fillColor(this.primaryGreen)
             .text('Selected Services', this.margin, this.currentY);

      this.currentY += 25;

      if (quoteData.selectedFlights?.outbound) {
        this.doc.fontSize(12)
               .font('Helvetica-Bold')
               .fillColor(this.textDark)
               .text('✈️ Flight Details:', this.margin, this.currentY);

        this.currentY += 20;

        this.doc.fontSize(10)
               .font('Helvetica')
               .fillColor(this.textGray)
               .text(`Outbound: ${quoteData.selectedFlights.outbound.airline} ${quoteData.selectedFlights.outbound.flightNumber}`, this.margin + 20, this.currentY)
               .text(`Departure: ${quoteData.selectedFlights.outbound.departure} - Arrival: ${quoteData.selectedFlights.outbound.arrival}`, this.margin + 20, this.currentY + 15);

        this.currentY += 40;
      }

      if (quoteData.selectedHotel) {
        this.doc.fontSize(12)
               .font('Helvetica-Bold')
               .fillColor(this.textDark)
               .text('🏨 Accommodation:', this.margin, this.currentY);

        this.currentY += 20;

        this.doc.fontSize(10)
               .font('Helvetica')
               .fillColor(this.textGray)
               .text(`Hotel: ${quoteData.selectedHotel.name}`, this.margin + 20, this.currentY)
               .text(`Rate: ${this.formatCurrency(quoteData.selectedHotel.pricePerNight)} per night`, this.margin + 20, this.currentY + 15);

        this.currentY += 40;
      }
    }

    // Vendor details
    if (quoteData.selectedVendors && quoteData.selectedVendors.length > 0) {
      this.doc.fontSize(12)
             .font('Helvetica-Bold')
             .fillColor(this.textDark)
             .text('🤝 Recommended Partners:', this.margin, this.currentY);

      this.currentY += 20;

      quoteData.selectedVendors.slice(0, 3).forEach((vendor: any, index: number) => {
        this.doc.fontSize(10)
               .font('Helvetica')
               .fillColor(this.textGray)
               .text(`• ${vendor.name || vendor} - Verified Partner`, this.margin + 20, this.currentY);
        this.currentY += 15;
      });

      this.currentY += 10;
    }
  }

  private addTermsAndFooter() {
    // Terms section
    this.doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor(this.primaryGreen)
           .text('Terms & Conditions', this.margin, this.currentY);

    this.currentY += 25;

    const terms = [
      '• Quote validity: 30 days from generation date',
      '• Prices are subject to venue availability and market conditions',
      '• 50% advance payment required to confirm booking',
      '• Final pricing may vary based on specific requirements',
      '• Cancellation terms as per individual vendor policies',
      '• All prices include applicable taxes and fees'
    ];

    this.doc.fontSize(10)
           .font('Helvetica')
           .fillColor(this.textGray);

    terms.forEach(term => {
      this.doc.text(term, this.margin, this.currentY);
      this.currentY += 15;
    });

    // Footer
    this.currentY = this.pageHeight - 80;
    
    this.doc.rect(0, this.currentY, this.pageWidth, 80)
           .fill(this.primaryGreen);

    this.doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('white')
           .text('Thank you for choosing EaseMyExpo!', this.margin, this.currentY + 20);

    this.doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#E8F5E8')
           .text('We look forward to making your exhibition a tremendous success.', this.margin, this.currentY + 40)
           .text('For any queries: hello@easemyexpo.in | +91 9321522751', this.margin, this.currentY + 55);
  }

  async generateQuotePDF(quoteData: QuoteData): Promise<Buffer> {
    try {
      // Add all sections
      this.addProfessionalHeader();
      this.addQuoteHeader(quoteData);
      this.addExecutiveSummary(quoteData);
      this.addDetailedBreakdown(quoteData);
      this.addServiceDetails(quoteData);
      this.addTermsAndFooter();

      // Finalize the PDF
      this.doc.end();

      // Return the PDF as a buffer
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        this.doc.on('data', chunk => chunks.push(chunk));
        this.doc.on('end', () => resolve(Buffer.concat(chunks)));
        this.doc.on('error', reject);
      });
    } catch (error) {
      console.error('Error generating professional PDF:', error);
      throw error;
    }
  }
}

// Maintain backward compatibility
export const LetterheadPDFGenerator = ProfessionalPDFGenerator;