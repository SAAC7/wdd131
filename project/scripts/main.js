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
// Cumple con todos los requisitos del proyecto

// === CONFIGURACIÓN INICIAL ===
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // 1. Configurar año actual en el footer
    setCurrentYear();
    
    // 2. Inicializar menú móvil
    initMobileMenu();
    
    // 3. Inicializar historial de servicios
    initServiceHistory();
    
    // 4. Inicializar formulario de contacto (si está en la página)
    if (document.getElementById('contact-form')) {
        initContactForm();
    }
    
    // 5. Inicializar guías técnicas (si está en la página)
    if (document.getElementById('guides-container')) {
        initTechnicalGuides();
    }
    
    // 6. Inicializar sistema de precios (si está en la página)
    if (document.getElementById('pricing-container')) {
        initPricingSystem();
    }
    
    // 7. Configurar carga diferida de imágenes
    initLazyLoading();
    
    // 8. Mostrar notificación de carga completa
    console.log('AB7ec - Sistema inicializado correctamente');
}

// === FUNCIÓN 1: Configurar año actual ===
function setCurrentYear() {
    const yearElement = document.getElementById('currentyear');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}

// === FUNCIÓN 2: Menú móvil ===
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    // Función para alternar menú
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Bloquear scroll cuando el menú está abierto
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }
    
    // Función para cerrar menú
    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    
    // Cerrar menú al hacer clic en enlaces
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (event) => {
        if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
            closeMenu();
        }
    });
    
    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

// === FUNCIÓN 3: Historial de servicios (localStorage) ===
function initServiceHistory() {
    const historyContainer = document.getElementById('service-history-container');
    if (!historyContainer) return;
    
    // Array de servicios de ejemplo
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
    
    // Obtener servicios de localStorage o usar los de ejemplo
    let services = JSON.parse(localStorage.getItem('ab7ec_services')) || sampleServices;
    
    // Guardar servicios iniciales si no existen
    if (!localStorage.getItem('ab7ec_services')) {
        localStorage.setItem('ab7ec_services', JSON.stringify(services));
    }
    
    // Renderizar servicios
    renderServices(services);
    
    // Configurar botones
    setupServiceButtons();
    
    // Actualizar estadísticas
    updateServiceStats(services);
}

// Función para renderizar servicios usando template literals
function renderServices(services) {
    const historyContainer = document.getElementById('service-history-container');
    
    if (!services || services.length === 0) {
        historyContainer.innerHTML = `
            <div class="no-services">
                <p>No hay servicios registrados. Agregue un nuevo servicio para comenzar.</p>
            </div>
        `;
        return;
    }
    
    // Usar template literal exclusivamente para construir el HTML
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
    
    // Agregar event listeners a los botones dinámicos
    document.querySelectorAll('.toggle-status').forEach(button => {
        button.addEventListener('click', handleToggleStatus);
    });
    
    document.querySelectorAll('.delete-service').forEach(button => {
        button.addEventListener('click', handleDeleteService);
    });
}

// Función para configurar botones del historial
function setupServiceButtons() {
    // Botón para agregar servicio
    const addButton = document.getElementById('add-service-btn');
    if (addButton) {
        addButton.addEventListener('click', handleAddService);
    }
    
    // Botón para limpiar historial
    const clearButton = document.getElementById('clear-history-btn');
    if (clearButton) {
        clearButton.addEventListener('click', handleClearHistory);
    }
    
    // Botón para filtrar pendientes
    const filterButton = document.getElementById('filter-pending-btn');
    if (filterButton) {
        filterButton.addEventListener('click', handleFilterPending);
    }
    
    // Botón para mostrar todos
    const showAllButton = document.getElementById('show-all-btn');
    if (showAllButton) {
        showAllButton.addEventListener('click', handleShowAll);
    }
}

