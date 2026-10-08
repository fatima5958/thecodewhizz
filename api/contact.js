// No delivery provider is configured. Never report an unsent inquiry as delivered.
module.exports = function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, error: 'Method not allowed.' });
    }
    return res.status(503).json({
        success: false,
        error: 'Contact delivery is not configured. Please email thecodewhiz.ai@gmail.com.'
    });
};
