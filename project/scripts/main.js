// (()=>{
//     try {
//         const yearSpan = document.getElementById('currentyear');
//         if (yearSpan) {
//         yearSpan.textContent = new Date().getFullYear();
//         }
    
//         const lm = document.getElementById('lastModified');
//         if (lm) {
//         lm.textContent = 'Last modified: ' + document.lastModified;
//         }
//     } catch (err) {
//         console.error('getdates.js error:', err);
//     }
// })();

// AB7ec - Main JavaScript File
// Complies with all project requirements

// === INITIAL CONFIGURATION ===
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // 1. Set current year in footer
    setCurrentYear();
    
    // 2. Initialize mobile menu
    initMobileMenu();
    
    // 3. Initialize service history
    initServiceHistory();
    
    // 4. Initialize contact form (if on the page)
    if (document.getElementById('contact-form')) {
        initContactForm();
    }
    
    // 5. Initialize technical guides (if on the page)
    if (document.getElementById('guides-container')) {
        initTechnicalGuides();
    }
    
    // 6. Initialize pricing system (if on the page)
    if (document.getElementById('pricing-container')) {
        initPricingSystem();
    }
    
    // 7. Configure lazy loading of images
    initLazyLoading();
    
    // 8. Show complete load notification
    console.log('AB7ec - System initialized correctly');
}

// === FUNCTION 1: Set current year ===
function setCurrentYear() {
    const yearElement = document.getElementById('currentyear');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}

// === FUNCTION 2: Mobile menu ===
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    // Function to toggle menu
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Block scroll when menu is open
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }
    
    // Function to close menu
    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
            closeMenu();
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

// === FUNCTION 3: Service history (localStorage) ===
function initServiceHistory() {
    const historyContainer = document.getElementById('service-history-container');
    if (!historyContainer) return;
    
    // Sample services array
    const sampleServices = [
        {
            id: 1,
            name: 'Diagnosis of slow laptop',
            date: '2024-10-15',
            status: 'completed',
            description: 'Complete system diagnosis and optimization'
        },
        {
            id: 2,
            name: 'Screen replacement',
            date: '2024-10-20',
            status: 'pending',
            description: 'Dell Inspiron 15 laptop screen'
        },
        {
            id: 3,
            name: 'Data recovery',
            date: '2024-10-25',
            status: 'completed',
            description: 'Recovery of files from damaged hard drives'
        }
    ];
    
    // Get services from localStorage or use sample
    let services = JSON.parse(localStorage.getItem('ab7ec_services')) || sampleServices;
    
    // Save initial services if they don't exist
    if (!localStorage.getItem('ab7ec_services')) {
        localStorage.setItem('ab7ec_services', JSON.stringify(services));
    }
    
    // Render services
    renderServices(services);
    
    // Configure buttons
    setupServiceButtons();
    
    // Update statistics
    updateServiceStats(services);
}

