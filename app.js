// ===========================================
// SPA ROUTER
// ===========================================

class SPARouter {
    constructor() {
        this.routes = {
            '/': this.homePage,
            '/about': this.aboutPage,
            '/mission': this.missionPage,
            '/team': this.teamPage,
            '/contact': this.contactPage,
            '/donate': this.donatePage
        };
        
        this.app = document.getElementById('app');
        this.init();
    }
    
    init() {
        // Handle initial load
        this.navigate(window.location.pathname);
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname);
        });
        
        // Handle link clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
                e.preventDefault();
                const link = e.target.closest('.nav-link');
                const path = link.getAttribute('href');
                this.navigate(path);
            }
        });
        
        // Initialize theme manager
        this.themeManager = new ThemeManager();
        
        // Initialize mobile menu
        this.mobileMenu = new MobileMenu();
        
        // Initialize cursor trail (only on desktop)
        if (window.innerWidth > 768) {
            this.cursorTrail = new CursorTrail();
        }
        
        // Add event listener for window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && !this.cursorTrail) {
                this.cursorTrail = new CursorTrail();
            }
        });
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
    }
    
    navigate(path) {
        // Clean up path (remove .html extension if present)
        if (path.endsWith('.html')) {
            path = path.replace('.html', '');
        }
        
        // Handle root path
        if (path === '/index' || path === '/index.html') {
            path = '/';
        }
        
        // Update URL without page reload
        if (window.location.pathname !== path) {
            window.history.pushState({}, '', path);
        }
        
        // Update active link in navbar
        this.updateActiveLink(path);
        
        // Render the appropriate page
        this.renderPage(path);
    }
    
    updateActiveLink(path) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active-link');
        });
        
        // Add active class to current path link
        const activeLink = document.querySelector(`.nav-link[href="${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active-link');
        } else if (path === '/' && document.querySelector('.nav-link[href="/"]')) {
            document.querySelector('.nav-link[href="/"]').classList.add('active-link');
        }
    }
    
    renderPage(path) {
        // Clear the app container
        if (this.app) {
            this.app.innerHTML = '';
            
            // Add page transition class
            this.app.classList.add('page-transition');
            
            // Remove transition class after animation completes
            setTimeout(() => {
                this.app.classList.remove('page-transition');
            }, 500);
            
            // Call the appropriate page function
            if (this.routes[path]) {
                this.routes[path].call(this);
            } else {
                // Fallback to home page for unknown routes
                this.homePage();
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Initialize page-specific components
            setTimeout(() => this.initPageComponents(), 100);
        }
    }
    
    initPageComponents() {
        // Initialize carousel on home page
        if (document.getElementById('hero-carousel')) {
            this.initCarousel();
        }
        
        // Initialize team cards on team page
        if (document.querySelector('.team-card')) {
            this.initTeamCards();
        }
        
        // Initialize donation options on donate page
        if (document.querySelector('.donation-option')) {
            this.initDonationOptions();
        }
    }
    
    setupGlobalEventListeners() {
        // Handle form submissions globally
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'contact-form' || e.target.id === 'donation-form') {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });
        
        // Handle modal close
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeTeamModal();
            });
        }
        
        // Close modal on outside click
        const modal = document.getElementById('team-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeTeamModal();
                }
            });
        }
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTeamModal();
            }
        });
    }
    
    handleFormSubmit(form) {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        let messageElement;
        let messageText;
        
        if (form.id === 'contact-form') {
            messageElement = document.getElementById('form-message');
            messageText = 'Thank you for your message! We will get back to you soon.';
        } else if (form.id === 'donation-form') {
            messageElement = document.getElementById('donation-message');
            messageText = `Thank you for your donation of ₹${data.amount}! Your support helps us continue our important work.`;
        }
        
        if (messageElement) {
            // Show success message
            messageElement.textContent = messageText;
            messageElement.className = 'mt-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            messageElement.classList.remove('hidden');
            
            // Reset form
            form.reset();
            
            // Reset donation amount if it's the donation form
            if (form.id === 'donation-form') {
                const donationAmountInput = document.getElementById('donation-amount');
                if (donationAmountInput) {
                    donationAmountInput.value = '1000';
                }
                
                // Remove highlights from donation options
                document.querySelectorAll('.donation-option').forEach(opt => {
                    opt.classList.remove('ring-2', 'ring-offset-2', 'ring-green-500');
                });
            }
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageElement.classList.add('hidden');
            }, 5000);
        }
    }
    
    // ===========================================
    // PAGE RENDERING FUNCTIONS
    // ===========================================
    
    homePage() {
        this.app.innerHTML = `
            <!-- Hero Section with Carousel -->
            <section class="relative h-screen overflow-hidden">
                <div id="hero-carousel" class="h-full">
                    ${carouselData.map((slide, index) => `
                        <div class="hero-slide ${index === 0 ? 'active' : ''}" 
                             style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('${slide.image}')">
                            <div class="absolute inset-0 flex items-center">
                                <div class="container mx-auto px-4">
                                    <div class="max-w-2xl glassmorphism p-8 md:p-12">
                                        <h1 class="heading-font text-4xl md:text-5xl font-bold text-white mb-4">${slide.title}</h1>
                                        <p class="text-xl text-gray-200 mb-8">${slide.description}</p>
                                        <a href="/donate" class="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-lg">Support Our Cause</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Carousel Controls -->
                <button id="prev-slide" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button id="next-slide" class="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors">
                    <i class="fas fa-chevron-right"></i>
                </button>
                
                <!-- Carousel Indicators -->
                <div class="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
                    ${carouselData.map((_, index) => `
                        <button class="carousel-indicator w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-white/50'} hover:bg-green-400 transition-colors" data-index="${index}"></button>
                    `).join('')}
                </div>
            </section>
            
            <!-- About Summary Section -->
            <section class="py-16 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div class="container mx-auto px-4">
                    <div class="max-w-4xl mx-auto text-center mb-12">
                        <h2 class="heading-font text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">About Our Trust</h2>
                        <p class="text-lg text-gray-600 dark:text-gray-300">
                            ${trustInfo.name} is a public charitable trust established on ${trustInfo.establishedDate}. 
                            Our mission is to protect cow wealth, promote animal welfare, and serve the community through various charitable initiatives.
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="glassmorphism p-6 rounded-xl">
                            <div class="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                                <i class="fas fa-cow text-green-600 dark:text-green-300 text-2xl"></i>
                            </div>
                            <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-3">Cow Protection</h3>
                            <p class="text-gray-600 dark:text-gray-300">We provide shelter, medical care, and protection to cows, preventing them from slaughter and neglect.</p>
                        </div>
                        
                        <div class="glassmorphism p-6 rounded-xl">
                            <div class="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                                <i class="fas fa-hand-holding-heart text-blue-600 dark:text-blue-300 text-2xl"></i>
                            </div>
                            <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-3">Animal Welfare</h3>
                            <p class="text-gray-600 dark:text-gray-300">Rescue, rehabilitation, and medical care for all animals in need, with 24/7 veterinary services.</p>
                        </div>
                        
                        <div class="glassmorphism p-6 rounded-xl">
                            <div class="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-4">
                                <i class="fas fa-graduation-cap text-amber-600 dark:text-amber-300 text-2xl"></i>
                            </div>
                            <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-3">Community Service</h3>
                            <p class="text-gray-600 dark:text-gray-300">Educational programs, health initiatives, and support for women, children, and marginalized communities.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Parallax Image Section -->
            <section class="parallax py-24" style="background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://www.zappyworks.com/mad-banner.jpg');">
                <div class="container mx-auto px-4 text-center">
                    <div class="max-w-3xl mx-auto glassmorphism p-8 md:p-12">
                        <h2 class="heading-font text-3xl md:text-4xl font-bold text-white mb-6">Make a Difference Today</h2>
                        <p class="text-xl text-gray-200 mb-8">
                            Your support helps us protect cows, care for animals in need, and serve our community. 
                            Every contribution makes a real impact.
                        </p>
                        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <a href="/donate" class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-lg">Donate Now</a>
                            <a href="/mission" class="bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-full transition-colors">Learn More</a>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Quick Stats -->
            <section class="py-16 bg-white dark:bg-gray-900">
                <div class="container mx-auto px-4">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">2+</div>
                            <div class="text-gray-600 dark:text-gray-300">Trustees</div>
                        </div>
                        <div>
                            <div class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">All India</div>
                            <div class="text-gray-600 dark:text-gray-300">Area of Operation</div>
                        </div>
                        <div>
                            <div class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">10+</div>
                            <div class="text-gray-600 dark:text-gray-300">Objectives</div>
                        </div>
                        <div>
                            <div class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">2025</div>
                            <div class="text-gray-600 dark:text-gray-300">Year Established</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    aboutPage() {
        this.app.innerHTML = `
            <section class="py-16">
                <div class="container mx-auto px-4">
                    <div class="max-w-4xl mx-auto">
                        <h1 class="heading-font text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">About Our Trust</h1>
                        
                        <div class="glassmorphism p-8 rounded-xl mb-12">
                            <h2 class="heading-font text-2xl font-bold text-gray-800 dark:text-white mb-4">${trustInfo.name}</h2>
                            <p class="text-gray-600 dark:text-gray-300 mb-6">
                                Established on <span class="font-semibold">${trustInfo.establishedDate}</span>, our trust is a public charitable organization 
                                dedicated to cow protection, animal welfare, and community service. We operate across India 
                                with a mission to create a compassionate society that respects and protects all living beings.
                            </p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-3">Registration Details</h3>
                                    <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                        <li><span class="font-medium">Certificate No:</span> ${trustInfo.certificateNo}</li>
                                        <li><span class="font-medium">Registration No:</span> ${trustInfo.registrationNo}</li>
                                        <li><span class="font-medium">Area of Operation:</span> ${trustInfo.areaOfOperation}</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-3">Address</h3>
                                    <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                        <li><span class="font-medium">Registered Office:</span> ${trustInfo.registeredAddress}</li>
                                        <li><span class="font-medium">Administration Office:</span> ${trustInfo.administrationAddress}</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-4">Trust Structure</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-6">
                                ${trustInfo.trusteesInfo} The Trust is irrevocable and governed by the provisions of the Indian Trusts Act, 1882.
                            </p>
                            
                            <div class="mt-8">
                                <a href="/mission" class="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-md mr-4">Our Mission</a>
                                <a href="/team" class="inline-block border-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 font-medium py-3 px-8 rounded-full transition-colors">Meet Our Team</a>
                            </div>
                        </div>
                        
                        <!-- Parallax Image -->
                        <div class="parallax rounded-xl h-64 mb-12" style="background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1573995974707-9c6b6b2d8c6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');">
                            <div class="h-full flex items-center justify-center text-center">
                                <div class="p-6">
                                    <h3 class="heading-font text-2xl font-bold text-white mb-2">Committed to Service</h3>
                                    <p class="text-gray-200">Our trust is built on principles of compassion, dedication, and service to all living beings.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    missionPage() {
        this.app.innerHTML = `
            <section class="py-16">
                <div class="container mx-auto px-4">
                    <h1 class="heading-font text-4xl font-bold text-gray-800 dark:text-white mb-12 text-center">Our Mission & Objectives</h1>
                    
                    <div class="max-w-6xl mx-auto">
                        <!-- Gaushala Objectives -->
                        <div class="glassmorphism p-8 rounded-xl mb-10">
                            <div class="flex items-center mb-6">
                                <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                                    <i class="fas fa-cow text-green-600 dark:text-green-300 text-xl"></i>
                                </div>
                                <h2 class="heading-font text-2xl font-bold text-gray-800 dark:text-white">Gaushala & Cow Protection</h2>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                ${trustInfo.objectives.gaushala.map(obj => `
                                    <div class="flex items-start">
                                        <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                                        <p class="text-gray-600 dark:text-gray-300">${obj}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Animal Welfare Objectives -->
                        <div class="glassmorphism p-8 rounded-xl mb-10">
                            <div class="flex items-center mb-6">
                                <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                                    <i class="fas fa-paw text-blue-600 dark:text-blue-300 text-xl"></i>
                                </div>
                                <h2 class="heading-font text-2xl font-bold text-gray-800 dark:text-white">Animal Welfare</h2>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                ${trustInfo.objectives.animalWelfare.map(obj => `
                                    <div class="flex items-start">
                                        <i class="fas fa-check text-blue-500 mt-1 mr-3"></i>
                                        <p class="text-gray-600 dark:text-gray-300">${obj}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Education & Community Objectives -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="glassmorphism p-8 rounded-xl">
                                <div class="flex items-center mb-6">
                                    <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-4">
                                        <i class="fas fa-graduation-cap text-amber-600 dark:text-amber-300 text-xl"></i>
                                    </div>
                                    <h2 class="heading-font text-xl font-bold text-gray-800 dark:text-white">Education & Culture</h2>
                                </div>
                                
                                <div class="space-y-4">
                                    ${trustInfo.objectives.education.slice(0, 4).map(obj => `
                                        <div class="flex items-start">
                                            <i class="fas fa-check text-amber-500 mt-1 mr-3"></i>
                                            <p class="text-gray-600 dark:text-gray-300">${obj}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="glassmorphism p-8 rounded-xl">
                                <div class="flex items-center mb-6">
                                    <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                                        <i class="fas fa-hands-helping text-purple-600 dark:text-purple-300 text-xl"></i>
                                    </div>
                                    <h2 class="heading-font text-xl font-bold text-gray-800 dark:text-white">Community Service</h2>
                                </div>
                                
                                <div class="space-y-4">
                                    ${trustInfo.objectives.community.slice(0, 4).map(obj => `
                                        <div class="flex items-start">
                                            <i class="fas fa-check text-purple-500 mt-1 mr-3"></i>
                                            <p class="text-gray-600 dark:text-gray-300">${obj}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Call to Action -->
                        <div class="text-center mt-16">
                            <h3 class="heading-font text-2xl font-bold text-gray-800 dark:text-white mb-6">Join Us in Our Mission</h3>
                            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Together, we can make a difference in the lives of animals and communities across India.
                            </p>
                            <a href="/donate" class="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-10 rounded-full transition-colors shadow-lg text-lg">Support Our Work</a>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    teamPage() {
        this.app.innerHTML = `
            <section class="py-16">
                <div class="container mx-auto px-4">
                    <h1 class="heading-font text-4xl font-bold text-gray-800 dark:text-white mb-4 text-center">Our Team</h1>
                    <p class="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                        Meet the dedicated individuals who lead our trust and work tirelessly to fulfill our mission.
                    </p>
                    
                    <div class="max-w-6xl mx-auto">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                            ${teamData.map(member => `
                                <div class="team-card glassmorphism p-6 rounded-xl cursor-pointer hover:shadow-xl transition-all duration-300" data-id="${member.id}">
                                    <div class="flex flex-col md:flex-row items-center md:items-start">
                                        <div class="md:w-1/3 mb-6 md:mb-0">
                                            <img src="${member.photo}" alt="${member.name}" class="w-48 h-48 object-cover rounded-full mx-auto shadow-md">
                                        </div>
                                        <div class="md:w-2/3 md:pl-8">
                                            <h3 class="heading-font text-2xl font-bold text-gray-800 dark:text-white mb-2">${member.name}</h3>
                                            <p class="text-green-600 dark:text-green-400 font-medium mb-4">${member.designation}</p>
                                            <p class="text-gray-600 dark:text-gray-300 mb-6 italic">"${member.message}"</p>
                                            <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                <span><i class="fas fa-briefcase mr-1"></i> ${member.experience}</span>
                                                <span><i class="fas fa-graduation-cap mr-1"></i> ${member.education}</span>
                                            </div>
                                            <button class="view-details-btn text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors" data-id="${member.id}">
                                                View Full Profile <i class="fas fa-arrow-right ml-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- Trustees Information -->
                        <div class="glassmorphism p-8 rounded-xl mb-12">
                            <h2 class="heading-font text-2xl font-bold text-gray-800 dark:text-white mb-6">Trust Governance</h2>
                            <p class="text-gray-600 dark:text-gray-300 mb-6">
                                ${trustInfo.trusteesInfo} The Board of Trustees has the power to increase the total number 
                                of Trustees up to a maximum of 9 trustees.
                            </p>
                            <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                                <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-3">Key Responsibilities</h3>
                                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li><i class="fas fa-check-circle text-green-500 mr-2"></i> Administer the Trust, its properties and affairs</li>
                                    <li><i class="fas fa-check-circle text-green-500 mr-2"></i> Ensure Trust funds are used solely for Trust objectives</li>
                                    <li><i class="fas fa-check-circle text-green-500 mr-2"></i> Maintain true and correct accounts of the Trust</li>
                                    <li><i class="fas fa-check-circle text-green-500 mr-2"></i> Make and rescind rules for management of the Trust</li>
                                </ul>
                            </div>
                        </div>
                        
                        <!-- Call to Action -->
                        <div class="text-center">
                            <h3 class="heading-font text-2xl font-bold text-gray-800 dark:text-white mb-6">Want to Join Our Mission?</h3>
                            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                We welcome volunteers and supporters who share our vision for animal welfare and community service.
                            </p>
                            <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <a href="/contact" class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full transition-colors shadow-md">Contact Us</a>
                                <a href="/donate" class="border-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 font-medium py-3 px-8 rounded-full transition-colors">Support Financially</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    contactPage() {
        this.app.innerHTML = `
            <section class="py-16">
                <div class="container mx-auto px-4">
                    <div class="max-w-6xl mx-auto">
                        <h1 class="heading-font text-4xl font-bold text-gray-800 dark:text-white mb-12 text-center">Contact Us</h1>
                        
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <!-- Contact Information -->
                            <div>
                                <div class="glassmorphism p-8 rounded-xl mb-8">
                                    <h2 class="heading-font text-2xl font-bold text-gray-800 dark:text-white mb-6">Get in Touch</h2>
                                    <p class="text-gray-600 dark:text-gray-300 mb-8">
                                        We'd love to hear from you. Whether you want to volunteer, donate, or learn more about our work, 
                                        please reach out to us using the information below.
                                    </p>
                                    
                                    <div class="space-y-6">
                                        <div class="flex items-start">
                                            <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                                                <i class="fas fa-map-marker-alt text-green-600 dark:text-green-300"></i>
                                            </div>
                                            <div>
                                                <h3 class="font-bold text-gray-800 dark:text-white mb-1">Registered Office</h3>
                                                <p class="text-gray-600 dark:text-gray-300">${trustInfo.registeredAddress}</p>
                                            </div>
                                        </div>
                                        
                                        <div class="flex items-start">
                                            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                                                <i class="fas fa-building text-blue-600 dark:text-blue-300"></i>
                                            </div>
                                            <div>
                                                <h3 class="font-bold text-gray-800 dark:text-white mb-1">Administration Office</h3>
                                                <p class="text-gray-600 dark:text-gray-300">${trustInfo.administrationAddress}</p>
                                            </div>
                                        </div>
                                        
                                        <div class="flex items-start">
                                            <div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-4">
                                                <i class="fas fa-phone text-amber-600 dark:text-amber-300"></i>
                                            </div>
                                            <div>
                                                <h3 class="font-bold text-gray-800 dark:text-white mb-1">Phone</h3>
                                                <p class="text-gray-600 dark:text-gray-300">+91-XXXXXXXXXX</p>
                                            </div>
                                        </div>
                                        
                                        <div class="flex items-start">
                                            <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                                                <i class="fas fa-envelope text-purple-600 dark:text-purple-300"></i>
                                            </div>
                                            <div>
                                                <h3 class="font-bold text-gray-800 dark:text-white mb-1">Email</h3>
                                                <p class="text-gray-600 dark:text-gray-300">info@example.org</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Map Placeholder -->
                                <div class="glassmorphism p-8 rounded-xl">
                                    <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-4">Find Us</h3>
                                    <div class="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center">
                                        <div class="text-center">
                                            <i class="fas fa-map-marked-alt text-4xl text-gray-400 dark:text-gray-500 mb-3"></i>
                                            <p class="text-gray-500 dark:text-gray-400">Map location would appear here</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Contact Form -->
                            <div>
                                <div class="glassmorphism p-8 rounded-xl">
                                    <h2 class="heading-font text-2xl font-bold text-gray-800 dark:text-white mb-6">Send Us a Message</h2>
                                    
                                    <form id="contact-form" class="space-y-6">
                                        <div>
                                            <label for="name" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Full Name</label>
                                            <input type="text" id="name" name="name" required class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                                        </div>
                                        
                                        <div>
                                            <label for="email" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email Address</label>
                                            <input type="email" id="email" name="email" required class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                                        </div>
                                        
                                        <div>
                                            <label for="phone" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Phone Number</label>
                                            <input type="tel" id="phone" name="phone" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                                        </div>
                                        
                                        <div>
                                            <label for="subject" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Subject</label>
                                            <select id="subject" name="subject" required class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                                                <option value="" disabled selected>Select a subject</option>
                                                <option value="donation">Donation Inquiry</option>
                                                <option value="volunteer">Volunteer Opportunity</option>
                                                <option value="partnership">Partnership/ Collaboration</option>
                                                <option value="information">General Information</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label for="message" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Message</label>
                                            <textarea id="message" name="message" rows="5" required class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                                        </div>
                                        
                                        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md">
                                            Send Message
                                        </button>
                                    </form>
                                    
                                    <div id="form-message" class="mt-6 hidden p-4 rounded-lg"></div>
                                </div>
                                
                                <!-- Additional Info -->
                                <div class="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                    <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-3">Other Ways to Connect</h3>
                                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                                        Follow us on social media to stay updated on our activities and events.
                                    </p>
                                    <div class="flex space-x-4">
                                        <a href="#" class="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white transition-colors">
                                            <i class="fab fa-facebook-f"></i>
                                        </a>
                                        <a href="#" class="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors">
                                            <i class="fab fa-twitter"></i>
                                        </a>
                                        <a href="#" class="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white transition-colors">
                                            <i class="fab fa-instagram"></i>
                                        </a>
                                        <a href="#" class="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors">
                                            <i class="fab fa-youtube"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    donatePage() {
        this.app.innerHTML = `
            <section class="py-16">
                <div class="container mx-auto px-4">
                    <div class="max-w-4xl mx-auto">
                        <h1 class="heading-font text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">Support Our Cause</h1>
                        <p class="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                            Your donation helps us protect cows, care for animals in need, and serve our community through various charitable initiatives.
                        </p>
                        
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            <!-- Donation Options -->
                            <div class="glassmorphism p-8 rounded-xl text-center">
                                <div class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
                                    <i class="fas fa-rupee-sign text-green-600 dark:text-green-300 text-2xl"></i>
                                </div>
                                <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-4">One-Time Donation</h3>
                                <p class="text-gray-600 dark:text-gray-300 mb-6">
                                    Make a single contribution to support our ongoing work and specific projects.
                                </p>
                                <button class="donation-option bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-full transition-colors w-full" data-amount="1000">
                                    Donate ₹1,000
                                </button>
                            </div>
                            
                            <div class="glassmorphism p-8 rounded-xl text-center">
                                <div class="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-6">
                                    <i class="fas fa-calendar-check text-blue-600 dark:text-blue-300 text-2xl"></i>
                                </div>
                                <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-4">Monthly Support</h3>
                                <p class="text-gray-600 dark:text-gray-300 mb-6">
                                    Become a monthly donor to provide consistent support for our long-term initiatives.
                                </p>
                                <button class="donation-option bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-colors w-full" data-amount="500">
                                    ₹500 Monthly
                                </button>
                            </div>
                            
                            <div class="glassmorphism p-8 rounded-xl text-center">
                                <div class="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mx-auto mb-6">
                                    <i class="fas fa-hand-holding-heart text-amber-600 dark:text-amber-300 text-2xl"></i>
                                </div>
                                <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-4">Custom Amount</h3>
                                <p class="text-gray-600 dark:text-gray-300 mb-6">
                                    Choose your own donation amount that fits your capacity to give.
                                </p>
                                <button id="custom-donation" class="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-full transition-colors w-full">
                                    Choose Amount
                                </button>
                            </div>
                        </div>
                        
                        <!-- Donation Form -->
                        <div class="glassmorphism p-8 rounded-xl mb-12">
                            <h2 class="heading-font text-2xl font-bold text-gray-800 dark:text-white mb-6">Make a Donation</h2>
                            
                            <form id="donation-form" class="space-y-6">
                                <div>
                                    <label for="donation-amount" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Donation Amount (₹)</label>
                                    <div class="flex">
                                        <span class="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                            ₹
                                        </span>
                                        <input type="number" id="donation-amount" name="amount" min="1" required value="1000" class="flex-1 px-4 py-3 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label for="donor-name" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Full Name</label>
                                        <input type="text" id="donor-name" name="name" required class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                    
                                    <div>
                                        <label for="donor-email" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email Address</label>
                                        <input type="email" id="donor-email" name="email" required class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    </div>
                                </div>
                                
                                <div>
                                    <label for="donor-phone" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Phone Number</label>
                                    <input type="tel" id="donor-phone" name="phone" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                                </div>
                                
                                <div>
                                    <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Donation Type</label>
                                    <div class="flex space-x-6">
                                        <label class="flex items-center">
                                            <input type="radio" name="donation-type" value="one-time" checked class="mr-2 text-green-600 focus:ring-green-500">
                                            <span class="text-gray-600 dark:text-gray-300">One-Time</span>
                                        </label>
                                        <label class="flex items-center">
                                            <input type="radio" name="donation-type" value="monthly" class="mr-2 text-green-600 focus:ring-green-500">
                                            <span class="text-gray-600 dark:text-gray-300">Monthly</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div class="flex items-center mb-4">
                                        <i class="fas fa-info-circle text-green-600 mr-3"></i>
                                        <p class="text-gray-600 dark:text-gray-300">
                                            As per the Trust Deed, all donations are used solely for the charitable objectives of the Trust.
                                        </p>
                                    </div>
                                    <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors shadow-lg text-lg">
                                        Donate Now
                                    </button>
                                </div>
                            </form>
                            
                            <div id="donation-message" class="mt-6 hidden p-4 rounded-lg"></div>
                        </div>
                        
                        <!-- Trust Information -->
                        <div class="bg-green-50 dark:bg-green-900/20 p-8 rounded-xl">
                            <h3 class="heading-font text-xl font-bold text-gray-800 dark:text-white mb-4">Your Donation Supports</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li><i class="fas fa-check text-green-500 mr-2"></i> Cow protection and care</li>
                                    <li><i class="fas fa-check text-green-500 mr-2"></i> Animal rescue and rehabilitation</li>
                                    <li><i class="fas fa-check text-green-500 mr-2"></i> Veterinary services and mobile clinics</li>
                                    <li><i class="fas fa-check text-green-500 mr-2"></i> Community education programs</li>
                                </ul>
                                <ul class="space-y-2 text-gray-600 dark:text-gray-300">
                                    <li><i class="fas fa-check text-green-500 mr-2"></i> Gaushala maintenance and operations</li>
                                    <li><i class="fas fa-check text-green-500 mr-2"></i> Environmental protection initiatives</li>
                                    <li><i class="fas fa-check text-green-500 mr-2"></i> Women and child welfare programs</li>
                                    <li><i class="fas fa-check text-green-500 mr-2"></i> Disaster relief efforts</li>
                                </ul>
                            </div>
                            <p class="text-gray-600 dark:text-gray-300 text-sm">
                                <i class="fas fa-certificate text-green-500 mr-2"></i>
                                ${trustInfo.name} is a registered public charitable trust (Certificate No: ${trustInfo.certificateNo}). 
                                All donations are eligible for tax exemption under Section 80G of the Income Tax Act, 1961.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
    
    // ===========================================
    // COMPONENT INITIALIZATION METHODS
    // ===========================================
    
    initCarousel() {
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        
        if (!slides.length || !indicators.length) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Function to show a specific slide
        const showSlide = (index) => {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('bg-green-500'));
            
            // Show current slide
            slides[index].classList.add('active');
            indicators[index].classList.add('bg-green-500');
            currentSlide = index;
        };
        
        // Next slide function
        const nextSlide = () => {
            let nextIndex = currentSlide + 1;
            if (nextIndex >= totalSlides) nextIndex = 0;
            showSlide(nextIndex);
        };
        
        // Previous slide function
        const prevSlide = () => {
            let prevIndex = currentSlide - 1;
            if (prevIndex < 0) prevIndex = totalSlides - 1;
            showSlide(prevIndex);
        };
        
        // Event listeners for buttons
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => showSlide(index));
        });
        
        // Auto slide every 5 seconds
        this.carouselInterval = setInterval(nextSlide, 5000);
        
        // Pause auto-slide on hover
        const carousel = document.getElementById('hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                if (this.carouselInterval) {
                    clearInterval(this.carouselInterval);
                }
            });
            
            carousel.addEventListener('mouseleave', () => {
                this.carouselInterval = setInterval(nextSlide, 5000);
            });
        }
    }
    
    initTeamCards() {
        const teamCards = document.querySelectorAll('.team-card');
        const viewButtons = document.querySelectorAll('.view-details-btn');
        
        // Function to open modal with team member details
        const openModal = (memberId) => {
            const member = teamData.find(m => m.id === memberId);
            if (!member) return;
            
            // Populate modal with member data
            document.getElementById('modal-name').textContent = member.name;
            document.getElementById('modal-designation').textContent = member.designation;
            document.getElementById('modal-photo').src = member.photo;
            document.getElementById('modal-photo').alt = member.name;
            document.getElementById('modal-experience').textContent = member.experience;
            document.getElementById('modal-education').textContent = member.education;
            document.getElementById('modal-message').textContent = member.message;
            document.getElementById('modal-bio').textContent = member.bio;
            
            // Show modal
            const modal = document.getElementById('team-modal');
            modal.classList.remove('hidden');
            document.body.classList.add('modal-open');
        };
        
        // Add event listeners to team cards
        teamCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the view details button
                if (!e.target.classList.contains('view-details-btn') && !e.target.closest('.view-details-btn')) {
                    const memberId = parseInt(card.getAttribute('data-id'));
                    openModal(memberId);
                }
            });
        });
        
        // Add event listeners to view buttons
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                const memberId = parseInt(button.getAttribute('data-id'));
                openModal(memberId);
            });
        });
    }
    
    initDonationOptions() {
        const donationOptions = document.querySelectorAll('.donation-option');
        const customDonationBtn = document.getElementById('custom-donation');
        const donationAmountInput = document.getElementById('donation-amount');
        
        if (!donationOptions.length || !donationAmountInput) return;
        
        // Set donation amount when option buttons are clicked
        donationOptions.forEach(option => {
            option.addEventListener('click', () => {
                const amount = option.getAttribute('data-amount');
                donationAmountInput.value = amount;
                
                // Highlight selected option
                donationOptions.forEach(opt => {
                    opt.classList.remove('ring-2', 'ring-offset-2', 'ring-green-500');
                });
                option.classList.add('ring-2', 'ring-offset-2', 'ring-green-500');
                
                // Set donation type to one-time for fixed amounts
                document.querySelector('input[name="donation-type"][value="one-time"]').checked = true;
            });
        });
        
        // Custom donation button
        if (customDonationBtn) {
            customDonationBtn.addEventListener('click', () => {
                donationAmountInput.focus();
                donationAmountInput.value = '';
                
                // Remove highlight from other options
                donationOptions.forEach(opt => {
                    opt.classList.remove('ring-2', 'ring-offset-2', 'ring-green-500');
                });
            });
        }
    }
    
    closeTeamModal() {
        const modal = document.getElementById('team-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-open');
        }
    }
}

// ===========================================
// THEME MANAGER
// ===========================================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeToggleMobile = document.getElementById('theme-toggle-mobile');
        this.themeIcon = document.getElementById('theme-icon');
        this.themeIconMobile = document.getElementById('theme-icon-mobile');
        
        this.init();
    }
    
    init() {
        // Check for saved theme or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }
        
        // Add event listeners
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        if (this.themeToggleMobile) {
            this.themeToggleMobile.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.enableLightMode();
                }
            }
        });
    }
    
    enableDarkMode() {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        this.updateIcons('dark');
    }
    
    enableLightMode() {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        this.updateIcons('light');
    }
    
    toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            this.enableLightMode();
        } else {
            this.enableDarkMode();
        }
    }
    
    updateIcons(theme) {
        if (theme === 'dark') {
            if (this.themeIcon) this.themeIcon.className = 'fas fa-sun text-yellow-300';
            if (this.themeIconMobile) this.themeIconMobile.className = 'fas fa-sun text-yellow-300';
        } else {
            if (this.themeIcon) this.themeIcon.className = 'fas fa-moon text-gray-700';
            if (this.themeIconMobile) this.themeIconMobile.className = 'fas fa-moon text-gray-700';
        }
    }
}

// ===========================================
// MOBILE MENU
// ===========================================

class MobileMenu {
    constructor() {
        this.menuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        
        this.init();
    }
    
    init() {
        if (this.menuButton) {
            this.menuButton.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking a link
        document.addEventListener('click', (e) => {
            if (this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
                if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
                    this.mobileMenu.classList.add('hidden');
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
                this.mobileMenu.classList.add('hidden');
            }
        });
    }
    
    toggleMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.classList.toggle('hidden');
        }
    }
}

// ===========================================
// CURSOR TRAIL
// ===========================================

class CursorTrail {
    constructor() {
        this.canvas = document.getElementById('cursor-trail');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 20;
        this.hue = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.resize();
        this.init();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
        
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Create particles
            for (let i = 0; i < 3; i++) {
                this.particles.push(new Particle(
                    this.mouseX,
                    this.mouseY,
                    this.ctx,
                    this.hue
                ));
            }
            
            // Limit number of particles
            if (this.particles.length > this.maxParticles) {
                this.particles = this.particles.slice(this.particles.length - this.maxParticles);
            }
        });
        
        // Animation loop
        this.animate();
    }
    
    animate() {
        // Clear canvas with slight transparency for trail effect
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();
            
            // Remove particles that have faded out
            if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }
        
        // Cycle hue for color change
        this.hue += 0.5;
        if (this.hue > 360) this.hue = 0;
        
        // Request next frame
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y, ctx, hue) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.hue = hue;
        this.alpha = 1;
        this.decay = Math.random() * 0.05 + 0.02;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        this.size *= 0.97;
    }
    
    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}

// ===========================================
// INITIALIZE APPLICATION
// ===========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize SPA Router
    const router = new SPARouter();
    
    // Make router globally available for debugging
    window.router = router;
});