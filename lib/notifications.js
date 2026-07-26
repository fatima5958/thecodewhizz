/**
 * LIB/NOTIFICATIONS.JS — Lead Notification Engine (Placeholder for Resend / EmailJS)
 * 
 * =========================================================================================
 * FUTURE RESEND / EMAIL NOTIFICATION GUIDE:
 * =========================================================================================
 * When ready to send automated email alerts to `thecodewhiz.ai@gmail.com`:
 * 1. Install Resend client package: `npm install resend`
 * 2. Add environment variable to Vercel Project Settings:
 *    - RESEND_API_KEY = "re_123456789..."
 * 3. Uncomment Resend client initialization below:
 * 
 *    const { Resend } = require('resend');
 *    const resend = new Resend(process.env.RESEND_API_KEY);
 * 
 * 4. Replace mock notification logic inside `sendLeadNotification()` with:
 * 
 *    await resend.emails.send({
 *      from: 'The Code Whiz Leads <leads@thecodewhizz.vercel.app>',
 *      to: ['thecodewhiz.ai@gmail.com'],
 *      subject: `⚡ New Lead Inbound: ${leadData.name} (${leadData.company || 'Direct'})`,
 *      html: `
 *        <h2>New Lead Transmitted</h2>
 *        <p><strong>Name:</strong> ${leadData.name}</p>
 *        <p><strong>Email:</strong> ${leadData.email}</p>
 *        <p><strong>Company:</strong> ${leadData.company || 'N/A'}</p>
 *        <p><strong>Message:</strong></p>
 *        <blockquote>${leadData.message}</blockquote>
 *      `
 *    });
 * =========================================================================================
 */

/**
 * Sends notification alert to admin / team for new lead (Placeholder implementation)
 * @param {Object} leadData - Sanitized lead object
 * @returns {Promise<Object>} Notification status
 */
async function sendLeadNotification(leadData) {
    console.log('[NOTIFICATION MODULE] Triggering email alert to thecodewhiz.ai@gmail.com:', {
        subject: `New Lead: ${leadData.name}`,
        email: leadData.email
    });

    // TODO: Connect Resend or EmailJS API here to send live email alerts to `thecodewhiz.ai@gmail.com`
    return {
        sent: true,
        recipient: 'thecodewhiz.ai@gmail.com',
        timestamp: new Date().toISOString(),
        isMock: true // Set to false when Resend is connected
    };
}

module.exports = {
    sendLeadNotification
};