// Function to render services using template literals
function renderServices(services) {
    const historyContainer = document.getElementById('service-history-container');
    
    if (!services || services.length === 0) {
        historyContainer.innerHTML = `
            <div class="no-services">
                <p>No services registered. Add a new service to begin.</p>
            </div>
        `;
        return;
    }
    
    // Use template literal exclusively to build HTML
    const servicesHTML = services.map(service => {
        const statusText = service.status === 'completed' ? 'Completed' : 'Pending';
        const statusClass = service.status === 'completed' ? 'completed' : 'pending';
        
        return `
            <div class="service-item ${statusClass}" data-id="${service.id}">
                <div class="service-info">
                    <h4>${service.name}</h4>
                    <p><strong>Date:</strong> ${formatDate(service.date)}</p>
                    <p><strong>Description:</strong> ${service.description}</p>
                    <p><strong>Status:</strong> <span class="status-${service.status}">${statusText}</span></p>
                </div>
                <div class="service-actions">
                    <button class="btn btn-sm btn-primary toggle-status" data-id="${service.id}">
                        Change Status
                    </button>
                    <button class="btn btn-sm btn-secondary delete-service" data-id="${service.id}">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    historyContainer.innerHTML = servicesHTML;
    
    // Add event listeners to dynamic buttons
    document.querySelectorAll('.toggle-status').forEach(button => {
        button.addEventListener('click', handleToggleStatus);
    });
    
    document.querySelectorAll('.delete-service').forEach(button => {
        button.addEventListener('click', handleDeleteService);
    });
}

// Function to configure history buttons
function setupServiceButtons() {
    // Button to add service
    const addButton = document.getElementById('add-service-btn');
    if (addButton) {
        addButton.addEventListener('click', handleAddService);
    }
    
    // Button to clear history
    const clearButton = document.getElementById('clear-history-btn');
    if (clearButton) {
        clearButton.addEventListener('click', handleClearHistory);
    }
    
    // Button to filter pending
    const filterButton = document.getElementById('filter-pending-btn');
    if (filterButton) {
        filterButton.addEventListener('click', handleFilterPending);
    }
    
    // Button to show all
    const showAllButton = document.getElementById('show-all-btn');
    if (showAllButton) {
        showAllButton.addEventListener('click', handleShowAll);
    }
}

// Function to add service
function handleAddService() {
    const services = JSON.parse(localStorage.getItem('ab7ec_services')) || [];
    
    // Create new service
    const newService = {
        id: Date.now(), // Unique ID based on timestamp
        name: `Simulated Service ${services.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        description: 'Example service added from the interface'
    };
    
    services.push(newService);
    localStorage.setItem('ab7ec_services', JSON.stringify(services));
    
    // Render and update
    renderServices(services);
    updateServiceStats(services);
    
    // Show notification
    showNotification('Service added successfully', 'success');
}

// Function to change service status
function handleToggleStatus(event) {
    const serviceId = parseInt(event.target.dataset.id);
    let services = JSON.parse(localStorage.getItem('ab7ec_services'));
    
    // Use map to update array
    services = services.map(service => {
        if (service.id === serviceId) {
            return {
                ...service,
                status: service.status === 'completed' ? 'pending' : 'completed'
            };
        }
        return service;
    });
    
    localStorage.setItem('ab7ec_services', JSON.stringify(services));
    renderServices(services);
    updateServiceStats(services);
    
    showNotification('Updated service status', 'info');
}

// Function to delete service
function handleDeleteService(event) {
    const serviceId = parseInt(event.target.dataset.id);
    let services = JSON.parse(localStorage.getItem('ab7ec_services'));
    
    // Use filter to create new array without deleted service
    services = services.filter(service => service.id !== serviceId);
    
    localStorage.setItem('ab7ec_services', JSON.stringify(services));
    renderServices(services);
    updateServiceStats(services);
    
    showNotification('Service removed', 'warning');
}

// Function to clear history
function handleClearHistory() {
    // Use confirmation before deleting
    if (confirm('Are you sure you want to delete all service history?')) {
        localStorage.removeItem('ab7ec_services');
        renderServices([]);
        updateServiceStats([]);
        showNotification('History successfully cleared', 'warning');
    }
}

// Function to filter pending services
function handleFilterPending() {
    const allServices = JSON.parse(localStorage.getItem('ab7ec_services')) || [];
    const pendingServices = allServices.filter(service => service.status === 'pending');
    renderServices(pendingServices);
}

// Function to show all services
function handleShowAll() {
    const services = JSON.parse(localStorage.getItem('ab7ec_services')) || [];
    renderServices(services);
}

// Function to update statistics
function updateServiceStats(services) {
    const total = services.length;
    const completed = services.filter(s => s.status === 'completed').length;
    const pending = services.filter(s => s.status === 'pending').length;
    
    // Update DOM elements
    const totalElement = document.getElementById('total-services');
    const completedElement = document.getElementById('completed-services');
    const pendingElement = document.getElementById('pending-services');
    
    if (totalElement) totalElement.textContent = total;
    if (completedElement) completedElement.textContent = completed;
    if (pendingElement) pendingElement.textContent = pending;
}

// === FUNCTION 4: Contact form ===
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Load saved data
    loadFormData();
    
    // Configure real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', () => {
            // Clear error message when typing
            clearFieldError(input);
        });
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Save data automatically
    contactForm.addEventListener('input', debounce(saveFormData, 500));
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    
    // Validate complete form
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Simulate submission (in real case would be a fetch request)
    showNotification('Message sent successfully. We will contact you shortly.', 'success');
    
    // Clear form and localStorage
    form.reset();
    localStorage.removeItem('ab7ec_contact_form');
    
    // Create contact record
    const contacts = JSON.parse(localStorage.getItem('ab7ec_contacts')) || [];
    contacts.push({
        ...formObject,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('ab7ec_contacts', JSON.stringify(contacts));
    
    // Show confirmation
    setTimeout(() => {
        alert('Thank you for your message. We have received your request and will contact you within 24 hours.');
    }, 100);
}

// Function to validate individual field
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous error
    clearFieldError(field);
    
    // Specific validations by field
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'The name must have at least 2 characters.';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'The message must be at least 10 characters long.';
            }
            break;
    }
    
    // Mark required field
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Show error if necessary
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Function to validate complete form
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
        // Create blur event to validate
        const event = new Event('blur');
        field.dispatchEvent(event);
        
        // Check if field has error
        if (field.parentElement.querySelector('.field-error')) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Helper functions for error handling
