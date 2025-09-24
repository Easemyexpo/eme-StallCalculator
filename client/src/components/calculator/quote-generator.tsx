import React, { useState } from 'react';
import { Download, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CostBreakdown } from '@shared/schema';
import jsPDF from 'jspdf';

interface QuoteGeneratorProps {
  costs: any;
  formData: any;
  selectedFlights: any;
  selectedHotel: any;
  selectedVendors?: string[];
  stallDesignData?: any;
}

export function QuoteGenerator({ costs, formData, selectedFlights, selectedHotel, selectedVendors, stallDesignData }: QuoteGeneratorProps) {
  const [showCompletion, setShowCompletion] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  
  const generatePDF = () => {
    const currentDate = new Date().toLocaleDateString('en-IN');
    const invoiceNumber = `EME/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Calculate flight costs
    const flightCostPerPerson = (selectedFlights?.outbound?.price || 0) + (selectedFlights?.return?.price || 0);
    const totalFlightCost = flightCostPerPerson * formData.teamSize;
    
    // Calculate hotel costs
    const nights = formData.arrivalDate && formData.departureDate ? 
      Math.ceil((new Date(formData.departureDate).getTime() - new Date(formData.arrivalDate).getTime()) / (1000 * 60 * 60 * 24)) : 1;
    const rooms = Math.ceil(formData.teamSize / 2);
    const totalHotelCost = selectedHotel ? selectedHotel.price * nights * rooms : 0;
    
    // Create PDF using jsPDF
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EASEMYEXPO', 105, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Redefining the future of exhibitions', 105, 30, { align: 'center' });
    
    // Contact details
    pdf.setFontSize(10);
    pdf.text('+91 9321522751', 20, 50);
    pdf.text('hello@easemyexpo.in', 150, 50);
    pdf.text('#101, Dasarahalli Main Rd, near Anjaneya Temple, Maruthi Layout, Karnataka 560024', 105, 60, { align: 'center' });
    
    // Invoice header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROFORMA INVOICE', 105, 80, { align: 'center' });
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${currentDate}`, 150, 90);
    pdf.text(`Invoice Number: ${invoiceNumber}`, 150, 100);
    
    // Client details
    pdf.text('Client Details', 20, 110);
    pdf.text('Exhibition Cost Estimate', 20, 120);
    pdf.text(`${formData.destinationCity}, ${formData.destinationState}`, 20, 130);
    pdf.text('India', 20, 140);
    
    // Table header
    let yPos = 160;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', 20, yPos);
    pdf.text('Quantity', 120, yPos);
    pdf.text('Amount (₹)', 160, yPos);
    
    // Table content
    pdf.setFont('helvetica', 'normal');
    yPos += 15;
    
    // Booth details
    pdf.text(`${formData.eventType.charAt(0).toUpperCase() + formData.eventType.slice(1)} Exhibition Booth`, 20, yPos);
    pdf.text('1', 120, yPos);
    pdf.text(costs.boothCost.toLocaleString(), 160, yPos);
    yPos += 10;
    pdf.text(`${formData.customSize || formData.boothSize} sqm ${formData.boothType} booth`, 20, yPos);
    
    yPos += 15;
    pdf.text('Booth Construction & Setup', 20, yPos);
    pdf.text('1', 120, yPos);
    pdf.text(costs.constructionCost.toLocaleString(), 160, yPos);
    
    yPos += 15;
    pdf.text(`Team Travel & Accommodation (${formData.teamSize} members)`, 20, yPos);
    pdf.text('1', 120, yPos);
    pdf.text((totalFlightCost + totalHotelCost).toLocaleString(), 160, yPos);
    
    if (selectedHotel) {
      yPos += 10;
      pdf.text(`Hotel: ${selectedHotel.name} (${nights} nights, ${rooms} rooms)`, 20, yPos);
    }
    
    yPos += 15;
    pdf.text('Marketing & Promotional Materials', 20, yPos);
    pdf.text('1', 120, yPos);
    pdf.text(costs.marketingCost.toLocaleString(), 160, yPos);
    
    yPos += 15;
    pdf.text('Additional Services', 20, yPos);
    pdf.text('1', 120, yPos);
    pdf.text(costs.servicesCost.toLocaleString(), 160, yPos);
    
    // Totals
    yPos += 25;
    pdf.text(`Subtotal: ₹${costs.total.toLocaleString()}`, 120, yPos);
    yPos += 10;
    pdf.text(`IGST@18%: ₹${Math.round(costs.total * 0.18).toLocaleString()}`, 120, yPos);
    yPos += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total: ₹${Math.round(costs.total * 1.18).toLocaleString()}`, 120, yPos);
    
    // Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Thank you for your business! We look forward to making your exhibition a success.', 105, 250, { align: 'center' });
    pdf.text('For queries: hello@easemyexpo.in | +91 9321522751', 105, 260, { align: 'center' });
    
    // Save PDF
    pdf.save(`EaseMyExpo_Quote_${invoiceNumber.replace(/\//g, '_')}.pdf`);
    setShowCompletion(true);
  };

  return (
    <div className="w-full">
      {!showCompletion ? (
        <Button 
          onClick={generatePDF}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all shadow-sm"
          data-testid="button-download-quote"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Quote
        </Button>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm font-medium">Downloaded!</span>
          </div>
        </div>
      )}
    </div>
  );
}