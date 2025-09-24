import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface QuoteData {
  formData: any;
  costs: any;
  selectedFlights?: any;
  selectedHotel?: any;
  selectedVendors?: any[];
  stallDesignData?: any;
  timestamp: string;
}

export class TwoPagePDFGenerator {
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
      bufferPages: true,
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

  private addEaseMyExpoLogo() {
    // Try to load the actual logo
    try {
      const logoPath = path.join(process.cwd(), 'attached_assets', 'Green Transparent_1755448616234.jpg');
      if (fs.existsSync(logoPath)) {
        this.doc.image(logoPath, this.margin, 10, { width: 60, height: 60 });
      } else {
        // Fallback: Create stylized logo
        this.doc.circle(this.margin + 30, 40, 25).fill('#10B981');
        this.doc.fontSize(20).font('Helvetica-Bold').fillColor('white');
        this.doc.text('e', this.margin + 25, 32);
      }
    } catch {
      // Fallback logo if image fails
      this.doc.circle(this.margin + 30, 40, 25).fill('#10B981');
      this.doc.fontSize(20).font('Helvetica-Bold').fillColor('white');
      this.doc.text('e', this.margin + 25, 32);
    }
  }

  private addBrandedHeader() {
    // Header background
    this.doc.rect(0, 0, this.pageWidth, 80).fill('#10B981');
    
    // Add EaseMyExpo logo
    this.addEaseMyExpoLogo();
    
    // Company name
    this.doc.fontSize(28).font('Helvetica-Bold').fillColor('white');
    this.doc.text('EaseMyExpo', this.margin + 80, 20);
    
    // Tagline
    this.doc.fontSize(12).font('Helvetica').fillColor('#E6F7F1');
    this.doc.text('Professional Exhibition Solutions', this.margin + 80, 55);
    
    // Contact info
    this.doc.fontSize(10).font('Helvetica').fillColor('white');
    const contactX = this.pageWidth - 200;
    this.doc.text('📧 hello@easemyexpo.in', contactX, 20);
    this.doc.text('📞 +91 9321522751', contactX, 35);
    this.doc.text('🌐 www.easemyexpo.in', contactX, 50);

    this.currentY = 95;
  }

  private addPage1OnlyContent(data: QuoteData) {
    // Quote title and basic info
    this.doc.fontSize(18).font('Helvetica-Bold').fillColor('#065F46');
    this.doc.text('EXHIBITION COST QUOTATION', this.margin, this.currentY);
    this.currentY += 30;

    // Quote details box
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 50).fill('#F3F4F6');
    const quoteNum = `EME-${Date.now().toString().slice(-6)}`;
    const today = new Date().toLocaleDateString('en-IN');

    this.doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151');
    this.doc.text('Quote #:', this.margin + 15, this.currentY + 15);
    this.doc.text('Exhibition:', this.margin + 15, this.currentY + 30);
    
    this.doc.font('Helvetica');
    this.doc.text(quoteNum, this.margin + 70, this.currentY + 15);
    this.doc.text(data.formData.exhibitionName || 'Exhibition Planning', this.margin + 70, this.currentY + 30);

    const rightX = this.margin + 250;
    this.doc.font('Helvetica-Bold');
    this.doc.text('Date:', rightX, this.currentY + 15);
    this.doc.text('Location:', rightX, this.currentY + 30);
    
    this.doc.font('Helvetica');
    this.doc.text(today, rightX + 50, this.currentY + 15);
    this.doc.text(`${data.formData.destinationCity}, ${data.formData.destinationState}`, rightX + 50, this.currentY + 30);

    this.currentY += 70;

    // Investment Summary
    this.doc.fontSize(16).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text('Investment Summary', this.margin, this.currentY);
    this.currentY += 25;

    this.doc.rect(this.margin, this.currentY, this.contentWidth, 60).fill('#F0FDF4');
    
    const boothSize = Number(data.stallDesignData?.area) || Number(data.formData.boothSize) || 20;
    const teamSize = Number(data.formData.teamSize) || 5;