function showFieldError(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#DC3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentElement.appendChild(errorElement);
    field.style.borderColor = '#DC3545';
}

function clearFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// Function to save form data
function saveFormData() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    localStorage.setItem('ab7ec_contact_form', JSON.stringify(data));
}

// Function to load saved data
function loadFormData() {
    const savedData = localStorage.getItem('ab7ec_contact_form');
    if (!savedData) return;
    
    const data = JSON.parse(savedData);
    const form = document.getElementById('contact-form');
    
    Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = data[key];
        }
    });
}

// === FUNCTION 5: Technical guides ===
function initTechnicalGuides() {
    // Array of objects for technical guides
    const technicalGuides = [
        {
            id: 1,
            title: 'POST Failure Diagnosis',
            category: 'diagnosis',
            difficulty: 'intermediate',
            steps: [
                'Listen to POST beep codes',
                'Check error codes on screen',
                'Test individual components',
                'Use POST diagnostic card'
            ],
            tools: ['Multimeter', 'POST card', 'Power supply tester'],
            estimatedTime: '30-60 minutes'
        },
        {
            id: 2,
            title: 'SSD Replacement',
            category: 'hardware',
            difficulty: 'beginner',
            steps: [
                'Perform data backup',
                'Disconnect power and battery',
                'Remove back cover',
                'Replace and secure unit',
                'Install operating system'
            ],
            tools: ['Phillips screwdriver', 'Anti-static wrist strap', 'Disk cloner'],
            estimatedTime: '45-90 minutes'
        },
        {
            id: 3,
            title: 'Secure Data Recovery',
            category: 'software',
            difficulty: 'advanced',
            steps: [
                'Connect drive as secondary',
                'Use recovery software',
                'Scan in read-only mode',
                'Save data to secure drive'
            ],
            tools: ['SATA/USB adapter', 'Recovery software', 'External hard drive'],
            estimatedTime: '2-4 hours'
        },
        {
            id: 4,
            title: 'Cleaning and Maintenance',
            category: 'maintenance',
            difficulty: 'beginner',
            steps: [
                'Disassemble covers',
                'Clean fans and heatsinks',
                'Apply new thermal paste',
                'Reassemble and test'
            ],
            tools: ['Compressed air', 'Thermal paste', 'Isopropyl alcohol'],
            estimatedTime: '60 minutes'
        }
    ];
    
    // Save to localStorage if it doesn't exist
    if (!localStorage.getItem('ab7ec_guides')) {
        localStorage.setItem('ab7ec_guides', JSON.stringify(technicalGuides));
    }
    
    // Render guides
    renderGuides(technicalGuides);
    
    // Configure filters
    setupGuideFilters();
}

// Function to render guides using template literals
function renderGuides(guides) {
    const container = document.getElementById('guides-container');
    if (!container) return;
    
    if (!guides || guides.length === 0) {
        container.innerHTML = `
            <div class="no-guides">
                <p>No guides available at this time.</p>
            </div>
        `;
        return;
    }
    
    // Use template literal exclusively
    const guidesHTML = guides.map(guide => {
        // Determine color based on difficulty using conditional
        let difficultyColor;
        if (guide.difficulty === 'beginner') {
            difficultyColor = '#28A745';
        } else if (guide.difficulty === 'intermediate') {
            difficultyColor = '#FFC107';
        } else {
            difficultyColor = '#DC3545';
        }
        
        return `
            <article class="guide-card" data-category="${guide.category}" data-difficulty="${guide.difficulty}">
                <div class="guide-header">
                    <h3>${guide.title}</h3>
                    <span class="guide-difficulty" style="background-color: ${difficultyColor}">
                        ${guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                    </span>
                </div>
                
                <div class="guide-category">
                    <strong>Category:</strong> ${getCategoryName(guide.category)}
                </div>
                
                <div class="guide-time">
                    <strong>Estimated time:</strong> ${guide.estimatedTime}
                </div>
                
                <div class="guide-steps">
                    <strong>Steps:</strong>
                    <ol>
                        ${guide.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="guide-tools">
                    <strong>Required tools:</strong>
                    <ul>
                        ${guide.tools.map(tool => `<li>${tool}</li>`).join('')}
                    </ul>
                </div>
                
                <button class="btn btn-primary save-guide" data-id="${guide.id}">
                    Save for later
                </button>
            </article>
        `;
    }).join('');
    
    container.innerHTML = guidesHTML;
    
    // Add event listeners to save buttons
    document.querySelectorAll('.save-guide').forEach(button => {
        button.addEventListener('click', handleSaveGuide);
    });
}

