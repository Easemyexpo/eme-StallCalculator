import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Enhanced ROI Planning Guide Generator with EaseMyExpo Branding
export async function generateROIGuidePDF(data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks: Buffer[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // --- HEADER WITH EASEMYEXPO BRANDING ---
      const logoPath = path.join(process.cwd(), 'attached_assets', 'Black Transparent_1755449417107.jpg');
      
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 50, 30, { width: 100, height: 40 });
        } catch (err) {
          console.log('Logo loading failed, continuing without logo');
        }
      }

      // Company Header
      doc.fontSize(24)
         .fillColor('#10B981')
         .text('EASEMYEXPO', 170, 35, { align: 'left' });
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text('Redefining the future of exhibitions', 170, 58);

      // Contact Information
      doc.fontSize(8)
         .fillColor('#888888')
         .text('+91 9321522751 | hello@easemyexpo.in', 400, 35, { align: 'right' })
         .text('#101, Dasarahalli Main Rd, near Anjaneya Temple', 400, 45, { align: 'right' })
         .text('Maruthi Layout, Karnataka 560024', 400, 55, { align: 'right' });

      // Header Separator
      doc.strokeColor('#E5E7EB')
         .lineWidth(1)
         .moveTo(50, 85)
         .lineTo(545, 85)
         .stroke();

      let yPosition = 110;

      // --- DOCUMENT TITLE ---
      doc.fontSize(18)
         .fillColor('#047857')
         .text('ROI PLANNING GUIDE', 50, yPosition, { align: 'center' });
      
      yPosition += 30;
      
      doc.fontSize(12)
         .fillColor('#374151')
         .text(`Exhibition: ${data.formData?.exhibitionName || 'Your Exhibition'}`, 50, yPosition);
      
      yPosition += 25;

      // --- INVESTMENT OVERVIEW SECTION ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('INVESTMENT OVERVIEW', 50, yPosition);
      
      yPosition += 20;

      const totalCost = data.costs?.total || 0;
      const estimatedLeads = Math.max(50, Math.floor(totalCost / 10000));
      const leadValue = Math.max(5000, totalCost / estimatedLeads * 2);
      const estimatedRevenue = estimatedLeads * leadValue;
      const roiPercentage = ((estimatedRevenue - totalCost) / totalCost) * 100;

      doc.fontSize(10)
         .fillColor('#374151')
         .text(`Total Exhibition Investment: ₹${totalCost.toLocaleString()}`, 50, yPosition)
         .text(`Expected ROI: ${roiPercentage.toFixed(1)}%`, 50, yPosition + 15)
         .text(`Estimated Revenue Target: ₹${estimatedRevenue.toLocaleString()}`, 50, yPosition + 30)
         .text(`Expected Leads: ${estimatedLeads}`, 50, yPosition + 45)
         .text(`Lead Value: ₹${leadValue.toLocaleString()}`, 50, yPosition + 60);

      yPosition += 90;

      // --- LEAD GENERATION TARGETS ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('LEAD GENERATION TARGETS', 50, yPosition);
      
      yPosition += 20;

      const eventDuration = data.formData?.eventDuration || 3;
      const dailyLeadTarget = Math.ceil(estimatedLeads / eventDuration);
      const costPerLead = totalCost / estimatedLeads;

      doc.fontSize(10)
         .fillColor('#374151')
         .text(`Daily Lead Target: ${dailyLeadTarget} leads/day`, 50, yPosition)
         .text(`Cost per Lead: ₹${costPerLead.toFixed(0)}`, 50, yPosition + 15)
         .text(`Booth Size: ${data.formData?.boothSize || data.stallDesignData?.area || 0} sqm`, 50, yPosition + 30)
         .text(`Team Size: ${data.formData?.teamSize || 4} members`, 50, yPosition + 45);

      yPosition += 75;

      // --- PRE-EVENT PLANNING CHECKLIST ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('PRE-EVENT PLANNING CHECKLIST', 50, yPosition);
      
      yPosition += 20;

      const checklistItems = [
        'Define specific lead quality criteria',
        `Set daily lead generation targets (${dailyLeadTarget} leads/day)`,
        'Create lead capture and qualification process',
        'Prepare follow-up email templates',
        'Design lead magnet materials',
        'Train team on qualification questions',
        'Set up CRM integration',
        'Plan booth traffic flow for maximum engagement'
      ];

      checklistItems.forEach(item => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`☐ ${item}`, 60, yPosition);
        yPosition += 15;
      });

      yPosition += 10;

      // --- SUCCESS METRICS & KPIS ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('SUCCESS METRICS & KPIS', 50, yPosition);
      
      yPosition += 20;

      doc.fontSize(12)
         .fillColor('#374151')
         .text('Primary Metrics:', 50, yPosition);
      
      yPosition += 15;

      const primaryMetrics = [
        'Total qualified leads generated',
        `Cost per lead: ₹${costPerLead.toFixed(0)}`,
        'Lead-to-customer conversion rate (target: 10-15%)',
        'Average deal size from exhibition leads',
        'Time to close exhibition leads'
      ];

      primaryMetrics.forEach(metric => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`• ${metric}`, 60, yPosition);
        yPosition += 12;
      });

      yPosition += 10;

      doc.fontSize(12)
         .fillColor('#374151')
         .text('Secondary Metrics:', 50, yPosition);
      
      yPosition += 15;

      const secondaryMetrics = [
        'Brand awareness increase',
        'Competitor intelligence gathered',
        'Partnership opportunities identified',
        'Media coverage and social engagement',
        'Team learning and skill development'
      ];

      secondaryMetrics.forEach(metric => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`• ${metric}`, 60, yPosition);
        yPosition += 12;
      });

      // Add new page if needed
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      } else {
        yPosition += 20;
      }

      // --- LEAD TRACKING TEMPLATE ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('LEAD TRACKING TEMPLATE', 50, yPosition);
      
      yPosition += 20;

      doc.fontSize(10)
         .fillColor('#374151')
         .text('Create spreadsheet with columns:', 50, yPosition);
      
      yPosition += 15;

      const trackingColumns = [
        'Lead Name & Company',
        'Contact Information',
        'Qualification Score (1-10)',
        'Product Interest Level',
        'Budget Range',
        'Decision Timeline',
        'Follow-up Actions',
        'Conversion Status'
      ];

      trackingColumns.forEach(column => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`- ${column}`, 60, yPosition);
        yPosition += 12;
      });

      yPosition += 20;

      // --- POST-EVENT EVALUATION ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('POST-EVENT EVALUATION', 50, yPosition);
      
      yPosition += 20;

      const evaluationPoints = [
        'Total leads generated vs target',
        'Lead quality assessment',
        'Conversion rate tracking',
        'Revenue attribution',
        'ROI calculation',
        'Team performance review',
        'Vendor feedback collection',
        'Lessons learned documentation'
      ];

      evaluationPoints.forEach(point => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`• ${point}`, 60, yPosition);
        yPosition += 12;
      });

      // --- FOOTER ---
      doc.fontSize(8)
         .fillColor('#10B981')
         .text('═══════════════════════════════════════════════════════════════════', 50, 750);
      
      doc.fontSize(8)
         .fillColor('#666666')
         .text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 765)
         .text('For queries: easemyexpo1@gmail.com | +91 9321522751', 50, 775);

      doc.end();
    } catch (error) {
      console.error('Error generating ROI Guide PDF:', error);
      reject(error);
    }
  });
}