// Función para agregar servicio
function handleAddService() {
    const services = JSON.parse(localStorage.getItem('ab7ec_services')) || [];
    
    // Crear nuevo servicio
    const newService = {
        id: Date.now(), // ID único basado en timestamp
        name: `Simulated Service ${services.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        description: 'Example service added from the interface'
    };
    
    services.push(newService);
    localStorage.setItem('ab7ec_services', JSON.stringify(services));
    
    // Renderizar y actualizar
    renderServices(services);
    updateServiceStats(services);
    
    // Mostrar notificación
    showNotification('Service added successfully', 'success');
}

// Función para cambiar estado de servicio
function handleToggleStatus(event) {
    const serviceId = parseInt(event.target.dataset.id);
    let services = JSON.parse(localStorage.getItem('ab7ec_services'));
    
    // Usar map para actualizar el array
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

// Función para eliminar servicio
function handleDeleteService(event) {
    const serviceId = parseInt(event.target.dataset.id);
    let services = JSON.parse(localStorage.getItem('ab7ec_services'));
    
    // Usar filter para crear nuevo array sin el servicio eliminado
    services = services.filter(service => service.id !== serviceId);
    
    localStorage.setItem('ab7ec_services', JSON.stringify(services));
    renderServices(services);
    updateServiceStats(services);
    
    showNotification('Service removed', 'warning');
}

// Función para limpiar historial
function handleClearHistory() {
    // Usar confirmación antes de borrar
    if (confirm('Are you sure you want to delete all service history?')) {
        localStorage.removeItem('ab7ec_services');
        renderServices([]);
        updateServiceStats([]);
        showNotification('History successfully cleared', 'warning');
    }
}

// Función para filtrar servicios pendientes
function handleFilterPending() {
    const allServices = JSON.parse(localStorage.getItem('ab7ec_services')) || [];
    const pendingServices = allServices.filter(service => service.status === 'pending');
    renderServices(pendingServices);
}

// Función para mostrar todos los servicios
function handleShowAll() {
    const services = JSON.parse(localStorage.getItem('ab7ec_services')) || [];
    renderServices(services);
}

// Función para actualizar estadísticas
function updateServiceStats(services) {
    const total = services.length;
    const completed = services.filter(s => s.status === 'completed').length;
    const pending = services.filter(s => s.status === 'pending').length;
    
    // Actualizar elementos del DOM
    const totalElement = document.getElementById('total-services');
    const completedElement = document.getElementById('completed-services');
    const pendingElement = document.getElementById('pending-services');
    
    if (totalElement) totalElement.textContent = total;
    if (completedElement) completedElement.textContent = completed;
    if (pendingElement) pendingElement.textContent = pending;
}

// === FUNCIÓN 4: Formulario de contacto ===
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Cargar datos guardados
    loadFormData();
    
    // Configurar validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', () => {
            // Limpiar mensaje de error al escribir
            clearFieldError(input);
        });
    });
    
    // Manejar envío del formulario
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Guardar datos automáticamente
    contactForm.addEventListener('input', debounce(saveFormData, 500));
}

// Función para manejar envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    
    // Validar formulario completo
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Simular envío (en un caso real sería una petición fetch)
    showNotification('Message sent successfully. We will contact you shortly.', 'success');
    
    // Limpiar formulario y localStorage
    form.reset();
    localStorage.removeItem('ab7ec_contact_form');
    
    // Crear registro de contacto
    const contacts = JSON.parse(localStorage.getItem('ab7ec_contacts')) || [];
    contacts.push({
        ...formObject,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('ab7ec_contacts', JSON.stringify(contacts));
    
    // Mostrar confirmación
    setTimeout(() => {
        alert('Thank you for your message. We have received your request and will contact you within 24 hours.');
    }, 100);
}

// Función para validar campo individual
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Limpiar error previo
    clearFieldError(field);
    
    // Validaciones específicas por campo
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
    
    // Marcar campo requerido
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Mostrar error si es necesario
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Función para validar formulario completo
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    fields.forEach(field => {
        // Crear evento de blur para validar
        const event = new Event('blur');
        field.dispatchEvent(event);
        
        // Verificar si el campo tiene error
        if (field.parentElement.querySelector('.field-error')) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Funciones auxiliares para manejo de errores
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

// Función para guardar datos del formulario
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

// Función para cargar datos guardados
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

// === FUNCIÓN 5: Guías técnicas ===
function initTechnicalGuides() {
    // Array de objetos para guías técnicas
    const technicalGuides = [
        {
            id: 1,
            title: 'Diagnóstico de Fallos POST',
            category: 'diagnostico',
            difficulty: 'intermedio',
            steps: [
                'Escuchar códigos de sonido POST',
                'Verificar códigos de error en pantalla',
                'Probar componentes individualmente',
                'Usar tarjeta de diagnóstico POST'
            ],
            tools: ['Multímetro', 'Tarjeta POST', 'Fuente de poder de prueba'],
            estimatedTime: '30-60 minutos'
        },
        {
            id: 2,
            title: 'Reemplazo de SSD',
            category: 'hardware',
            difficulty: 'principiante',
            steps: [
                'Realizar backup de datos',
                'Desconectar alimentación y batería',
                'Remover cubierta posterior',
                'Reemplazar unidad y asegurar',
                'Instalar sistema operativo'
            ],
            tools: ['Destornillador Phillips', 'Pulsera antiestática', 'Clonador de discos'],
            estimatedTime: '45-90 minutos'
        },
        {
            id: 3,
            title: 'Recuperación Segura de Datos',
            category: 'software',
            difficulty: 'avanzado',
            steps: [
                'Conectar unidad como secundaria',
                'Usar software de recuperación',
                'Escanear en modo de solo lectura',
                'Guardar datos en unidad segura'
            ],
            tools: ['Adaptador SATA/USB', 'Software de recuperación', 'Disco duro externo'],
            estimatedTime: '2-4 horas'
        },
        {
            id: 4,
            title: 'Limpieza y Mantenimiento',
            category: 'mantenimiento',
            difficulty: 'principiante',
            steps: [
                'Desmontar cubiertas',
                'Limpiar ventiladores y heatsinks',
                'Aplicar pasta térmica nueva',
                'Reensamblar y probar'
            ],
            tools: ['Aire comprimido', 'Pasta térmica', 'Alcohol isopropílico'],
            estimatedTime: '60 minutos'
        }
    ];
    
    // Guardar en localStorage si no existe
    if (!localStorage.getItem('ab7ec_guides')) {
        localStorage.setItem('ab7ec_guides', JSON.stringify(technicalGuides));
    }
    
    // Renderizar guías
    renderGuides(technicalGuides);
    
    // Configurar filtros
    setupGuideFilters();
}

// Función para renderizar guías usando template literals
function renderGuides(guides) {
    const container = document.getElementById('guides-container');
    if (!container) return;
    
    if (!guides || guides.length === 0) {
        container.innerHTML = `
            <div class="no-guides">
                <p>No hay guías disponibles en este momento.</p>
            </div>
        `;
        return;
    }
    
    // Usar template literal exclusivamente
    const guidesHTML = guides.map(guide => {
        // Determinar color basado en dificultad usando condicional
        let difficultyColor;
        if (guide.difficulty === 'principiante') {
            difficultyColor = '#28A745';
        } else if (guide.difficulty === 'intermedio') {
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
                    <strong>Categoría:</strong> ${getCategoryName(guide.category)}
                </div>
                
                <div class="guide-time">
                    <strong>Tiempo estimado:</strong> ${guide.estimatedTime}
                </div>
                
                <div class="guide-steps">
                    <strong>Pasos:</strong>
                    <ol>
                        ${guide.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="guide-tools">
                    <strong>Herramientas requeridas:</strong>
                    <ul>
                        ${guide.tools.map(tool => `<li>${tool}</li>`).join('')}
                    </ul>
                </div>
                
                <button class="btn btn-primary save-guide" data-id="${guide.id}">
                    Guardar para más tarde
                </button>
            </article>
        `;
    }).join('');
    
    container.innerHTML = guidesHTML;
    
    // Agregar event listeners a botones de guardar
    document.querySelectorAll('.save-guide').forEach(button => {
        button.addEventListener('click', handleSaveGuide);
    });
}