// Function to configure guide filters
function setupGuideFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterGuides);
    }
    
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterGuides);
    }
}

// Function to filter guides
function filterGuides() {
    const categoryFilter = document.getElementById('category-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedDifficulty = difficultyFilter ? difficultyFilter.value : 'all';
    
    const allGuides = JSON.parse(localStorage.getItem('ab7ec_guides')) || [];
    
    // Use filter to apply multiple criteria
    const filteredGuides = allGuides.filter(guide => {
        const categoryMatch = selectedCategory === 'all' || guide.category === selectedCategory;
        const difficultyMatch = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
        
        return categoryMatch && difficultyMatch;
    });
    
    renderGuides(filteredGuides);
}

// Function to handle guide saving
function handleSaveGuide(event) {
    const guideId = parseInt(event.target.dataset.id);
    const guides = JSON.parse(localStorage.getItem('ab7ec_guides')) || [];
    const guide = guides.find(g => g.id === guideId);
    
    if (!guide) return;
    
    // Get saved guides
    let savedGuides = JSON.parse(localStorage.getItem('ab7ec_saved_guides')) || [];
    
    // Check if already saved
    if (!savedGuides.some(g => g.id === guideId)) {
        savedGuides.push(guide);
        localStorage.setItem('ab7ec_saved_guides', JSON.stringify(savedGuides));
        showNotification('Guide saved successfully', 'success');
        event.target.textContent = '✓ Saved';
        event.target.disabled = true;
    } else {
        showNotification('This guide is already saved', 'info');
    }
}

// === FUNCTION 6: Pricing system ===
function initPricingSystem() {
    // Array of objects for services and prices
    const pricingData = [
        { id: 1, service: 'Basic diagnosis', price: 250, duration: '30 min', category: 'diagnosis' },
        { id: 2, service: 'Advanced diagnosis', price: 500, duration: '2 hours', category: 'diagnosis' },
        { id: 3, service: 'Internal cleaning', price: 400, duration: '2 hours', category: 'maintenance' },
        { id: 4, service: 'Thermal paste replacement', price: 350, duration: '45 min', category: 'maintenance' },
        { id: 5, service: 'Screen replacement', price: 1200, duration: '1-2 hours', category: 'repair' },
        { id: 6, service: 'Keyboard replacement', price: 600, duration: '1 hour', category: 'repair' },
        { id: 7, service: 'OS installation', price: 300, duration: '1 hour', category: 'software' },
        { id: 8, service: 'Basic data recovery', price: 800, duration: '2-4 hours', category: 'recovery' },
        { id: 9, service: 'Advanced data recovery', price: 1500, duration: '4-8 hours', category: 'recovery' }
    ];
    
    // Render prices
    renderPricing(pricingData);
    
    // Configure calculator
    setupPriceCalculator(pricingData);
}

// Function to render prices using template literals
function renderPricing(pricingData) {
    const container = document.getElementById('pricing-container');
    if (!container) return;
    
    // Group by category using reduce
    const groupedByCategory = pricingData.reduce((groups, item) => {
        const category = item.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});
    
    // Create HTML with template literals
    let pricingHTML = '';
    
    for (const [category, items] of Object.entries(groupedByCategory)) {
        pricingHTML += `
            <div class="pricing-category">
                <h3>${getCategoryName(category)}</h3>
                <div class="pricing-items">
                    ${items.map(item => `
                        <div class="pricing-item" data-id="${item.id}" data-price="${item.price}">
                            <div class="pricing-service">${item.service}</div>
                            <div class="pricing-details">
                                <span class="pricing-price">Q${item.price}</span>
                                <span class="pricing-duration">${item.duration}</span>
                            </div>
                            <button class="btn btn-sm btn-primary add-to-cart" data-id="${item.id}">
                                Add
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = pricingHTML;
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// Function to configure price calculator
function setupPriceCalculator(pricingData) {
    const calculateButton = document.getElementById('calculate-total');
    const resetButton = document.getElementById('reset-calculator');
    
    if (calculateButton) {
        calculateButton.addEventListener('click', () => calculateTotal(pricingData));
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetCalculator);
    }
    
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('ab7ec_cart')) || [];
    updateCartDisplay(cart, pricingData);
}

// Function to add to cart
function handleAddToCart(event) {
    const serviceId = parseInt(event.target.dataset.id);
    const cart = JSON.parse(localStorage.getItem('ab7ec_cart')) || [];
    
    // Check if already in cart
    const existingItem = cart.find(item => item.id === serviceId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: serviceId,
            quantity: 1
        });
    }
    
    localStorage.setItem('ab7ec_cart', JSON.stringify(cart));
    
    // Get pricing data to update display
    const pricingData = JSON.parse(localStorage.getItem('ab7ec_pricing')) || [];
    updateCartDisplay(cart, pricingData);
    
    showNotification('Service added to cart', 'success');
}