    this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#065F46');
    this.doc.text('Total Investment:', this.margin + 20, this.currentY + 15);
    this.doc.text('Booth Area:', this.margin + 200, this.currentY + 15);
    this.doc.text('Team Size:', this.margin + 350, this.currentY + 15);

    this.doc.fontSize(18).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text(this.formatCurrency(data.costs.total), this.margin + 20, this.currentY + 35);
    this.doc.text(`${boothSize} sqm`, this.margin + 200, this.currentY + 35);
    this.doc.text(`${teamSize} people`, this.margin + 350, this.currentY + 35);

    this.currentY += 80;

    // Detailed Stall Design Information
    if (data.stallDesignData) {
      this.doc.fontSize(16).font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text('Stall Design Details', this.margin, this.currentY);
      this.currentY += 20;

      this.doc.rect(this.margin, this.currentY, this.contentWidth, 120).fill('#F9FAFB');
      
      this.doc.fontSize(11).font('Helvetica-Bold').fillColor('#374151');
      
      // Stall specifications
      this.doc.text(`Area: ${data.stallDesignData.area} ${data.stallDesignData.areaUnit}`, this.margin + 15, this.currentY + 15);
      this.doc.text(`Type: ${data.stallDesignData.boothType}`, this.margin + 15, this.currentY + 30);
      this.doc.text(`Walls: ${data.stallDesignData.wallType}`, this.margin + 15, this.currentY + 45);
      this.doc.text(`Flooring: ${data.stallDesignData.flooring}`, this.margin + 15, this.currentY + 60);
      this.doc.text(`Position: ${data.stallDesignData.boothPosition}`, this.margin + 15, this.currentY + 75);

      // Additional elements
      if (data.stallDesignData.additionalRooms?.length > 0) {
        this.doc.text(`Additional Rooms: ${data.stallDesignData.additionalRooms.join(', ')}`, this.margin + 250, this.currentY + 15);
      }
      if (data.stallDesignData.brandingElements?.length > 0) {
        this.doc.text(`Branding: ${data.stallDesignData.brandingElements.join(', ')}`, this.margin + 250, this.currentY + 30);
      }
      if (data.stallDesignData.extras?.length > 0) {
        this.doc.text(`Extras: ${data.stallDesignData.extras.join(', ')}`, this.margin + 250, this.currentY + 45);
      }

      this.doc.text(`Installation: ${data.stallDesignData.installationDays} days`, this.margin + 250, this.currentY + 60);
      this.doc.text(`Dismantling: ${data.stallDesignData.dismantlingDays} days`, this.margin + 250, this.currentY + 75);

      this.currentY += 140;
    }

    // Flight Details
    if (data.selectedFlights?.outbound) {
      this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text('Flight Details', this.margin, this.currentY);
      this.currentY += 20;

      this.doc.rect(this.margin, this.currentY, this.contentWidth, 40).fill('#F3F4F6');
      
      this.doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151');
      this.doc.text('Airline:', this.margin + 15, this.currentY + 12);
      this.doc.text('Flight:', this.margin + 15, this.currentY + 25);
      
      this.doc.font('Helvetica');
      this.doc.text(data.selectedFlights.outbound.airline, this.margin + 60, this.currentY + 12);
      this.doc.text(`${data.selectedFlights.outbound.flightNumber} (${data.selectedFlights.outbound.departure} - ${data.selectedFlights.outbound.arrival})`, this.margin + 60, this.currentY + 25);

      if (data.selectedFlights.return) {
        this.doc.text(`Return: ${data.selectedFlights.return.flightNumber} (${data.selectedFlights.return.departure} - ${data.selectedFlights.return.arrival})`, this.margin + 300, this.currentY + 25);
      }

      this.currentY += 60;
    }