// Función para configurar filtros de guías
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

// Función para filtrar guías
function filterGuides() {
    const categoryFilter = document.getElementById('category-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedDifficulty = difficultyFilter ? difficultyFilter.value : 'all';
    
    const allGuides = JSON.parse(localStorage.getItem('ab7ec_guides')) || [];
    
    // Usar filter para aplicar múltiples criterios
    const filteredGuides = allGuides.filter(guide => {
        const categoryMatch = selectedCategory === 'all' || guide.category === selectedCategory;
        const difficultyMatch = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
        
        return categoryMatch && difficultyMatch;
    });
    
    renderGuides(filteredGuides);
}

// Función para manejar guardado de guía
function handleSaveGuide(event) {
    const guideId = parseInt(event.target.dataset.id);
    const guides = JSON.parse(localStorage.getItem('ab7ec_guides')) || [];
    const guide = guides.find(g => g.id === guideId);
    
    if (!guide) return;
    
    // Obtener guías guardadas
    let savedGuides = JSON.parse(localStorage.getItem('ab7ec_saved_guides')) || [];
    
    // Verificar si ya está guardada
    if (!savedGuides.some(g => g.id === guideId)) {
        savedGuides.push(guide);
        localStorage.setItem('ab7ec_saved_guides', JSON.stringify(savedGuides));
        showNotification('Guía guardada correctamente', 'success');
        event.target.textContent = '✓ Guardada';
        event.target.disabled = true;
    } else {
        showNotification('Esta guía ya está guardada', 'info');
    }
}

// === FUNCIÓN 6: Sistema de precios ===
function initPricingSystem() {
    // Array de objetos para servicios y precios
    const pricingData = [
        { id: 1, service: 'Diagnóstico básico', price: 250, duration: '30 min', category: 'diagnostico' },
        { id: 2, service: 'Diagnóstico avanzado', price: 500, duration: '2 hora', category: 'diagnostico' },
        { id: 3, service: 'Limpieza interna', price: 400, duration: '2 hora', category: 'mantenimiento' },
        { id: 4, service: 'Cambio de pasta térmica', price: 350, duration: '45 min', category: 'mantenimiento' },
        { id: 5, service: 'Reemplazo de pantalla', price: 1200, duration: '1-2 horas', category: 'reparacion' },
        { id: 6, service: 'Reemplazo de teclado', price: 600, duration: '1 hora', category: 'reparacion' },
        { id: 7, service: 'Instalación de SO', price: 300, duration: '1 hora', category: 'software' },
        { id: 8, service: 'Recuperación de datos básica', price: 800, duration: '2-4 horas', category: 'recuperacion' },
        { id: 9, service: 'Recuperación de datos avanzada', price: 1500, duration: '4-8 horas', category: 'recuperacion' }
    ];
    
    // Renderizar precios
    renderPricing(pricingData);
    
    // Configurar calculadora
    setupPriceCalculator(pricingData);
}

// Función para renderizar precios usando template literals
function renderPricing(pricingData) {
    const container = document.getElementById('pricing-container');
    if (!container) return;
    
    // Agrupar por categoría usando reduce
    const groupedByCategory = pricingData.reduce((groups, item) => {
        const category = item.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});
    
    // Crear HTML con template literals
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
                                Agregar
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = pricingHTML;
    
    // Agregar event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// Función para configurar calculadora de precios
function setupPriceCalculator(pricingData) {
    const calculateButton = document.getElementById('calculate-total');
    const resetButton = document.getElementById('reset-calculator');
    
    if (calculateButton) {
        calculateButton.addEventListener('click', () => calculateTotal(pricingData));
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetCalculator);
    }
    
    // Inicializar carrito
    let cart = JSON.parse(localStorage.getItem('ab7ec_cart')) || [];
    updateCartDisplay(cart, pricingData);
}

// Función para agregar al carrito
function handleAddToCart(event) {
    const serviceId = parseInt(event.target.dataset.id);
    const cart = JSON.parse(localStorage.getItem('ab7ec_cart')) || [];
    
    // Verificar si ya está en el carrito
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
    
    // Obtener datos de precios para actualizar display
    const pricingData = JSON.parse(localStorage.getItem('ab7ec_pricing')) || [];
    updateCartDisplay(cart, pricingData);
    
    showNotification('Servicio agregado al carrito', 'success');
}

// Función para calcular total
function calculateTotal(pricingData) {
    const cart = JSON.parse(localStorage.getItem('ab7ec_cart')) || [];
    
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'warning');
        return;
    }
    
    // Calcular total usando reduce
    const total = cart.reduce((sum, cartItem) => {
        const service = pricingData.find(p => p.id === cartItem.id);
        return sum + (service ? service.price * cartItem.quantity : 0);
    }, 0);
    
    // Mostrar resultado
    const resultElement = document.getElementById('calculation-result');
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="calculation-result">
                <h4>Total estimado:</h4>
                <p class="total-amount">Q${total.toFixed(2)}</p>
                <p>Para ${cart.length} servicio(s) seleccionado(s)</p>
                <p class="note">Nota: Los precios pueden variar según la complejidad específica del caso.</p>
            </div>
        `;
    }
}

// Función para resetear calculadora
function resetCalculator() {
    if (confirm('¿Está seguro de que desea vaciar el carrito?')) {
        localStorage.removeItem('ab7ec_cart');
        updateCartDisplay([], []);
        
        const resultElement = document.getElementById('calculation-result');
        if (resultElement) {
            resultElement.innerHTML = '';
        }
        
        showNotification('Carrito vaciado', 'warning');
    }
}

// Función para actualizar display del carrito
function updateCartDisplay(cart, pricingData) {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>El carrito está vacío</p>';
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
                        <div>Cantidad: ${cartItem.quantity}</div>
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

// === FUNCIÓN 7: Lazy Loading ===
function initLazyLoading() {
    // Seleccionar todas las imágenes con data-src
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Configurar Intersection Observer para lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    
                    // Agregar clase de transición cuando se carga
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
        // Fallback para navegadores antiguos
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
}

// === FUNCIONES AUXILIARES ===

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = 'var(--spacing-sm) var(--spacing-md)';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.boxShadow = 'var(--shadow-lg)';
    notification.style.zIndex = '9999';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Colores según tipo
    const colors = {
        success: { bg: '#28A745', text: '#FFFFFF' },
        error: { bg: '#DC3545', text: '#FFFFFF' },
        warning: { bg: '#FFC107', text: '#212529' },
        info: { bg: '#006BBD', text: '#FFFFFF' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para formatear fechas
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-GT', options);
}

// Función para obtener nombre de categoría
function getCategoryName(category) {
    const categories = {
        'diagnostico': 'Diagnóstico',
        'hardware': 'Hardware',
        'software': 'Software',
        'mantenimiento': 'Mantenimiento',
        'reparacion': 'Reparación',
        'recuperacion': 'Recuperación de Datos'
    };
    
    return categories[category] || category;
}

// Función debounce para mejorar rendimiento
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

// === EXPORTAR FUNCIONES PARA PRUEBAS ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        validateField,
        validateForm,
        formatDate,
        getCategoryName
    };
}