// Function to calculate total
function calculateTotal(pricingData) {
    const cart = JSON.parse(localStorage.getItem('ab7ec_cart')) || [];
    
    if (cart.length === 0) {
        showNotification('The cart is empty', 'warning');
        return;
    }
    
    // Calculate total using reduce
    const total = cart.reduce((sum, cartItem) => {
        const service = pricingData.find(p => p.id === cartItem.id);
        return sum + (service ? service.price * cartItem.quantity : 0);
    }, 0);
    
    // Show result
    const resultElement = document.getElementById('calculation-result');
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="calculation-result">
                <h4>Estimated total:</h4>
                <p class="total-amount">Q${total.toFixed(2)}</p>
                <p>For ${cart.length} selected service(s)</p>
                <p class="note">Note: Prices may vary depending on the specific case complexity.</p>
            </div>
        `;
    }
}

// Function to reset calculator
function resetCalculator() {
    if (confirm('Are you sure you want to empty the cart?')) {
        localStorage.removeItem('ab7ec_cart');
        updateCartDisplay([], []);
        
        const resultElement = document.getElementById('calculation-result');
        if (resultElement) {
            resultElement.innerHTML = '';
        }
        
        showNotification('Cart emptied', 'warning');
    }
}

// Function to update cart display
function updateCartDisplay(cart, pricingData) {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>The cart is empty</p>';
            return;
        }
        
        const cartHTML = cart.map(cartItem => {
            const service = pricingData.find(p => p.id === cartItem.id);
            if (!service) return '';
            
            const subtotal = service.price * cartItem.quantity;
            
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <strong>${service.service}</strong>
                        <div>Quantity: ${cartItem.quantity}</div>
                    </div>
                    <div class="cart-item-price">
                        Q${subtotal.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
        
        cartItems.innerHTML = cartHTML;
    }
}

// === FUNCTION 7: Lazy Loading ===
function initLazyLoading() {
    // Select all images with data-src
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Configure Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    
                    // Add transition class when loaded
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for old browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
}

// === HELPER FUNCTIONS ===

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = 'var(--spacing-sm) var(--spacing-md)';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.boxShadow = 'var(--shadow-lg)';
    notification.style.zIndex = '9999';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Colors according to type
    const colors = {
        success: { bg: '#28A745', text: '#FFFFFF' },
        error: { bg: '#DC3545', text: '#FFFFFF' },
        warning: { bg: '#FFC107', text: '#212529' },
        info: { bg: '#006BBD', text: '#FFFFFF' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to get category name
function getCategoryName(category) {
    const categories = {
        'diagnosis': 'Diagnosis',
        'hardware': 'Hardware',
        'software': 'Software',
        'maintenance': 'Maintenance',
        'repair': 'Repair',
        'recovery': 'Data Recovery'
    };
    
    return categories[category] || category;
}

// Debounce function to improve performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === EXPORT FUNCTIONS FOR TESTS ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        validateField,
        validateForm,
        formatDate,
        getCategoryName
    };
}