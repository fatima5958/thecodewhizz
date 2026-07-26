/**
 * LIB/VALIDATION.JS — Production Lead Validation & Sanitization Module
 */

/**
 * Validates lead contact submission payload
 * @param {Object} data - Raw request payload
 * @returns {Object} { isValid: boolean, errors: String[], sanitized: Object }
 */
function validateLeadInput(data = {}) {
    const errors = [];
    
    // Sanitize string inputs
    const sanitize = (str) => typeof str === 'string' ? str.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';

    const name = sanitize(data.name);
    const email = sanitize(data.email).toLowerCase();
    const company = sanitize(data.company);
    const message = sanitize(data.message);

    // 1. Name validation
    if (!name) {
        errors.push('Full name is required.');
    } else if (name.length < 2) {
        errors.push('Name must be at least 2 characters long.');
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.push('Email address is required.');
    } else if (!emailRegex.test(email)) {
        errors.push('Please provide a valid email address.');
    }

    // 3. Message validation
    if (!message) {
        errors.push('Project details or message is required.');
    } else if (message.length < 5) {
        errors.push('Message must be at least 5 characters long.');
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: {
            name,
            email,
            company,
            message,
            submittedAt: new Date().toISOString(),
            userAgent: data.userAgent || 'unknown',
            ip: data.ip || 'unknown'
        }
    };
}

module.exports = {
    validateLeadInput
};
