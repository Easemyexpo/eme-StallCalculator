import nodemailer from 'nodemailer';

interface UserFormData {
  currency: string;
  marketLevel: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  eventStartDate: string;
  eventEndDate: string;
  exhibitionStartDate: string;
  exhibitionEndDate: string;
  arrivalDate: string;
  departureDate: string;
  eventType: string;
  distance: number;
  venueType: string;
  boothSize: number;
  boothType: string;
  teamSize: number;
  accommodationLevel: string;
  exhibitionName?: string;
  industry?: string;
  // Company Information
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  // Add any other form fields as needed
}

interface CostData {
  total: number;
  boothCost: number;
  constructionCost: number;
  travelCost: number;
  staffCost: number;
  marketingCost: number;
  servicesCost: number;
  currency: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'easemyexpo1@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});

export async function sendUserFormNotification(
  formData: UserFormData,
  costs?: CostData,
  selectedFlights?: any,
  selectedHotel?: any
): Promise<boolean> {
  try {
    console.log('Email configuration check:');
    console.log('GMAIL_USER:', process.env.GMAIL_USER ? 'Set' : 'Not set');
    console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'Set' : 'Not set');
    console.log('NOTIFICATION_EMAIL:', process.env.NOTIFICATION_EMAIL ? 'Set' : 'Not set');
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Missing email configuration - Gmail credentials not set');
      console.error('Please add GMAIL_USER and GMAIL_APP_PASSWORD to your Secrets');
      return false;
    }
    
    // Use a default notification email if not set
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'easemyexpo1@gmail.com';

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎯 New Exhibition Quote Request</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">EaseMyExpo Cost Calculator</p>
        </div>

