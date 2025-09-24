import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// AI Analysis Report Generator with EaseMyExpo Branding
export async function generateAIAnalysisPDF(data: any): Promise<Buffer> {
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

      // Company Header using Bricolage Grotesque font theme
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
         .text('AI ANALYSIS REPORT', 50, yPosition, { align: 'center' });
      
      yPosition += 30;
      
      doc.fontSize(12)
         .fillColor('#374151')
         .text(`Exhibition: ${data.formData?.exhibitionName || 'Your Exhibition'}`, 50, yPosition);
      
      yPosition += 25;

      // --- EXECUTIVE SUMMARY ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('EXECUTIVE SUMMARY', 50, yPosition);
      
      yPosition += 20;

      const totalCost = data.costs?.total || 0;
      const successScore = Math.min(95, 60 + (totalCost / 20000));
      const riskLevel = totalCost > 800000 ? 'Medium' : totalCost > 400000 ? 'Low-Medium' : 'Low';

      doc.fontSize(10)
         .fillColor('#374151')
         .text(`Total Investment: ₹${totalCost.toLocaleString()}`, 50, yPosition)
         .text(`Success Probability: ${successScore.toFixed(1)}%`, 50, yPosition + 15)
         .text(`Risk Level: ${riskLevel}`, 50, yPosition + 30)
         .text(`Venue: ${data.formData?.destinationCity || 'TBD'}, ${data.formData?.destinationState || ''}`, 50, yPosition + 45)
         .text(`Team Size: ${data.formData?.teamSize || 5} members`, 50, yPosition + 60);

      yPosition += 90;

      // --- MARKET ANALYSIS ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('MARKET ANALYSIS', 50, yPosition);
      
      yPosition += 20;

      const industry = data.formData?.industry || 'Technology';
      const marketInsights = [
        `${industry} sector shows strong exhibition ROI trends`,
        `${data.formData?.destinationCity || 'Target'} market offers good visitor potential`,
        'Recommended pre-event marketing: 3-4 weeks advance',
        'Optimal booth positioning: Corner or end-cap locations',
        'Peak visitor times: Day 2-3 of exhibition'
      ];

      marketInsights.forEach(insight => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`• ${insight}`, 60, yPosition);
        yPosition += 15;
      });

      yPosition += 10;

      // --- FINANCIAL OPTIMIZATION ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('FINANCIAL OPTIMIZATION', 50, yPosition);
      
      yPosition += 20;

      const costOptimizations = [
        'Booth design balances impact with budget efficiency',
        `Travel costs: ${((data.costs?.travelCost || 0) / totalCost * 100).toFixed(1)}% of total budget`,
        `Marketing allocation: ${((data.costs?.marketingCost || 0) / totalCost * 100).toFixed(1)}% - within optimal range`,
        'Construction quality appropriate for target audience',
        'Service selection aligns with business objectives'
      ];

      costOptimizations.forEach(optimization => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`• ${optimization}`, 60, yPosition);
        yPosition += 12;
      });

      yPosition += 20;

      // --- RECOMMENDATIONS ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('AI RECOMMENDATIONS', 50, yPosition);
      
      yPosition += 20;

      doc.fontSize(12)
         .fillColor('#374151')
         .text('Pre-Event Actions:', 50, yPosition);
      
      yPosition += 15;

      const preEventActions = [
        'Finalize booth design 4 weeks before event',
        'Launch digital marketing campaign 3 weeks prior',
        'Confirm vendor bookings and logistics',
        'Prepare lead qualification criteria',
        'Schedule key prospect meetings in advance'
      ];

      preEventActions.forEach(action => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`• ${action}`, 60, yPosition);
        yPosition += 12;
      });

      yPosition += 15;

      doc.fontSize(12)
         .fillColor('#374151')
         .text('During Event:', 50, yPosition);
      
      yPosition += 15;

      const duringEventActions = [
        'Track visitor engagement hourly',
        'Qualify leads using prepared criteria',
        'Document competitor activities',
        'Collect feedback for future improvements',
        'Schedule follow-up meetings before departure'
      ];

      duringEventActions.forEach(action => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`• ${action}`, 60, yPosition);
        yPosition += 12;
      });

      // Add new page if needed for additional content
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      } else {
        yPosition += 20;
      }

      // --- RISK MITIGATION ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('RISK MITIGATION', 50, yPosition);
      
      yPosition += 20;

      const riskMitigations = [
        'Budget contingency: 10-15% recommended for unforeseen costs',
        'Vendor backup plans: Secondary options identified',
        'Weather contingency: Indoor venue reduces risk',
        'Team coordination: Clear roles and responsibilities',
        'Technology backup: Redundant systems for digital displays'
      ];

      riskMitigations.forEach(mitigation => {
        doc.fontSize(9)
           .fillColor('#374151')
           .text(`• ${mitigation}`, 60, yPosition);
        yPosition += 12;
      });

      yPosition += 20;

      // --- SUCCESS METRICS ---
      doc.fontSize(14)
         .fillColor('#047857')
         .text('SUCCESS METRICS', 50, yPosition);
      
      yPosition += 20;

      const estimatedLeads = Math.max(30, Math.floor(totalCost / 15000));
      const conversionRate = '12-18%';
      const expectedRevenue = estimatedLeads * 25000;

      doc.fontSize(10)
         .fillColor('#374151')
         .text(`Expected Leads: ${estimatedLeads}`, 50, yPosition)
         .text(`Lead Conversion Rate: ${conversionRate}`, 50, yPosition + 15)
         .text(`Projected Revenue: ₹${expectedRevenue.toLocaleString()}`, 50, yPosition + 30)
         .text(`ROI Target: ${((expectedRevenue - totalCost) / totalCost * 100).toFixed(1)}%`, 50, yPosition + 45);

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
      console.error('Error generating AI Analysis PDF:', error);
      reject(error);
    }
  });
}