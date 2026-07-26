/**
 * API/CONTACT.JS — Vercel Serverless Function Endpoint for Lead Capture
 * Route: POST /api/contact
 */

const { validateLeadInput } = require('../lib/validation');
const { saveLead } = require('../lib/database');
const { sendLeadNotification } = require('../lib/notifications');

module.exports = async function handler(req, res) {
    // 1. Configure CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS Preflight Request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Enforce POST Method Only
    if (req.method !== 'POST') {
        res.status(405).json({
            success: false,
            error: 'Method Not Allowed',
            message: `HTTP method ${req.method} is not supported on this endpoint. Use POST.`
        });
        return;
    }

    try {
        // Parse request body if necessary
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (pErr) {
                body = {};
            }
        }
        body = body || {};

        // Extract metadata
        const userAgent = req.headers['user-agent'] || '';
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
        body.userAgent = userAgent;
        body.ip = ip;

        // 3. Validate Incoming Lead Input
        const validation = validateLeadInput(body);

        if (!validation.isValid) {
            res.status(400).json({
                success: false,
                error: 'Validation Failed',
                details: validation.errors
            });
            return;
        }

        const sanitizedLead = validation.sanitized;

        // 4. Save Lead Record (Placeholder -> Ready for Supabase)
        const dbResult = await saveLead(sanitizedLead);

        // 5. Send Email Alert Notification (Placeholder -> Ready for Resend)
        const notifyResult = await sendLeadNotification(sanitizedLead);

        // 6. Return HTTP 200 Success Response
        res.status(200).json({
            success: true,
            message: 'Lead captured successfully.',
            data: {
                leadId: dbResult.id,
                name: sanitizedLead.name,
                email: sanitizedLead.email,
                company: sanitizedLead.company,
                timestamp: dbResult.storedAt
            }
        });

    } catch (err) {
        console.error('[API /api/contact Error]', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while processing your request. Please try again later.'
        });
    }
};
