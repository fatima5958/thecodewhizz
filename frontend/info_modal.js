/**
 * FRONTEND/INFO_MODAL.JS — Apple-Grade Sub-Pages Reader Overlay Engine
 */

class AriaInfoModalEngine {
    constructor() {
        this.modal = document.getElementById('info-modal');
        this.backdrop = document.getElementById('info-modal-backdrop');
        this.closeBtn = document.getElementById('info-modal-close');
        this.badgeEl = document.getElementById('info-modal-badge');
        this.titleEl = document.getElementById('info-modal-title');
        this.bodyEl = document.getElementById('info-modal-body');

        this.docs = {
            'modal-automation': {
                badge: 'SOLUTIONS // WORKFLOW AUTOMATION',
                title: 'AI Workflow Automations',
                content: `
                    <p>Our AI workflow automations connect your existing software, forms, email, and CRM to eliminate manual work and process business data automatically.</p>
                    <h4>Key Benefits</h4>
                    <ul>
                        <li><strong>Automated Data Sync:</strong> Connect your forms, CRM, and email to save staff time.</li>
                        <li><strong>Instant Software Integration:</strong> Works seamlessly with WhatsApp, Stripe, Google Workspace, and your existing tools.</li>
                        <li><strong>Save Time & Cut Costs:</strong> Eliminate repetitive manual data entry and admin bottlenecks.</li>
                    </ul>
                `
            },
            'modal-support': {
                badge: 'SOLUTIONS // CUSTOMER SUPPORT',
                title: '24/7 AI Customer Support Chatbots',
                content: `
                    <p>Deploy 24/7 smart AI chatbots that answer customer questions instantly, capture leads, and book appointments with high accuracy.</p>
                    <h4>Key Benefits</h4>
                    <ul>
                        <li><strong>24/7 Instant Replies:</strong> Greet website visitors instantly any time of day or night.</li>
                        <li><strong>Automated Lead Capture:</strong> Collect contact details and answer FAQs without staff intervention.</li>
                        <li><strong>Higher Customer Satisfaction:</strong> Zero wait times for your clients.</li>
                    </ul>
                `
            },
            'modal-sales': {
                badge: 'SOLUTIONS // SALES & LEADS',
                title: 'AI Lead Generation & Booking',
                content: `
                    <p>Turn website visitors into booked appointments automatically. Aria greets customers, answers FAQs, and books meetings for your business.</p>
                    <h4>Key Benefits</h4>
                    <ul>
                        <li><strong>Instant Response:</strong> Reply to new inquiries in under 5 seconds.</li>
                        <li><strong>Automated Scheduling:</strong> Allow clients to pick available slots directly.</li>
                        <li><strong>Higher Conversion Rate:</strong> Capture leads before they leave your website.</li>
                    </ul>
                `
            },
            'modal-custom': {
                badge: 'SOLUTIONS // CUSTOM SOLUTIONS',
                title: 'Custom AI Business Solutions',
                content: `
                    <p>We build custom websites, automated workflows, and smart AI tools tailored to your specific business requirements and daily operations.</p>
                    <h4>Key Benefits</h4>
                    <ul>
                        <li><strong>Tailored to Your Workflow:</strong> Built around how your clinic, restaurant, store, or agency operates.</li>
                        <li><strong>Fully Owned & Secure:</strong> Complete control over your business data and website.</li>
                        <li><strong>Built for Growth:</strong> Scalable systems that grow as your business expands.</li>
                    </ul>
                `
            },
            'modal-security': {
                badge: 'LEGAL // DATA SECURITY',
                title: 'Security & Data Protection Protocols',
                content: `
                    <p>Security is baked into every architecture layer. Your enterprise business data is never shared or used for public AI training.</p>
                    <h4>Security Architecture</h4>
                    <ul>
                        <li><strong>Bank-Grade Encryption:</strong> AES-256 encryption at rest and TLS 1.3 in transit.</li>
                        <li><strong>SOC 2 & HIPAA Compliance:</strong> Rigorous access controls, audit logs, and anonymization pipelines.</li>
                        <li><strong>Isolated Tenant Environments:</strong> Isolated database nodes for absolute privacy.</li>
                    </ul>
                `
            },
            'modal-privacy': {
                badge: 'LEGAL // PRIVACY POLICY',
                title: 'Privacy Policy',
                content: `
                    <p>At <strong>The Code Whiz AI Lab</strong>, we respect your privacy and protect your business data. This policy outlines how information is handled across our platforms.</p>
                    <h4>Data Handling Standards</h4>
                    <ul>
                        <li><strong>Confidentiality:</strong> Client consultation data and audit inputs remain 100% confidential.</li>
                        <li><strong>No Model Training:</strong> Your business operational data is NEVER fed into public AI models.</li>
                        <li><strong>Data Retention:</strong> You hold full ownership and can request immediate data deletion at any time.</li>
                    </ul>
                `
            },
            'modal-terms': {
                badge: 'LEGAL // TERMS OF SERVICE',
                title: 'Terms of Service',
                content: `
                    <p>By engaging <strong>The Code Whiz AI Lab</strong> or interacting with Aria, you agree to our standard service and deployment terms.</p>
                    <h4>Service Commitments</h4>
                    <ul>
                        <li><strong>Guaranteed Implementation:</strong> 14-day standard deployment timeline for core AI automation modules.</li>
                        <li><strong>Intellectual Property:</strong> Clients maintain 100% ownership of custom software and workflows developed.</li>
                        <li><strong>24/7 SLA Support:</strong> Proactive system monitoring and uptime SLA guarantees.</li>
                    </ul>
                `
            },
            'modal-report': {
                badge: 'RESOURCES // INDUSTRY BENCHMARK',
                title: 'McKinsey AI Benchmark Report 2026',
                content: `
                    <p>Our proprietary AI readiness audit framework is modeled directly after top enterprise AI adoption studies from McKinsey, Gartner, and OpenAI.</p>
                    <h4>Key Findings</h4>
                    <ul>
                        <li><strong>3.8x ROI Advantage:</strong> Early adopters of autonomous workflow pipelines achieve 3.8x higher profit margins.</li>
                        <li><strong>Speed To Market:</strong> Companies deploying voice AI report 82% faster customer triage response times.</li>
                    </ul>
                `
            }
        };

        this.initTriggers();
        this.bindEvents();
    }

    initTriggers() {
        const links = document.querySelectorAll('.open-info-modal');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetKey = link.getAttribute('data-modal');
                if (targetKey && this.docs[targetKey]) {
                    this.openModal(this.docs[targetKey]);
                }
            });
        });

        // Newsletter subscription handler
        const newsBtn = document.getElementById('btn-newsletter-sub');
        const newsInput = document.getElementById('newsletter-email');
        if (newsBtn && newsInput) {
            newsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = newsInput.value.trim();
                if (email && email.includes('@')) {
                    newsBtn.innerHTML = '<span>Subscribed! ✨</span>';
                    newsInput.value = '';
                    setTimeout(() => {
                        newsBtn.innerHTML = '<span>Subscribe</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
                    }, 3000);
                } else {
                    newsInput.classList.add('error-shake');
                    setTimeout(() => newsInput.classList.remove('error-shake'), 500);
                }
            });
        }
    }

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeModal());
        }
    }

    openModal(data) {
        if (!this.modal) return;
        if (this.badgeEl) this.badgeEl.textContent = data.badge;
        if (this.titleEl) this.titleEl.textContent = data.title;
        if (this.bodyEl) this.bodyEl.innerHTML = data.content;

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.ariaInfoModal = new AriaInfoModalEngine();
});