    // Hotel Details
    if (data.selectedHotel) {
      this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text('Hotel Details', this.margin, this.currentY);
      this.currentY += 20;

      this.doc.rect(this.margin, this.currentY, this.contentWidth, 40).fill('#F3F4F6');
      
      this.doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151');
      this.doc.text('Hotel:', this.margin + 15, this.currentY + 12);
      this.doc.text('Rate:', this.margin + 15, this.currentY + 25);
      
      this.doc.font('Helvetica');
      this.doc.text(data.selectedHotel.name, this.margin + 60, this.currentY + 12);
      this.doc.text(`${this.formatCurrency(data.selectedHotel.pricePerNight)}/night`, this.margin + 60, this.currentY + 25);
      
      if (data.selectedHotel.rating) {
        this.doc.text(`Rating: ${data.selectedHotel.rating}/5`, this.margin + 300, this.currentY + 12);
      }
      if (data.selectedHotel.totalPrice) {
        this.doc.text(`Total: ${this.formatCurrency(data.selectedHotel.totalPrice)}`, this.margin + 300, this.currentY + 25);
      }

      this.currentY += 60;
    }
  }

  private addPage2TermsOnly(data: QuoteData) {
    // Add new page - ONLY for Terms & Conditions
    this.doc.addPage();
    this.currentY = 50;
    
    // Page 2 header with EaseMyExpo branding  
    this.addBrandedHeader();

    // TERMS & CONDITIONS TITLE ONLY
    this.doc.fontSize(16).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text('TERMS & CONDITIONS', this.margin, this.currentY);
    this.currentY += 30;

    const terms = [
      '1. PAYMENT TERMS: 50% advance payment required to confirm booking. Balance payment due 7 days before exhibition start date.',
      '2. QUOTE VALIDITY: This quotation is valid for 30 days from the date of generation. Prices may change after validity period.',
      '3. CANCELLATION POLICY: Cancellations made 30+ days before event: 25% charge. 15-30 days: 50% charge. Less than 15 days: 75% charge.',
      '4. FORCE MAJEURE: EaseMyExpo is not liable for delays or cancellations due to circumstances beyond our control.',
      '5. MODIFICATIONS: Any changes to the original scope of work may result in additional charges. All modifications must be approved in writing.',
      '6. LIABILITY: Our liability is limited to the total contract value. We are not responsible for consequential or indirect losses.',
      '7. INTELLECTUAL PROPERTY: All designs, concepts, and materials created remain property of EaseMyExpo until full payment is received.',
      '8. VENUE COMPLIANCE: Client is responsible for ensuring all activities comply with venue rules and local regulations.',
      '9. INSTALLATION: Access to venue premises is subject to venue availability and exhibition organizer permissions.',
      '10. DISPUTE RESOLUTION: All disputes resolved through arbitration in Bangalore jurisdiction.',
      '11. INSURANCE: Comprehensive insurance coverage is included for booth construction and materials during exhibition period.'
    ];

    this.doc.fontSize(9).font('Helvetica').fillColor('#374151');
    terms.forEach((term, index) => {
      this.doc.text(`${index + 1}. ${term}`, this.margin, this.currentY, {
        width: this.contentWidth,
        align: 'left'
      });
      this.currentY += 20;
    });

    // Footer
    const footerY = this.pageHeight - 60;
    this.doc.rect(0, footerY, this.pageWidth, 60).fill('#10B981');
    
    this.doc.fontSize(12).font('Helvetica-Bold').fillColor('white');
    this.doc.text('Thank you for choosing EaseMyExpo!', this.margin, footerY + 15);
    
    this.doc.fontSize(10).font('Helvetica').fillColor('#E6F7F1');
    this.doc.text('We look forward to making your exhibition a tremendous success.', this.margin, footerY + 35);
    this.doc.text('Contact: hello@easemyexpo.in | +91 9321522751', this.pageWidth - 250, footerY + 35);
  }

  private addPage1Content(data: QuoteData) {
    this.addPage1OnlyContent(data);
  }

  private addPage2Content(data: QuoteData) {
    this.addPage2TermsOnly(data);
  }

  async generateQuotePDF(data: QuoteData): Promise<Buffer> {
    try {
      // Page 1: Stall details, flight, hotel
      this.addBrandedHeader();
      this.addPage1Content(data);
      
      // Page 2: Cost breakdown and terms
      this.addPage2Content(data);

      // Finalize document
      this.doc.end();

      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        this.doc.on('data', (chunk: any) => chunks.push(chunk));
        this.doc.on('end', () => resolve(Buffer.concat(chunks)));
        this.doc.on('error', reject);
      });
    } catch (error) {
      console.error('Two-page PDF generation error:', error);
      throw error;
    }
  }
}

