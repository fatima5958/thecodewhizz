/**
 * FRONTEND/CONTACT_FORM.JS — Premium Glassmorphism Contact Form & Validation Engine
 */

class LuxuryContactForm {
    constructor() {
        this.form = document.getElementById('premium-contact-form');
        this.formCard = document.getElementById('contact-form-card');
        this.successState = document.getElementById('contact-success-state');
        
        this.inputName = document.getElementById('contact-name');
        this.inputEmail = document.getElementById('contact-email');
        this.inputCompany = document.getElementById('contact-company');
        this.inputMessage = document.getElementById('contact-message');
        
        this.btnSubmit = document.getElementById('btn-submit-contact');
        this.btnReset = document.getElementById('btn-reset-contact');
        this.sentUserName = document.getElementById('sent-user-name');

        if (!this.form) return;

        this.initEvents();
    }

    initEvents() {
        // Real-time input validation clear on type
        const inputs = [this.inputName, this.inputEmail, this.inputMessage];
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            }
        });

        // Form Submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Reset Form from Success State
        if (this.btnReset) {
            this.btnReset.addEventListener('click', () => {
                this.resetForm();
            });
        }
    }

    validateField(input) {
        if (!input) return true;
        const val = input.value.trim();

        if (input.required && !val) {
            this.showFieldError(input);
            return false;
        }

        if (input.type === 'email' && val) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                this.showFieldError(input);
                return false;
            }
        }

        this.clearFieldError(input);
        return true;
    }

    showFieldError(input) {
        input.classList.add('has-error');
        const wrap = input.closest('.form-field-wrap');
        if (wrap) {
            wrap.classList.add('wrap-error');
        }
    }

    clearFieldError(input) {
        input.classList.remove('has-error');
        const wrap = input.closest('.form-field-wrap');
        if (wrap) {
            wrap.classList.remove('wrap-error');
        }
    }

    handleSubmit() {
        const isNameValid = this.validateField(this.inputName);
        const isEmailValid = this.validateField(this.inputEmail);
        const isMsgValid = this.validateField(this.inputMessage);

        if (!isNameValid || !isEmailValid || !isMsgValid) {
            // Shake form card gently on error
            this.formCard.classList.add('shake-error');
            setTimeout(() => this.formCard.classList.remove('shake-error'), 500);
            return;
        }

        // Show sending state on CTA button
        if (this.btnSubmit) {
            this.btnSubmit.disabled = true;
            this.btnSubmit.innerHTML = `
                <span class="btn-send-text">Transmitting...</span>
                <span class="spinner-dot-pulse"></span>
            `;
        }

        // Simulate ultra-fast transmission & success animation transition
        setTimeout(() => {
            const userName = this.inputName.value.trim() || 'Client';
            if (this.sentUserName) {
                this.sentUserName.textContent = userName;
            }

            // Animate transition to Success State
            this.form.style.opacity = '0';
            this.form.style.transform = 'translateY(-10px)';
            this.form.style.transition = 'all 0.35s ease';

            setTimeout(() => {
                this.form.style.display = 'none';
                if (this.successState) {
                    this.successState.style.display = 'flex';
                    this.successState.style.opacity = '0';
                    this.successState.style.transform = 'translateY(15px)';
                    requestAnimationFrame(() => {
                        this.successState.style.transition = 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
                        this.successState.style.opacity = '1';
                        this.successState.style.transform = 'translateY(0)';
                    });
                }
            }, 350);

        }, 750);
    }

    resetForm() {
        this.form.reset();
        const inputs = [this.inputName, this.inputEmail, this.inputCompany, this.inputMessage];
        inputs.forEach(input => this.clearFieldError(input));

        if (this.btnSubmit) {
            this.btnSubmit.disabled = false;
            this.btnSubmit.innerHTML = `
                <span class="btn-send-text">Send Message</span>
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-send-icon">
                    <path d="M3.33301 8H12.6663" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 3.3335L12.6667 8.00016L8 12.6668" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }

        if (this.successState) {
            this.successState.style.display = 'none';
        }

        this.form.style.display = 'block';
        requestAnimationFrame(() => {
            this.form.style.opacity = '1';
            this.form.style.transform = 'translateY(0)';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.luxuryContactForm = new LuxuryContactForm();
});
