const nodemailer = require('nodemailer');

// Configure the Nodemailer SMTP transporter using Brevo settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465', // True for 465, false for 587 or other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup (non-blocking log)
transporter.verify((error) => {
  if (error) {
    console.warn('⚠️ SMTP Transporter verification failed (will use Brevo API fallback if needed):', error.message);
  } else {
    console.log('📧 SMTP Transporter is ready to deliver messages.');
  }
});

/**
 * Parses the EMAIL_FROM string into a name and email address object.
 * e.g., "Practon Alumni Association <info.dpianalumniassociation@gmail.com>"
 * @param {string} fromStr 
 * @returns {object} { name, email }
 */
const parseFromAddress = (fromStr) => {
  const defaultEmail = 'info.dpianalumniassociation@gmail.com';
  const defaultName = 'Practon Alumni Association';
  if (!fromStr) {
    return { name: defaultName, email: defaultEmail };
  }

  // Matches: "Display Name <email@example.com>" or just "<email@example.com>"
  const match = fromStr.match(/^(?:"?([^"]*)"?\s)?(?:<([^>]+)>)$/);
  if (match) {
    return {
      name: match[1]?.trim() || defaultName,
      email: match[2]?.trim() || defaultEmail
    };
  }
  return { name: defaultName, email: fromStr.trim() || defaultEmail };
};

/**
 * Generic sendEmail function with SMTP primary attempt and HTTP API fallback.
 * @param {object} options { to, subject, html }
 * @returns {Promise<object>} Send details
 */