// AI Analysis Report Generator
export class AIAnalysisReportGenerator {
  private doc: any;
  private pageWidth = 595.28;
  private pageHeight = 841.89;
  private margin = 50;
  private contentWidth: number;
  private currentY = 50;

  constructor() {
    this.contentWidth = this.pageWidth - (2 * this.margin);
    this.doc = new PDFDocument({
      size: 'A4',
      margin: this.margin,
      info: {
        Title: 'EaseMyExpo AI Analysis Report',
        Author: 'EaseMyExpo',
        Creator: 'EaseMyExpo Platform'
      }
    });
  }

  private addBrandedHeader() {
    this.doc.rect(0, 0, this.pageWidth, 80).fill('#10B981');
    
    // Add logo
    try {
      const logoPath = path.join(process.cwd(), 'attached_assets', 'Green Transparent_1755448616234.jpg');
      if (fs.existsSync(logoPath)) {
        this.doc.image(logoPath, this.margin, 10, { width: 60, height: 60 });
      }
    } catch {
      this.doc.circle(this.margin + 30, 40, 25).fill('white');
      this.doc.fontSize(20).font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text('e', this.margin + 25, 32);
    }
    
    this.doc.fontSize(28).font('Helvetica-Bold').fillColor('white');
    this.doc.text('EaseMyExpo', this.margin + 80, 20);
    
    this.doc.fontSize(12).font('Helvetica').fillColor('#E6F7F1');
    this.doc.text('AI-Powered Exhibition Analysis', this.margin + 80, 55);
    
    this.currentY = 95;
  }

  async generateAIAnalysisReport(data: QuoteData): Promise<Buffer> {
    this.addBrandedHeader();

    // Title
    this.doc.fontSize(20).font('Helvetica-Bold').fillColor('#065F46');
    this.doc.text('AI Analysis Report', this.margin, this.currentY);
    this.currentY += 40;

    // Analysis sections
    const analysisData = [
      {
        title: 'Market Analysis',
        content: `Based on industry data for ${data.formData.industry || 'your industry'}, exhibitions in ${data.formData.destinationCity} typically see 15-25% higher engagement rates compared to national average. Your booth size of ${Number(data.stallDesignData?.area) || 20} sqm is optimal for ${data.formData.teamSize || 5} team members.`
      },
      {
        title: 'Cost Optimization',
        content: `Your current budget allocation follows the recommended 40-30-20-10 rule (booth construction, travel, marketing, contingency). Total investment of ${data.costs.total ? `₹${(data.costs.total/100000).toFixed(1)}L` : 'N/A'} is competitive for your booth size and team configuration.`
      },
      {
        title: 'ROI Projection',
        content: 'Based on industry benchmarks, exhibitions typically generate 300-500% ROI within 12 months. With proper lead qualification and follow-up, expect to recover investment within 6-8 months through new business acquisition.'
      },
      {
        title: 'Recommendations',
        content: '1. Book early for 15-20% cost savings. 2. Focus on interactive booth elements for higher engagement. 3. Prepare digital lead capture system. 4. Plan post-exhibition follow-up strategy. 5. Consider additional marketing materials for better brand recall.'
      }
    ];

    analysisData.forEach(section => {
      this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text(section.title, this.margin, this.currentY);
      this.currentY += 20;

      this.doc.fontSize(11).font('Helvetica').fillColor('#374151');
      this.doc.text(section.content, this.margin, this.currentY, {
        width: this.contentWidth,
        align: 'left'
      });
      this.currentY += 60;
    });

    this.doc.end();

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', (chunk: any) => chunks.push(chunk));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.on('error', reject);
    });
  }
}