        <!-- Company Information -->
        <div style="background: white; padding: 30px; border-left: 4px solid #10b981;">
          <h2 style="color: #065f46; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🏢 Company Information</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <p><strong>Company Name:</strong> ${formData.companyName || 'Not specified'}</p>
              <p><strong>Contact Person:</strong> ${formData.contactPerson || 'Not specified'}</p>
            </div>
            <div>
              <p><strong>Email:</strong> ${formData.email || 'Not specified'}</p>
              <p><strong>Phone Number:</strong> ${formData.phoneNumber || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <!-- Event Details -->
        <div style="background: white; padding: 30px; border-left: 4px solid #10b981; margin-top: 1px;">
          <h2 style="color: #065f46; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📋 Event Information</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <p><strong>Exhibition Name:</strong> ${formData.exhibitionName || 'Not specified'}</p>
              <p><strong>Industry:</strong> ${formData.industry || 'Not specified'}</p>
              <p><strong>Event Type:</strong> ${formData.eventType}</p>
              <p><strong>Market Level:</strong> ${formData.marketLevel}</p>
            </div>
            <div>
              <p><strong>Start Date:</strong> ${formData.exhibitionStartDate || 'Not specified'}</p>
              <p><strong>End Date:</strong> ${formData.exhibitionEndDate || 'Not specified'}</p>
              <p><strong>Arrival Date:</strong> ${formData.arrivalDate || 'Not specified'}</p>
              <p><strong>Departure Date:</strong> ${formData.departureDate || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <!-- Location Details -->
        <div style="background: white; padding: 30px; border-left: 4px solid #10b981; margin-top: 1px;">
          <h2 style="color: #065f46; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📍 Location Details</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p><strong>From:</strong> ${formData.originCity}, ${formData.originState}</p>
              <p><strong>To:</strong> ${formData.destinationCity}, ${formData.destinationState}</p>
            </div>
            <div>
              <p><strong>Distance:</strong> ${formData.distance} km</p>
              <p><strong>Venue Type:</strong> ${formData.venueType}</p>
            </div>
          </div>
        </div>

        <!-- Booth & Team Details -->
        <div style="background: white; padding: 30px; border-left: 4px solid #10b981; margin-top: 1px;">
          <h2 style="color: #065f46; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🏢 Booth & Team Requirements</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p><strong>Booth Size:</strong> ${formData.boothSize} sqm</p>
              <p><strong>Booth Type:</strong> ${formData.boothType}</p>
              <p><strong>Team Size:</strong> ${formData.teamSize} people</p>
            </div>
            <div>
              <p><strong>Accommodation Level:</strong> ${formData.accommodationLevel}</p>
              <p><strong>Currency:</strong> ${formData.currency}</p>
            </div>
          </div>
        </div>

        ${costs ? `
        <!-- Cost Breakdown -->
        <div style="background: white; padding: 30px; border-left: 4px solid #10b981; margin-top: 1px;">
          <h2 style="color: #065f46; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">💰 Cost Breakdown</h2>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #065f46; margin-top: 0; font-size: 24px;">Total: ${costs.currency === 'INR' ? '₹' : '$'}${costs.total.toLocaleString()}</h3>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p><strong>Booth Cost:</strong> ${costs.currency === 'INR' ? '₹' : '$'}${costs.boothCost.toLocaleString()}</p>
              <p><strong>Construction Cost:</strong> ${costs.currency === 'INR' ? '₹' : '$'}${costs.constructionCost.toLocaleString()}</p>
              <p><strong>Travel Cost:</strong> ${costs.currency === 'INR' ? '₹' : '$'}${costs.travelCost.toLocaleString()}</p>
            </div>
            <div>
              <p><strong>Staff Cost:</strong> ${costs.currency === 'INR' ? '₹' : '$'}${costs.staffCost.toLocaleString()}</p>
              <p><strong>Marketing Cost:</strong> ${costs.currency === 'INR' ? '₹' : '$'}${costs.marketingCost.toLocaleString()}</p>
              <p><strong>Services Cost:</strong> ${costs.currency === 'INR' ? '₹' : '$'}${costs.servicesCost.toLocaleString()}</p>
            </div>
          </div>
        </div>
        ` : ''}

        ${selectedFlights ? `
        <!-- Flight Details -->
        <div style="background: white; padding: 30px; border-left: 4px solid #10b981; margin-top: 1px;">
          <h2 style="color: #065f46; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">✈️ Selected Flights</h2>
          ${selectedFlights.outbound ? `
            <div style="margin-bottom: 15px;">
              <h4 style="color: #047857;">Outbound Flight:</h4>
              <p>${selectedFlights.outbound.airline} ${selectedFlights.outbound.flightNumber}</p>
              <p>${selectedFlights.outbound.departure} - ${selectedFlights.outbound.arrival}</p>
              <p>Price: ₹${(selectedFlights.outbound.price || 0).toLocaleString()} for ${formData.teamSize || 1} people</p>
            </div>
          ` : ''}
          ${selectedFlights.return ? `
            <div>
              <h4 style="color: #047857;">Return Flight:</h4>
              <p>${selectedFlights.return.airline} ${selectedFlights.return.flightNumber}</p>
              <p>${selectedFlights.return.departure} - ${selectedFlights.return.arrival}</p>
              <p>Price: ₹${(selectedFlights.return.price || 0).toLocaleString()} for ${formData.teamSize || 1} people</p>
            </div>
          ` : ''}
        </div>
        ` : ''}

        ${selectedHotel ? `
        <!-- Hotel Details -->
        <div style="background: white; padding: 30px; border-left: 4px solid #10b981; margin-top: 1px;">
          <h2 style="color: #065f46; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🏨 Selected Hotel</h2>
          <p><strong>Hotel:</strong> ${selectedHotel.name}</p>
          <p><strong>Type:</strong> ${selectedHotel.type}</p>
          <p><strong>Total Price:</strong> ₹${(selectedHotel.totalPrice || 0).toLocaleString()}</p>
          <p><strong>Per Night:</strong> ₹${(selectedHotel.pricePerNight || 0).toLocaleString()}</p>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 1px;">
          <p style="color: white; margin: 0; font-size: 14px;">Generated by EaseMyExpo Cost Calculator</p>
          <p style="color: #d1fae5; margin: 5px 0 0 0; font-size: 12px;">Date: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: '"EaseMyExpo Calculator" <noreply@easemyexpo.com>',
      to: notificationEmail,
      subject: `🎯 New Exhibition Quote: ${formData.exhibitionName || 'Exhibition'} - ${formData.destinationCity}`,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log('User form notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send user form notification:', error);
    return false;
  }
}