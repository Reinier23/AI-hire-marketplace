// AI Marketplace Application
class AIMarketplace {
    constructor() {
        this.agents = [];
        this.filteredAgents = [];
        this.currentPage = 'marketplace';
        this.debounceTimer = null;
        
        this.init();
    }
    
    async init() {
        await this.loadAgents();
        this.setupEventListeners();
        this.renderMarketplace();
    }
    
    async loadAgents() {
        try {
            // Try to fetch from JSON file first
            const response = await fetch('/data/agents.json');
            if (response.ok) {
                this.agents = await response.json();
            } else {
                throw new Error('Failed to fetch agents');
            }
        } catch (error) {
            console.log('Using fallback data');
            this.agents = this.getFallbackData();
        }
        
        this.filteredAgents = [...this.agents];
    }
    
    getFallbackData() {
        return [
            {
                id: "workflow-automator",
                name: "Workflow Automator Pro",
                vendor: "AIFlow Solutions",
                tagline: "Automate complex business processes with intelligent workflow management",
                description: "Advanced AI agent that analyzes your business processes and automatically creates optimized workflows. Reduces manual work by up to 80% while maintaining quality and compliance.",
                categories: ["workflow", "operations"],
                industries: ["tech", "finance", "healthcare"],
                skills: ["process optimization", "automation", "workflow design"],
                rating: 4.8,
                deploymentsCount: 1247,
                metrics: [
                    { label: "Time Saved", value: 65, unit: "%" },
                    { label: "Error Reduction", value: 78, unit: "%" },
                    { label: "ROI", value: 340, unit: "%" }
                ],
                priceTiers: [
                    { name: "Trial", monthlyUsd: 0, features: ["Basic workflow templates", "5 workflows", "Email support"] },
                    { name: "Standard", monthlyUsd: 299, features: ["Unlimited workflows", "Advanced analytics", "Priority support", "Custom integrations"] },
                    { name: "Enterprise", monthlyUsd: 899, features: ["Everything in Standard", "Dedicated support", "Custom development", "SLA guarantees"] }
                ],
                compliance: ["GDPR", "SOC2", "ISO27001"],
                integrations: ["hubspot", "salesforce", "jira", "slack"],
                lastUpdatedISO: "2024-01-15T10:30:00Z",
                heroImageUrl: "/assets/workflow-automator.svg"
            },
            {
                id: "customer-intelligence",
                name: "Customer Intelligence Hub",
                vendor: "CustomerAI",
                tagline: "Transform customer data into actionable insights and personalized experiences",
                description: "Comprehensive customer intelligence platform that analyzes customer behavior, predicts needs, and automates personalized marketing campaigns.",
                categories: ["customer", "analytics"],
                industries: ["retail", "tech", "finance"],
                skills: ["customer analytics", "personalization", "marketing automation"],
                rating: 4.6,
                deploymentsCount: 892,
                metrics: [
                    { label: "Customer Retention", value: 23, unit: "%" },
                    { label: "Conversion Rate", value: 18, unit: "%" },
                    { label: "LTV Increase", value: 45, unit: "%" }
                ],
                priceTiers: [
                    { name: "Trial", monthlyUsd: 0, features: ["Basic analytics", "1000 customers", "Standard reports"] },
                    { name: "Standard", monthlyUsd: 199, features: ["Advanced analytics", "Unlimited customers", "Custom dashboards", "API access"] },
                    { name: "Enterprise", monthlyUsd: 599, features: ["Everything in Standard", "White-label solution", "Custom ML models", "24/7 support"] }
                ],
                compliance: ["GDPR", "CCPA", "SOC2"],
                integrations: ["hubspot", "salesforce", "shopify", "stripe"],
                lastUpdatedISO: "2024-01-10T14:20:00Z",
                heroImageUrl: "/assets/customer-intelligence.svg"
            },
            {
                id: "financial-analyzer",
                name: "Financial Analyzer Pro",
                vendor: "FinTech AI",
                tagline: "AI-powered financial analysis and risk assessment for enterprise decision-making",
                description: "Advanced financial modeling and analysis agent that processes complex financial data, identifies trends, and provides actionable insights for investment and risk management decisions.",
                categories: ["analytics", "operations"],
                industries: ["finance", "insurance", "real-estate"],
                skills: ["financial modeling", "risk assessment", "data analysis", "regulatory compliance"],
                rating: 4.9,
                deploymentsCount: 567,
                metrics: [
                    { label: "Analysis Speed", value: 85, unit: "%" },
                    { label: "Accuracy", value: 96, unit: "%" },
                    { label: "Cost Savings", value: 420, unit: "%" }
                ],
                priceTiers: [
                    { name: "Trial", monthlyUsd: 0, features: ["Basic analysis", "5 reports/month", "Standard models"] },
                    { name: "Standard", monthlyUsd: 499, features: ["Advanced analysis", "Unlimited reports", "Custom models", "API access"] },
                    { name: "Enterprise", monthlyUsd: 1299, features: ["Everything in Standard", "Custom development", "Dedicated analyst", "SLA guarantees"] }
                ],
                compliance: ["GDPR", "SOC2", "ISO27001", "PCI-DSS"],
                integrations: ["netsuite", "workday", "salesforce", "tableau"],
                lastUpdatedISO: "2024-01-12T09:15:00Z",
                heroImageUrl: "/assets/financial-analyzer.svg"
            }
        ];
    }
    
    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
        