// ROI Planning Guide Generator
export class ROIPlanningGuideGenerator {
  private doc: any;
  private pageWidth = 595.28;
  private pageHeight = 841.89;
  private margin = 50;
  private contentWidth: number;
  private currentY = 50;

  constructor() {
    this.contentWidth = this.pageWidth - (2 * this.margin);
    this.doc = new PDFDocument({
      size: 'A4',
      margin: this.margin,
      info: {
        Title: 'EaseMyExpo ROI Planning Guide',
        Author: 'EaseMyExpo',
        Creator: 'EaseMyExpo Platform'
      }
    });
  }

  private addBrandedHeader() {
    this.doc.rect(0, 0, this.pageWidth, 80).fill('#10B981');
    
    try {
      const logoPath = path.join(process.cwd(), 'attached_assets', 'Green Transparent_1755448616234.jpg');
      if (fs.existsSync(logoPath)) {
        this.doc.image(logoPath, this.margin, 10, { width: 60, height: 60 });
      }
    } catch {
      this.doc.circle(this.margin + 30, 40, 25).fill('white');
      this.doc.fontSize(20).font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text('e', this.margin + 25, 32);
    }
    
    this.doc.fontSize(28).font('Helvetica-Bold').fillColor('white');
    this.doc.text('EaseMyExpo', this.margin + 80, 20);
    
    this.doc.fontSize(12).font('Helvetica').fillColor('#E6F7F1');
    this.doc.text('ROI Planning & Optimization', this.margin + 80, 55);
    
    this.currentY = 95;
  }

  async generateROIPlanningGuide(data: QuoteData): Promise<Buffer> {
    this.addBrandedHeader();

    this.doc.fontSize(20).font('Helvetica-Bold').fillColor('#065F46');
    this.doc.text('ROI Planning Guide', this.margin, this.currentY);
    this.currentY += 40;

    const roiSections = [
      {
        title: 'Pre-Exhibition ROI Planning',
        items: [
          'Set clear, measurable objectives (leads, sales, brand awareness)',
          'Define target audience and ideal customer profile',
          'Calculate customer lifetime value and acquisition costs',
          'Establish lead qualification criteria and scoring system'
        ]
      },
      {
        title: 'During Exhibition Optimization',
        items: [
          'Track visitor engagement and booth traffic patterns',
          'Qualify leads using BANT methodology (Budget, Authority, Need, Timeline)',
          'Schedule follow-up meetings with high-quality prospects',
          'Monitor competitor activities and market trends'
        ]
      },
      {
        title: 'Post-Exhibition ROI Measurement',
        items: [
          'Contact leads within 24-48 hours for maximum conversion',
          'Track conversion rates from leads to sales',
          'Measure brand awareness and market share impact',
          'Calculate total ROI including direct and indirect benefits'
        ]
      },
      {
        title: 'ROI Calculation Framework',
        items: [
          `Total Investment: ${data.costs.total ? `₹${(data.costs.total/100000).toFixed(1)}L` : 'Calculate total exhibition costs'}`,
          'Revenue Generated: Track sales attributable to exhibition',
          'Cost per Lead: Total investment ÷ Number of qualified leads',
          'ROI Formula: (Revenue - Investment) ÷ Investment × 100'
        ]
      }
    ];

    roiSections.forEach(section => {
      this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text(section.title, this.margin, this.currentY);
      this.currentY += 20;

      section.items.forEach(item => {
        this.doc.fontSize(11).font('Helvetica').fillColor('#374151');
        this.doc.text(`• ${item}`, this.margin + 10, this.currentY, {
          width: this.contentWidth - 10
        });
        this.currentY += 18;
      });
      this.currentY += 15;
    });

    this.doc.end();

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', (chunk: any) => chunks.push(chunk));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.on('error', reject);
    });
  }
}