const sendEmail = async ({ to, subject, html }) => {
  const fromString = process.env.EMAIL_FROM || '"Practon Alumni Association" <info.dpianalumniassociation@gmail.com>';

  // 1. Try sending via SMTP (Nodemailer)
  try {
    const info = await transporter.sendMail({
      from: fromString,
      to,
      subject,
      html,
    });
    console.log(`✉️ Email successfully sent via SMTP to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (smtpError) {
    console.warn(`⚠️ SMTP transport failed: "${smtpError.message}". Trying Brevo HTTP API fallback...`);
    
    // 2. Try sending via Brevo HTTP API v3 fallback
    if (!process.env.SMTP_API_KEY) {
      console.error('❌ Brevo HTTP API Key is not set in environment. Fallback unavailable.');
      throw smtpError;
    }

    try {
      const senderInfo = parseFromAddress(fromString);

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.SMTP_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: senderInfo,
          to: [{ email: to }],
          subject,
          htmlContent: html
        })
      });

      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.message || `API request failed with status ${response.status}`);
      }

      console.log(`🚀 Email successfully sent via Brevo HTTP API to ${to}. Message ID: ${responseBody.messageId}`);
      return { messageId: responseBody.messageId, provider: 'brevo-api' };
    } catch (apiError) {
      console.error(`❌ Brevo HTTP API fallback failed:`, apiError.message);
      throw new Error(`Email sending failed (SMTP: ${smtpError.message}, API Fallback: ${apiError.message})`);
    }
  }
};

/**
 * Generate a styled HTML template for the attendee's confirmation event ticket (MINIMAL INFO).
 * @param {object} registration The event registration document
 * @param {object} event The event details document
 * @returns {string} Styled HTML email content
 */
const getTicketTemplate = (registration, event) => {
  const eventTitle = event.title?.en || 'Alumni Event';
  const eventTitleBn = event.title?.bn || '';
  const eventLocation = event.location?.en || 'To Be Announced';
  const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'TBA';

  const isPaid = registration.paymentStatus === 'completed';
  const statusLabel = isPaid ? '✓ COMPLETED / PAID' : '⌛ PENDING VERIFICATION';
  const statusColor = isPaid ? '#10b981' : '#f59e0b';
  const statusBg = isPaid ? '#ecfdf5' : '#fffbeb';

  // Format ID nicely as ticket ref
  const ticketRef = registration._id.toString().toUpperCase().slice(-8);

  // Normalize avatar URL
  let avatarUrl = registration.userImage || '';
  if (avatarUrl && !avatarUrl.startsWith('http')) {
    const backendUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace('5173', '5000') : 'http://localhost:5000';
    avatarUrl = `${backendUrl}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
  }

  const formattedPaymentType = registration.paymentType ? registration.paymentType.charAt(0).toUpperCase() + registration.paymentType.slice(1) : 'Cash';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Event Ticket - ${eventTitle}</title>
    <style>
      body {
        font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: #f8fafc;
        margin: 0;
        padding: 0;
        color: #1e293b;
        -webkit-font-smoothing: antialiased;
        width: 100% !important;
      }
      table {
        border-collapse: collapse;
      }
      @media only screen and (max-width: 520px) {
        .container {
          margin: 5px auto !important;
          border-radius: 8px !important;
          width: 98% !important;
        }
        .content {
          padding: 15px 10px !important;
        }
        .ticket-body {
          padding: 15px 10px !important;
        }
        .ticket-header {
          padding: 12px 10px !important;
        }
        .ticket-col {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
          padding-bottom: 12px !important;
        }
        .ticket-row {
          display: block !important;
          width: 100% !important;
        }
        .social-link {
          margin: 0 4px !important;
        }
      }
    </style>
  </head>
  <body style="background-color: #f8fafc; margin: 0; padding: 0; width: 100%;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f8fafc; margin: 0; padding: 0;">
      <tr>
        <td align="center" style="padding: 10px 5px;">
          <!-- Container -->
          <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05); overflow: hidden; border-top: 8px solid #003b73;">
            <tr>
              <td>
                <!-- Header -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: linear-gradient(135deg, #003b73 0%, #00254a 100%); padding: 25px 15px; text-align: center;">
                  <tr>
                    <td align="center">
                      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; font-family: 'Outfit', 'Inter', sans-serif;">PRACTON ALUMNI ASSOCIATION</h1>
                      <p style="color: #f9a826; margin: 5px 0 0 0; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; font-family: 'Outfit', 'Inter', sans-serif;">প্রাক্তন পরিষদ</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="content" style="padding: 25px 15px;">
                <!-- Welcome text -->
                <div class="welcome" style="font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #334155;">
                  Dear <strong>${registration.fullName}</strong>,<br>
                  Thank you for registering. Your ticket for the upcoming event has been generated successfully. Please find your event ticket details below:
                </div>
                
                <!-- Ticket Card -->
                <table class="ticket" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border: 2px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 25px; background-color: #ffffff;">
                  <tr>
                    <td class="ticket-header" style="background-color: #f1f5f9; padding: 12px 15px; border-bottom: 1px dashed #cbd5e1; position: relative;">
                      <h2 class="ticket-title" style="font-size: 18px; font-weight: 700; color: #003b73; margin: 0; font-family: 'Outfit', 'Inter', sans-serif;">${eventTitle}</h2>
                      ${eventTitleBn ? `<div class="ticket-subtitle" style="font-size: 13px; color: #64748b; margin: 3px 0 0 0; font-style: italic;">${eventTitleBn}</div>` : ''}
                    </td>
                  </tr>
                  <tr>
                    <td class="ticket-body" style="padding: 15px;">
                      
                      <!-- Attendee Photo if available -->
                      ${avatarUrl ? `
                      <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${avatarUrl}" alt="${registration.fullName}" style="width: 85px; height: 85px; border-radius: 50%; object-fit: cover; border: 3px solid #003b73; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" />
                      </div>
                      ` : ''}

                      <!-- Section: Event Info -->
                      <div style="font-size: 11px; font-weight: 700; color: #003b73; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 10px; font-family: 'Outfit', 'Inter', sans-serif;">Event Information</div>
                      
                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div class="label" style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 3px;">Date & Time</div>
                            <div class="value" style="font-size: 13px; color: #1e293b; font-weight: 500;">${eventDate}</div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div class="label" style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 3px;">Venue</div>
                            <div class="value" style="font-size: 13px; color: #1e293b; font-weight: 500;">${eventLocation}</div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Section: Alumnus Profile -->
                      <div style="font-size: 11px; font-weight: 700; color: #003b73; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-top: 15px; margin-bottom: 10px; font-family: 'Outfit', 'Inter', sans-serif;">Attendee Profile</div>
                      
                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div class="label" style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 3px;">Full Name</div>
                            <div class="value" style="font-size: 13px; color: #1e293b; font-weight: 500;">${registration.fullName}</div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div class="label" style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 3px;">PSC Batch</div>
                            <div class="value" style="font-size: 13px; color: #1e293b; font-weight: 500;">${registration.pscBatch}</div>
                          </td>
                        </tr>
                      </table>

                      <!-- Section: Ticket Details -->
                      <div style="font-size: 11px; font-weight: 700; color: #003b73; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-top: 15px; margin-bottom: 10px; font-family: 'Outfit', 'Inter', sans-serif;">Ticket Details</div>

                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div class="label" style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 3px;">Ticket Reference</div>
                            <div class="value" style="font-family: monospace; font-weight: 700; font-size: 14px; color: #003b73;">#${ticketRef}</div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div class="label" style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 3px;">Payment Status</div>
                            <div>
                              <span class="badge" style="color: ${statusColor}; background-color: ${statusBg}; border: 1px solid ${statusColor}; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; display: inline-block; font-family: 'Outfit', 'Inter', sans-serif;">
                                ${statusLabel}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div class="label" style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 3px;">Payment Mode</div>
                            <div class="value" style="font-size: 13px; color: #1e293b; font-weight: 500;">
                              ${formattedPaymentType}
                            </div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">&nbsp;</td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
                
                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; text-align: center; margin: 30px 0;">
                  <tr>
                    <td align="center">
                      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/profile" class="cta-button" style="background-color: #003b73; color: #ffffff !important; text-decoration: none; padding: 12px 30px; font-size: 15px; font-weight: 600; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 59, 115, 0.2); font-family: 'Outfit', 'Inter', sans-serif;">View Virtual ID Card</a>
                    </td>
                  </tr>
                </table>
                
                <p style="font-size: 12px; color: #64748b; line-height: 1.5; text-align: center;">
                  * Please present this ticket verification summary or your Virtual ID card details at the desk for check-in on the day of the event.
                </p>
              </td>
            </tr>
            <tr>
              <td class="footer" style="background-color: #f1f5f9; padding: 25px 20px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6; border-top: 1px solid #e2e8f0; font-family: 'Outfit', 'Inter', sans-serif;">
                <div style="font-weight: 600; color: #334155; margin-bottom: 8px;">Connect with Practon Alumni Association</div>
                
                <!-- Social Media Icons -->
                <div class="social-icons" style="margin-top: 10px; margin-bottom: 15px; text-align: center;">
                  <a href="https://facebook.com" class="social-link" style="margin: 0 8px; display: inline-block; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" width="26" height="26" alt="Facebook" style="display: inline-block; vertical-align: middle; border: 0;" />
                  </a>
                  <a href="https://linkedin.com" class="social-link" style="margin: 0 8px; display: inline-block; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/32/733/733561.png" width="26" height="26" alt="LinkedIn" style="display: inline-block; vertical-align: middle; border: 0;" />
                  </a>
                  <a href="https://twitter.com" class="social-link" style="margin: 0 8px; display: inline-block; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/32/5969/5969020.png" width="26" height="26" alt="Twitter" style="display: inline-block; vertical-align: middle; border: 0;" />
                  </a>
                  <a href="https://practonalumni.org" class="social-link" style="margin: 0 8px; display: inline-block; text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/32/1006/1006771.png" width="26" height="26" alt="Website" style="display: inline-block; vertical-align: middle; border: 0;" />
                  </a>
                </div>

                © ${new Date().getFullYear()} Practon Alumni Association. All rights reserved.<br>
                If you have any questions or concerns, please write to us at <a href="mailto:info.dpianalumniassociation@gmail.com" style="color: #003b73; text-decoration: none; font-weight: 500;">info.dpianalumniassociation@gmail.com</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

/**
 * Generate a styled HTML template for the admin notification alert (FULL DETAILS).
 * @param {object} registration The event registration document
 * @param {object} event The event details document
 * @returns {string} Styled HTML email content
 */
const getAdminNotificationTemplate = (registration, event) => {
  const eventTitle = event.title?.en || 'Alumni Event';
  const eventLocation = event.location?.en || 'To Be Announced';
  const eventDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : 'TBA';

  const isPaid = registration.paymentStatus === 'completed';
  const statusLabel = isPaid ? '✓ COMPLETED / PAID' : '⌛ PENDING VERIFICATION';
  const statusColor = isPaid ? '#10b981' : '#f59e0b';
  const statusBg = isPaid ? '#ecfdf5' : '#fffbeb';

  const ticketRef = registration._id.toString().toUpperCase().slice(-8);

  // Normalize avatar URL
  let avatarUrl = registration.userImage || '';
  if (avatarUrl && !avatarUrl.startsWith('http')) {
    const backendUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace('5173', '5000') : 'http://localhost:5000';
    avatarUrl = `${backendUrl}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
  }

  const formattedGender = registration.gender ? registration.gender.charAt(0).toUpperCase() + registration.gender.slice(1) : 'N/A';
  const formattedMarital = registration.maritalStatus ? registration.maritalStatus.charAt(0).toUpperCase() + registration.maritalStatus.slice(1) : 'Single';
  const isMarried = registration.maritalStatus === 'married';
  const formattedPaymentType = registration.paymentType ? registration.paymentType.charAt(0).toUpperCase() + registration.paymentType.slice(1) : 'Cash';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Notification: New Event Registration - ${registration.fullName}</title>
    <style>
      body {
        font-family: 'Outfit', 'Inter', sans-serif;
        background-color: #f1f5f9;
        margin: 0;
        padding: 0;
        color: #1e293b;
        width: 100% !important;
      }
      table {
        border-collapse: collapse;
      }
      @media only screen and (max-width: 520px) {
        .container {
          margin: 5px auto !important;
          width: 98% !important;
        }
        .content {
          padding: 15px 10px !important;
        }
        .ticket-body {
          padding: 15px 10px !important;
        }
        .ticket-col {
          display: block !important;
          width: 100% !important;
          padding-bottom: 12px !important;
          box-sizing: border-box !important;
        }
        .ticket-row {
          display: block !important;
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body style="background-color: #f1f5f9; margin: 0; padding: 0; width: 100%;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f1f5f9; margin: 0; padding: 0;">
      <tr>
        <td align="center" style="padding: 10px 5px;">
          <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; border-top: 8px solid #dc2626; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <tr>
              <td style="background-color: #7f1d1d; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; font-family: 'Outfit', 'Inter', sans-serif;">NEW EVENT REGISTRATION ALERT</h1>
                <p style="color: #fca5a5; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; font-family: 'Outfit', 'Inter', sans-serif;">Administration Portal</p>
              </td>
            </tr>
            <tr>
              <td class="content" style="padding: 25px 15px;">
                <p style="font-size: 14px; margin-bottom: 20px; color: #475569; line-height: 1.5;">
                  A new registration form has been submitted for the event: <strong>${eventTitle}</strong>. Below is the full profile details submitted by the alumnus for administrative review:
                </p>

                <!-- Full details card -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; background-color: #f8fafc; margin-bottom: 25px;">
                  <tr>
                    <td class="ticket-body" style="padding: 15px;">
                      
                      ${avatarUrl ? `
                      <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${avatarUrl}" alt="Alumnus Photo" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #dc2626;" />
                      </div>
                      ` : ''}

                      <div style="font-size: 11px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 10px; font-family: 'Outfit', 'Inter', sans-serif;">Personal Profile</div>
                      
                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">Full Name</div>
                            <div style="font-size: 13px; color: #1e293b; font-weight: 600;">${registration.fullName}</div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">PSC Batch</div>
                            <div style="font-size: 13px; color: #1e293b; font-weight: 600;">${registration.pscBatch}</div>
                          </td>
                        </tr>
                      </table>

                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">Father's Name</div>
                            <div style="font-size: 13px; color: #1e293b;">${registration.fathersName || 'N/A'}</div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">Mother's Name</div>
                            <div style="font-size: 13px; color: #1e293b;">${registration.mothersName || 'N/A'}</div>
                          </td>
                        </tr>
                      </table>

                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">Gender</div>
                            <div style="font-size: 13px; color: #1e293b;">${formattedGender}</div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">Marital Status</div>
                            <div style="font-size: 13px; color: #1e293b;">${formattedMarital} ${isMarried && registration.spouseName ? `(${registration.spouseName})` : ''}</div>
                          </td>
                        </tr>
                      </table>

                      <div style="font-size: 11px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-top: 15px; margin-bottom: 10px; font-family: 'Outfit', 'Inter', sans-serif;">Contact & Address Details</div>

                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">Email Address</div>
                            <div style="font-size: 13px; color: #1e293b; word-break: break-all;">${registration.email}</div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">Contact Numbers</div>
                            <div style="font-size: 13px; color: #1e293b;">Phone: ${registration.contactNumber}<br>WhatsApp: ${registration.whatsappNumber || 'N/A'}</div>
                          </td>
                        </tr>
                      </table>

                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td width="100%" valign="top" style="width: 100%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">Full Address</div>
                            <div style="font-size: 13px; color: #1e293b;">${registration.fullAddress}</div>
                          </td>
                        </tr>
                      </table>

                      <div style="font-size: 11px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-top: 15px; margin-bottom: 10px; font-family: 'Outfit', 'Inter', sans-serif;">Payment Information</div>

                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">PAYMENT STATUS</div>
                            <div>
                              <span style="color: ${statusColor}; background-color: ${statusBg}; border: 1px solid ${statusColor}; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-block;">
                                ${statusLabel}
                              </span>
                            </div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">PAYMENT MODE / PROVIDER</div>
                            <div style="font-size: 13px; color: #1e293b;">
                              ${formattedPaymentType} 
                              ${registration.paymentProvider ? `(${registration.paymentProvider})` : ''}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <table class="ticket-row" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                        <tr>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">TICKET REFERENCE ID</div>
                            <div style="font-family: monospace; font-weight: 700; font-size: 14px; color: #dc2626;">#${ticketRef}</div>
                          </td>
                          <td class="ticket-col" width="50%" valign="top" style="width: 50%;">
                            <div style="font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 3px;">TRANSACTION DETAILS</div>
                            <div style="font-size: 13px; color: #1e293b;">
                              TXID: ${registration.transactionId || 'N/A'}<br>
                              Sender Num: ${registration.paymentNumber || 'N/A'}
                            </div>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>

                <div style="text-align: center; margin-top: 20px;">
                  <a href="${process.env.ADMIN_URL || 'http://localhost:5174'}/event-registrations" style="background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 10px 24px; font-size: 14px; font-weight: 600; border-radius: 6px; display: inline-block; font-family: 'Outfit', 'Inter', sans-serif;">Go to Administration Dashboard</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #cbd5e1; font-family: 'Outfit', 'Inter', sans-serif; line-height: 1.5;">
                This notification is sent automatically to the administrator box because a registration form was completed on the Practon Alumni Platform.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

/**
 * Resolves the email address(es) of administrators dynamically from the database.
 * If no superadmin/admin users are found, falls back to settings or a default email.
 * @returns {Promise<string>} Comma-separated administrator emails
 */
const getAdminEmails = async () => {
  try {
    const User = require('../models/user.model');
    const Setting = require('../models/setting.model');

    const admins = await User.find({ role: { $in: ['superadmin', 'admin'] } }).select('email');
    if (admins && admins.length > 0) {
      const emailList = admins.map(a => a.email).filter(Boolean);
      if (emailList.length > 0) {
        return emailList.join(',');
      }
    }

    const setting = await Setting.findOne({ key: 'general_settings' });
    if (setting && setting.value && setting.value.email) {
      return setting.value.email;
    }
  } catch (err) {
    console.error('⚠️ Failed to dynamically retrieve administrator emails from database:', err.message);
  }
  
  return 'info.dpianalumniassociation@gmail.com';
};

/**
 * Generate HTML email template for contact form inquiries.
 */
const getContactFormTemplate = ({ name, email, subject, message }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New Contact Form Inquiry</title>
    <style>
      body { font-family: sans-serif; background-color: #f1f5f9; color: #1e293b; padding: 20px; }
      .card { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-top: 8px solid #003b73; }
      .header { background: #003b73; padding: 20px; text-align: center; color: white; }
      .content { padding: 25px 20px; }
      .field { margin-bottom: 15px; }
      .label { font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 3px; }
      .value { font-size: 14px; font-weight: 500; }
      .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-top: 5px; }
      .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #cbd5e1; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h2 style="margin: 0; font-size: 18px;">New Contact Message Received</h2>
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;">Practon Alumni Association Portal</span>
      </div>
      <div class="content">
        <div class="field">
          <div class="label">Sender Name</div>
          <div class="value">${name}</div>
        </div>
        <div class="field">
          <div class="label">Sender Email</div>
          <div class="value"><a href="mailto:${email}">${email}</a></div>
        </div>
        <div class="field">
          <div class="label">Subject</div>
          <div class="value" style="font-weight: 600;">${subject}</div>
        </div>
        <div class="field">
          <div class="label">Message</div>
          <div class="message-box">${message}</div>
        </div>
      </div>
      <div class="footer">
        This notification was generated automatically from the contact form submission.
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Generate HTML email template for pending member profiles.
 */
const getPendingMemberTemplate = (member) => {
  const nameEn = member.name?.en || 'N/A';
  const batch = member.batch || 'N/A';
  const pscBatch = member.pscBatch || 'N/A';
  const profession = member.profession || 'N/A';
  const email = member.email || 'N/A';
  const phone = member.phone || 'N/A';
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New Member Profile Verification Required</title>
    <style>
      body { font-family: sans-serif; background-color: #f1f5f9; color: #1e293b; padding: 20px; }
      .card { max-w: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-top: 8px solid #f59e0b; }
      .header { background: #d97706; padding: 20px; text-align: center; color: white; }
      .content { padding: 25px 20px; }
      .field-row { display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding: 8px 0; }
      .label { font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; }
      .value { font-size: 13px; font-weight: 600; }
      .btn { display: inline-block; background-color: #d97706; color: white !important; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-top: 20px; text-align: center; }
      .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #cbd5e1; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h2 style="margin: 0; font-size: 18px;">Pending Member Verification</h2>
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;">Action Required</span>
      </div>
      <div class="content">
        <p style="font-size: 13px; color: #475569; margin-top: 0;">A new alumnus has completed registration and submitted their profile for verification. Please review their details:</p>
        
        <div class="field-row">
          <span class="label">Alumnus Name</span>
          <span class="value">${nameEn}</span>
        </div>
        <div class="field-row">
          <span class="label">SSC / Batch</span>
          <span class="value">${batch}</span>
        </div>
        <div class="field-row">
          <span class="label">PSC Batch</span>
          <span class="value">${pscBatch}</span>
        </div>
        <div class="field-row">
          <span class="label">Profession</span>
          <span class="value">${profession}</span>
        </div>
        <div class="field-row">
          <span class="label">Email</span>
          <span class="value">${email}</span>
        </div>
        <div class="field-row">
          <span class="label">Phone</span>
          <span class="value">${phone}</span>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.ADMIN_URL || 'http://localhost:5174'}/member-approvals" class="btn">Go to Member Approvals</a>
        </div>
      </div>
      <div class="footer">
        This notification was generated automatically because a member profile was submitted on the Practon Alumni Platform.
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Generate HTML email template for donation alerts.
 */
const getDonationAlertTemplate = (donation) => {
  const donorName = donation.donorName?.en || 'Donor';
  const amount = donation.amount || 0;
  const paymentMethod = donation.paymentMethod || 'N/A';
  const transactionId = donation.transactionId || 'N/A';
  const email = donation.email || 'N/A';
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New Donation Received Alert</title>
    <style>
      body { font-family: sans-serif; background-color: #f1f5f9; color: #1e293b; padding: 20px; }
      .card { max-w: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-top: 8px solid #10b981; }
      .header { background: #059669; padding: 20px; text-align: center; color: white; }
      .content { padding: 25px 20px; }
      .field-row { display: flex; justify-content: space-between; border-bottom: 1px dashed #e2e8f0; padding: 8px 0; }
      .label { font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; }
      .value { font-size: 13px; font-weight: 600; }
      .amount-display { font-size: 24px; font-weight: bold; color: #059669; text-align: center; margin: 15px 0; }
      .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #cbd5e1; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h2 style="margin: 0; font-size: 18px;">Donation Contribution Received</h2>
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;">Welfare Fund Alert</span>
      </div>
      <div class="content">
        <p style="font-size: 13px; color: #475569; margin-top: 0; text-align: center;">A new donation transaction has been completed successfully on the portal.</p>
        
        <div class="amount-display">৳ ${amount} BDT</div>

        <div class="field-row">
          <span class="label">Donor Name</span>
          <span class="value">${donation.isAnonymous ? 'Anonymous' : donorName}</span>
        </div>
        <div class="field-row">
          <span class="label">Donor Email</span>
          <span class="value">${donation.isAnonymous ? 'Hidden (Anonymous)' : email}</span>
        </div>
        <div class="field-row">
          <span class="label">Payment Method</span>
          <span class="value">${paymentMethod}</span>
        </div>
        <div class="field-row">
          <span class="label">Transaction ID</span>
          <span class="value" style="font-family: monospace;">${transactionId}</span>
        </div>
      </div>
      <div class="footer">
        This notification was generated automatically because a welfare donation was completed on the Practon Alumni Platform.
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Send event ticket confirmation email.
 * @param {object} registration The event registration object
 * @param {object} event The event details object
 * @returns {Promise<object>} Nodemailer sendMail or fallback API result
 */
const sendTicketEmail = async (registration, event) => {
  return sendEmail({
    to: registration.email,
    subject: `🎟️ Your Ticket Confirmation: ${event.title?.en || 'Alumni Event'}`,
    html: getTicketTemplate(registration, event),
  });
};

/**
 * Send full registration details email to administration.
 * @param {object} registration The event registration object
 * @param {object} event The event details document
 * @returns {Promise<object>} Send email result
 */
const sendAdminNotificationEmail = async (registration, event) => {
  const adminEmails = await getAdminEmails();
  return sendEmail({
    to: adminEmails,
    subject: `🔔 Admin Alert: New Event Registration by ${registration.fullName}`,
    html: getAdminNotificationTemplate(registration, event),
  });
};

/**
 * Send contact form submission email to administration.
 */
const sendContactFormEmail = async ({ name, email, subject, message }) => {
  const adminEmails = await getAdminEmails();
  return sendEmail({
    to: adminEmails,
    subject: `✉️ New Contact Form Inquiry: ${subject}`,
    html: getContactFormTemplate({ name, email, subject, message }),
  });
};

/**
 * Send pending member verification email to administration.
 */
const sendPendingMemberEmail = async (member) => {
  const adminEmails = await getAdminEmails();
  const nameEn = member.name?.en || 'N/A';
  return sendEmail({
    to: adminEmails,
    subject: `🔔 Admin Alert: Pending Verification for ${nameEn}`,
    html: getPendingMemberTemplate(member),
  });
};

/**
 * Send donation alert email to administration.
 */
const sendDonationAlertEmail = async (donation) => {
  const adminEmails = await getAdminEmails();
  const donorName = donation.donorName?.en || 'Donor';
  const displayDonor = donation.isAnonymous ? 'Anonymous' : donorName;
  return sendEmail({
    to: adminEmails,
    subject: `💰 Admin Alert: New Donation of ৳${donation.amount} received from ${displayDonor}`,
    html: getDonationAlertTemplate(donation),
  });
};

/**
 * Send a simple HTML test email to verify SMTP credentials (with API fallback).
 * @param {string} toEmail Recipient email address
 * @returns {Promise<object>} Send result
 */
const sendTestEmail = async (toEmail) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #003b73;">Brevo Email Delivery Test Successful!</h2>
      <p>Hello,</p>
      <p>This is a test email confirming that the mail configuration (with automatic API fallback) for the **Practon Alumni Association Platform** is working correctly.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777;">Sent via Practon Alumni mail helper.</p>
    </div>
  `;

  return sendEmail({
    to: toEmail,
    subject: '🧪 Email Configuration Test - Practon Alumni',
    html,
  });
};

module.exports = {
  transporter,
  sendTicketEmail,
  sendAdminNotificationEmail,
  sendContactFormEmail,
  sendPendingMemberEmail,
  sendDonationAlertEmail,
  sendTestEmail,
  sendEmail,
};