        // Filter functionality
        const filterInputs = document.querySelectorAll('input[type="checkbox"], select');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.applyFilters());
        });
        
        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }
        
        // Clear filters
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllFilters());
        }
        
        // Reset search
        const resetBtn = document.getElementById('resetSearch');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSearch());
        }
        
        // Retry load
        const retryBtn = document.getElementById('retryLoad');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.retryLoad());
        }
        
        // Navigation tabs (for agent detail page)
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.section));
        });
        
        // Review sorting
        const reviewSort = document.getElementById('reviewSort');
        if (reviewSort) {
            reviewSort.addEventListener('change', (e) => this.sortReviews(e.target.value));
        }
        
        // Hire form
        const hireForm = document.getElementById('hireForm');
        if (hireForm) {
            hireForm.addEventListener('submit', (e) => this.handleHireSubmit(e));
        }
        
        // Check if we're on agent detail page
        if (window.location.pathname.includes('agent.html')) {
            this.loadAgentDetails();
        }
    }
    
    handleSearch(query) {
        this.filteredAgents = this.agents.filter(agent => {
            const searchTerm = query.toLowerCase();
            return (
                agent.name.toLowerCase().includes(searchTerm) ||
                agent.vendor.toLowerCase().includes(searchTerm) ||
                agent.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
                agent.industries.some(ind => ind.toLowerCase().includes(searchTerm)) ||
                agent.skills.some(skill => skill.toLowerCase().includes(searchTerm))
            );
        });
        
        this.applyFilters();
    }
    
    applyFilters() {
        let filtered = [...this.filteredAgents];
        
        // Category filter
        const selectedCategories = Array.from(document.querySelectorAll('#categoryFilter input:checked'))
            .map(cb => cb.value);
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(agent => 
                agent.categories.some(cat => selectedCategories.includes(cat))
            );
        }
        
        // Industry filter
        const selectedIndustries = Array.from(document.querySelectorAll('#industryFilter input:checked'))
            .map(cb => cb.value);
        if (selectedIndustries.length > 0) {
            filtered = filtered.filter(agent => 
                agent.industries.some(ind => selectedIndustries.includes(ind))
            );
        }
        
        // Rating filter
        const minRating = parseFloat(document.getElementById('ratingFilter').value);
        if (minRating > 0) {
            filtered = filtered.filter(agent => agent.rating >= minRating);
        }
        
        this.renderResults(filtered);
    }
    
    handleSort(sortBy) {
        const sorted = [...this.filteredAgents];
        
        switch (sortBy) {
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'deployments':
                sorted.sort((a, b) => b.deploymentsCount - a.deploymentsCount);
                break;
            case 'updated':
                sorted.sort((a, b) => new Date(b.lastUpdatedISO) - new Date(a.lastUpdatedISO));
                break;
            case 'price':
                sorted.sort((a, b) => a.priceTiers[1].monthlyUsd - b.priceTiers[1].monthlyUsd);
                break;
            default: // relevance
                // Keep current order
                break;
        }
        
        this.renderResults(sorted);
    }
    
    clearAllFilters() {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.getElementById('ratingFilter').value = '0';
        document.getElementById('searchInput').value = '';
        this.filteredAgents = [...this.agents];
        this.renderResults(this.filteredAgents);
    }
    
    resetSearch() {
        this.clearAllFilters();
    }
    
    retryLoad() {
        this.loadAgents();
    }
    
    renderMarketplace() {
        this.showState('loading');
        
        setTimeout(() => {
            if (this.agents.length > 0) {
                this.showState('results');
                this.renderResults(this.filteredAgents);
            } else {
                this.showState('error');
            }
        }, 1000);
    }
    
    renderResults(agents) {
        const resultsGrid = document.getElementById('resultsGrid');
        if (!resultsGrid) return;
        
        if (agents.length === 0) {
            this.showState('empty');
            return;
        }
        
        this.showState('results');
        
        resultsGrid.innerHTML = agents.map(agent => this.createAgentCard(agent)).join('');
        
        // Add click handlers to cards
        resultsGrid.querySelectorAll('.agent-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                window.location.href = `agent.html?id=${agents[index].id}`;
            });
        });
    }
    
    createAgentCard(agent) {
        const stars = '★'.repeat(Math.floor(agent.rating)) + '☆'.repeat(5 - Math.floor(agent.rating));
        const topMetrics = agent.metrics.slice(0, 2);
        
        return `
            <div class="agent-card">
                <div class="agent-card-header">
                    <div class="agent-card-image">${agent.name.charAt(0)}</div>
                    <div class="agent-card-info">
                        <h3>${agent.name}</h3>
                        <div class="agent-card-vendor">${agent.vendor}</div>
                        <div class="agent-card-rating">
                            <span class="stars">${stars}</span>
                            <span>${agent.rating} (${agent.deploymentsCount} deployments)</span>
                        </div>
                    </div>
                </div>
                
                <div class="agent-card-metrics">
                    ${topMetrics.map(metric => `
                        <div class="metric-item">
                            <span class="metric-value">${metric.value}${metric.unit || ''}</span>
                            <span class="metric-label">${metric.label}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="agent-card-badges">
                    ${agent.categories.map(cat => `<span class="badge">${cat}</span>`).join('')}
                    ${agent.industries.map(ind => `<span class="badge">${ind}</span>`).join('')}
                </div>
                
                <div class="agent-card-footer">
                    <span class="view-details">View Details →</span>
                </div>
            </div>
        `;
    }
    
    showState(state) {
        const states = ['loading', 'empty', 'error', 'results'];
        states.forEach(s => {
            const element = document.getElementById(s + 'State');
            if (element) {
                element.classList.toggle('hidden', s !== state);
            }
        });
        
        const resultsGrid = document.getElementById('resultsGrid');
        if (resultsGrid) {
            resultsGrid.classList.toggle('hidden', state !== 'results');
        }
    }
    
    // Agent Detail Page Methods
    async loadAgentDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const agentId = urlParams.get('id') || window.location.hash.slice(1);
        
        if (!agentId) {
            this.showAgentError();
            return;
        }
        
        const agent = this.agents.find(a => a.id === agentId);
        if (!agent) {
            this.showAgentError();
            return;
        }
        
        this.renderAgentDetails(agent);
    }
    
    renderAgentDetails(agent) {
        // Update page title and header
        document.title = `${agent.name} - Consultant AI Marketplace`;
        document.getElementById('agentName').textContent = agent.name;
        
        // Update agent info
        document.getElementById('agentTitle').textContent = agent.name;
        document.getElementById('agentTagline').textContent = agent.tagline;
        document.getElementById('agentVendor').textContent = agent.vendor;
        document.getElementById('agentDescription').textContent = agent.description;
        document.getElementById('agentDeployments').textContent = agent.deploymentsCount.toLocaleString();
        
        // Update rating
        const stars = '★'.repeat(Math.floor(agent.rating)) + '☆'.repeat(5 - Math.floor(agent.rating));
        document.getElementById('agentRating').innerHTML = stars;
        document.getElementById('agentRatingText').textContent = `${agent.rating} (${agent.deploymentsCount} deployments)`;
        
        // Update badges
        this.renderBadges(agent);
        
        // Update metrics
        this.renderMetrics(agent);
        
        // Update integrations and compliance
        this.renderIntegrations(agent);
        this.renderCompliance(agent);
        
        // Update playbooks
        this.renderPlaybooks(agent);
        
        // Update benchmarks
        this.renderBenchmarks(agent);
        
        // Update reviews
        this.renderReviews(agent);
        
        // Update pricing
        this.renderPricing(agent);
        
        // Show content
        this.showAgentContent();
    }
    
    renderBadges(agent) {
        const badgesContainer = document.getElementById('agentBadges');
        const allBadges = [...agent.categories, ...agent.industries];
        badgesContainer.innerHTML = allBadges.map(badge => 
            `<span class="badge">${badge}</span>`
        ).join('');
    }
    
    renderMetrics(agent) {
        const metricsContainer = document.getElementById('agentMetrics');
        metricsContainer.innerHTML = agent.metrics.map(metric => `
            <div class="metric-item">
                <span class="metric-value">${metric.value}${metric.unit || ''}</span>
                <span class="metric-label">${metric.label}</span>
            </div>
        `).join('');
    }
    
    renderIntegrations(agent) {
        const integrationsContainer = document.getElementById('agentIntegrations');
        integrationsContainer.innerHTML = agent.integrations.map(integration => 
            `<span class="integration-item">${integration}</span>`
        ).join('');
    }
    
    renderCompliance(agent) {
        const complianceContainer = document.getElementById('agentCompliance');
        complianceContainer.innerHTML = agent.compliance.map(compliance => 
            `<span class="compliance-item">${compliance}</span>`
        ).join('');
    }
    
    renderPlaybooks(agent) {
        const playbooksContainer = document.getElementById('agentPlaybooks');
        const playbooks = [
            "Automate customer onboarding workflows",
            "Streamline document processing and approval",
            "Optimize resource allocation and scheduling",
            "Implement intelligent routing and escalation",
            "Create automated compliance checks",
            "Generate real-time performance reports",
            "Enable predictive maintenance scheduling",
            "Facilitate cross-team collaboration"
        ];
        
        playbooksContainer.innerHTML = playbooks.map(playbook => 
            `<div class="playbook-item">${playbook}</div>`
        ).join('');
    }
    
    renderBenchmarks(agent) {
        const benchmarksContainer = document.getElementById('agentBenchmarks');
        const benchmarks = {
            "Process Efficiency": "Typically improves by 40-60%",
            "Cost Reduction": "Average savings of 25-35%",
            "Time to Market": "Reduced by 30-50%"
        };
        
        benchmarksContainer.innerHTML = Object.entries(benchmarks).map(([metric, value]) => `
            <div><strong>${metric}:</strong> ${value}</div>
        `).join('');
    }
    
    renderReviews(agent) {
        const reviewsContainer = document.getElementById('agentReviews');
        const reviews = [
            { author: "Sarah Chen", rating: 5, date: "2024-01-15", text: "This AI agent transformed our workflow efficiency. ROI achieved in just 3 months." },
            { author: "Mike Rodriguez", rating: 5, date: "2024-01-10", text: "Excellent performance and easy integration. Our team productivity increased significantly." },
            { author: "Lisa Thompson", rating: 4, date: "2024-01-08", text: "Great tool for automation. Some learning curve but worth the investment." },
            { author: "David Kim", rating: 5, date: "2024-01-05", text: "Outstanding results. Reduced our processing time by 70%." },
            { author: "Emma Wilson", rating: 4, date: "2024-01-02", text: "Solid performance and good support. Helped streamline our operations." }
        ];
        
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <p>${review.text}</p>
            </div>
        `).join('');
    }
    
    renderPricing(agent) {
        const pricingContainer = document.getElementById('agentPricing');
        pricingContainer.innerHTML = agent.priceTiers.map((tier, index) => `
            <div class="pricing-tier ${index === 1 ? 'featured' : ''}">
                <div class="tier-name">${tier.name}</div>
                <div class="tier-price">$${tier.monthlyUsd === 0 ? '0' : tier.monthlyUsd.toLocaleString()}</div>
                <div class="tier-period">${tier.monthlyUsd === 0 ? 'Free trial' : 'per month'}</div>
                <ul class="tier-features">
                    ${tier.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <button class="cta-button" onclick="openHireModal('${tier.name}', ${tier.monthlyUsd})">
                    ${tier.monthlyUsd === 0 ? 'Start Trial' : 'Hire Agent'}
                </button>
            </div>
        `).join('');
    }
    
    switchTab(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        
        // Activate selected tab
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    }
    
    sortReviews(sortBy) {
        const reviewsContainer = document.getElementById('agentReviews');
        const reviews = Array.from(reviewsContainer.children);
        
        reviews.sort((a, b) => {
            if (sortBy === 'newest') {
                const dateA = new Date(a.querySelector('.review-date').textContent);
                const dateB = new Date(b.querySelector('.review-date').textContent);
                return dateB - dateA;
            } else {
                const ratingA = parseInt(a.querySelector('.review-rating').textContent);
                const ratingB = parseInt(b.querySelector('.review-rating').textContent);
                return ratingB - ratingA;
            }
        });
        
        reviews.forEach(review => reviewsContainer.appendChild(review));
    }
    
    showAgentContent() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('agentContent').classList.remove('hidden');
    }
    
    showAgentError() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
    }
}

// Global functions for hire modal
function openHireModal(planName, price) {
    const modal = document.getElementById('hireModal');
    const planSelect = document.getElementById('planSelect');
    
    // Update plan options
    planSelect.innerHTML = `<option value="${planName}">${planName} - $${price}/month</option>`;
    planSelect.value = planName;
    
    modal.showModal();
}

function closeHireModal() {
    const modal = document.getElementById('hireModal');
    modal.close();
}

// Initialize the marketplace when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIMarketplace();
});

// Handle hire form submission
function handleHireSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const plan = formData.get('planSelect');
    const email = formData.get('workEmail');
    const note = formData.get('note');
    
    // Show success message
    alert(`Thank you for your interest! We'll contact you at ${email} about the ${plan} plan.`);
    
    // Close modal
    closeHireModal();
    
    // Reset form
    event.target.reset();
}
