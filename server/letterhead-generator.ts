import PDFDocument from 'pdfkit';

export class LetterheadGenerator {
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
        Title: 'EaseMyExpo Document',
        Author: 'EaseMyExpo',
        Creator: 'EaseMyExpo Platform'
      }
    });
  }

  private addBrandedHeader() {
    // Header background
    this.doc.rect(0, 0, this.pageWidth, 70).fill('#10B981');
    
    // EaseMyExpo logo and brand
    this.doc.fontSize(24).font('Helvetica-Bold').fillColor('white');
    this.doc.text('EaseMyExpo', this.margin, 15);
    
    // Stylized 'e' logo
    this.doc.circle(this.margin + 120, 25, 12).fill('white');
    this.doc.fontSize(16).font('Helvetica-Bold').fillColor('#10B981');
    this.doc.text('e', this.margin + 116, 19);
    
    // Tagline
    this.doc.fontSize(10).font('Helvetica').fillColor('#E6F7F1');
    this.doc.text('Professional Exhibition Solutions', this.margin, 45);
    
    // Contact info
    this.doc.fontSize(9).font('Helvetica').fillColor('white');
    const contactX = this.pageWidth - 180;
    this.doc.text('📧 hello@easemyexpo.in', contactX, 15);
    this.doc.text('📞 +91 9321522751', contactX, 30);
    this.doc.text('🌐 www.easemyexpo.in', contactX, 45);

    this.currentY = 85;
  }

  private addBrandedFooter() {
    const footerY = this.pageHeight - 50;
    this.doc.rect(0, footerY, this.pageWidth, 50).fill('#10B981');
    
    this.doc.fontSize(11).font('Helvetica-Bold').fillColor('white');
    this.doc.text('EaseMyExpo - Your Exhibition Partner', this.margin, footerY + 12);
    
    this.doc.fontSize(9).font('Helvetica').fillColor('#E6F7F1');
    this.doc.text('Transforming exhibitions with professional solutions', this.margin, footerY + 30);
    this.doc.text('Contact: hello@easemyexpo.in | +91 9321522751', this.pageWidth - 220, footerY + 30);
  }

  async generateTipsAndTricksPDF(): Promise<Buffer> {
    this.addBrandedHeader();

    // Title
    this.doc.fontSize(20).font('Helvetica-Bold').fillColor('#065F46');
    this.doc.text('Exhibition Tips & Tricks', this.margin, this.currentY);
    this.currentY += 30;

    // Subtitle
    this.doc.fontSize(12).font('Helvetica').fillColor('#6B7280');
    this.doc.text('Professional guidance from EaseMyExpo experts', this.margin, this.currentY);
    this.currentY += 30;

    // Tips content
    const tips = [
      {
        title: '1. Plan Your Budget Wisely',
        content: 'Allocate 40% for booth construction, 25% for travel, 20% for marketing, and 15% for contingencies.'
      },
      {
        title: '2. Book Early for Better Rates',
        content: 'Exhibition spaces and hotels offer early bird discounts. Book 3-6 months in advance.'
      },
      {
        title: '3. Design for Impact',
        content: 'Use bold visuals, clear messaging, and interactive elements to attract visitors.'
      },
      {
        title: '4. Prepare Your Team',
        content: 'Train your staff on product knowledge, lead qualification, and booth etiquette.'
      },
      {
        title: '5. Follow Up Quickly',
        content: 'Contact leads within 24-48 hours while the exhibition is still fresh in their minds.'
      },
      {
        title: '6. Measure Your ROI',
        content: 'Track leads, sales, and brand exposure to measure exhibition success.'
      }
    ];

    tips.forEach(tip => {
      this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text(tip.title, this.margin, this.currentY);
      this.currentY += 20;

      this.doc.fontSize(11).font('Helvetica').fillColor('#374151');
      this.doc.text(tip.content, this.margin + 10, this.currentY, {
        width: this.contentWidth - 10,
        align: 'left'
      });
      this.currentY += 35;
    });

    // Pro tip box
    this.doc.rect(this.margin, this.currentY, this.contentWidth, 60).fill('#F0FDF4');
    this.doc.fontSize(12).font('Helvetica-Bold').fillColor('#065F46');
    this.doc.text('💡 Pro Tip from EaseMyExpo', this.margin + 15, this.currentY + 15);
    
    this.doc.fontSize(10).font('Helvetica').fillColor('#374151');
    this.doc.text('Use our platform to get instant quotes, compare vendors, and book everything in one place. Save time and money with our expert recommendations!', this.margin + 15, this.currentY + 35, {
      width: this.contentWidth - 30
    });

    this.addBrandedFooter();
    this.doc.end();

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', (chunk: any) => chunks.push(chunk));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.on('error', reject);
    });
  }

  async generateExhibitionGuidePDF(): Promise<Buffer> {
    this.addBrandedHeader();

    // Title
    this.doc.fontSize(20).font('Helvetica-Bold').fillColor('#065F46');
    this.doc.text('Exhibition Planning Guide', this.margin, this.currentY);
    this.currentY += 30;

    // Content sections
    const sections = [
      {
        title: 'Pre-Exhibition Planning (3-6 months)',
        items: ['Set objectives and budget', 'Book exhibition space', 'Design booth layout', 'Plan marketing materials']
      },
      {
        title: 'Final Preparations (1 month)',
        items: ['Confirm logistics', 'Brief your team', 'Prepare lead capture', 'Schedule meetings']
      },
      {
        title: 'During the Exhibition',
        items: ['Engage actively with visitors', 'Collect quality leads', 'Network with industry peers', 'Monitor competition']
      },
      {
        title: 'Post-Exhibition',
        items: ['Follow up with leads', 'Analyze ROI', 'Send thank you notes', 'Plan next exhibition']
      }
    ];

    sections.forEach(section => {
      this.doc.fontSize(14).font('Helvetica-Bold').fillColor('#10B981');
      this.doc.text(section.title, this.margin, this.currentY);
      this.currentY += 20;

      section.items.forEach(item => {
        this.doc.fontSize(11).font('Helvetica').fillColor('#374151');
        this.doc.text(`• ${item}`, this.margin + 15, this.currentY);
        this.currentY += 15;
      });
      this.currentY += 10;
    });

    this.addBrandedFooter();
    this.doc.end();

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', (chunk: any) => chunks.push(chunk));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.on('error', reject);
    });
  }
}