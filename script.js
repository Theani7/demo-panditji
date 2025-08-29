// Apple-style smooth interactions and animations
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const bookNowBtn = document.getElementById('bookNowBtn');
    const navCta = document.querySelector('.nav-cta');
    const bookingModal = document.getElementById('bookingModal');
    const closeModal = document.querySelector('.close');
    const cancelBooking = document.getElementById('cancelBooking');
    const bookingForm = document.getElementById('bookingForm');
    const successMessage = document.getElementById('successMessage');
    const closeSuccess = document.getElementById('closeSuccess');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            this.classList.toggle('active');
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    if (currentTheme === 'dark') {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon with animation
        themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            themeIcon.style.transform = 'rotate(0deg)';
        }, 150);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (window.scrollY > 50) {
            if (currentTheme === 'dark') {
                navbar.style.background = 'rgba(17, 24, 39, 0.95)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
            navbar.style.borderBottom = '1px solid rgba(210, 210, 215, 0.5)';
        } else {
            if (currentTheme === 'dark') {
                navbar.style.background = 'rgba(17, 24, 39, 0.8)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            }
            navbar.style.borderBottom = '1px solid var(--border-color)';
        }
    });

    // Modal functionality
    function openModal() {
        bookingModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.9) translateY(20px)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.transition = 'all 0.3s ease';
            modalContent.style.transform = 'scale(1) translateY(0)';
            modalContent.style.opacity = '1';
        }, 10);
    }

    function closeModalFunc() {
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.transition = 'all 0.2s ease';
        modalContent.style.transform = 'scale(0.9) translateY(20px)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            bookingModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            bookingForm.reset();
        }, 200);
    }

    // Event listeners for opening modal
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', openModal);
    }
    
    if (navCta) {
        navCta.addEventListener('click', openModal);
    }

    // Event listeners for closing modal
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }
    
    if (cancelBooking) {
        cancelBooking.addEventListener('click', closeModalFunc);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            closeModalFunc();
        }
    });

    // Form validation and submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(bookingForm);
            const bookingData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                service: formData.get('service'),
                date: formData.get('date'),
                time: formData.get('time'),
                address: formData.get('address'),
                notes: formData.get('notes')
            };

            // Validate required fields
            if (!bookingData.name || !bookingData.phone || !bookingData.email || 
                !bookingData.service || !bookingData.date || !bookingData.time || 
                !bookingData.address) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(bookingData.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Validate phone number (basic validation)
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(bookingData.phone.replace(/[\s\-\(\)]/g, ''))) {
                showNotification('Please enter a valid phone number.', 'error');
                return;
            }

            // Validate date (not in the past)
            const selectedDate = new Date(bookingData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showNotification('Please select a future date.', 'error');
                return;
            }

            // Simulate form submission with loading state
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Booking...';
            submitBtn.disabled = true;

            // Simulate API call delay
            setTimeout(() => {
                // Store booking data (in real app, this would be sent to server)
                console.log('Booking submitted:', bookingData);
                
                // Close booking modal
                closeModalFunc();
                
                // Show success message
                setTimeout(() => {
                    showSuccessMessage();
                }, 300);
                
                // Reset form and button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Success message functionality
    function showSuccessMessage() {
        successMessage.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const successContent = document.querySelector('.success-content');
        successContent.style.transform = 'scale(0.9) translateY(20px)';
        successContent.style.opacity = '0';
        
        setTimeout(() => {
            successContent.style.transition = 'all 0.3s ease';
            successContent.style.transform = 'scale(1) translateY(0)';
            successContent.style.opacity = '1';
        }, 10);
    }

    function closeSuccessMessage() {
        const successContent = document.querySelector('.success-content');
        successContent.style.transition = 'all 0.2s ease';
        successContent.style.transform = 'scale(0.9) translateY(20px)';
        successContent.style.opacity = '0';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 200);
    }

    if (closeSuccess) {
        closeSuccess.addEventListener('click', closeSuccessMessage);
    }

    // Close success message when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === successMessage) {
            closeSuccessMessage();
        }
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'error' ? '⚠️' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'};
            color: white;
            padding: 16px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-medium);
            z-index: 3000;
            transform: translateX(400px);
            transition: all 0.3s ease;
            max-width: 350px;
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button functionality
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and pandit cards
    document.querySelectorAll('.service-card, .pandit-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Add hover effects to interactive elements
    document.querySelectorAll('.service-card, .pandit-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Pandit profile view functionality
    document.querySelectorAll('.btn-outline').forEach(btn => {
        btn.addEventListener('click', function() {
            const panditCard = this.closest('.pandit-card');
            const panditName = panditCard.querySelector('h3').textContent;
            showNotification(`${panditName}'s full profile coming soon!`, 'info');
        });
    });

    // Set minimum date to today for date input
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Add loading states to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled && !this.classList.contains('no-loading')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (bookingModal.style.display === 'block') {
                closeModalFunc();
            }
            if (successMessage.style.display === 'block') {
                closeSuccessMessage();
            }
        }
    });

    // Add focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Apply focus trap when modal is open
    const modalObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (bookingModal.style.display === 'block') {
                    trapFocus(bookingModal);
                    // Focus first input
                    const firstInput = bookingModal.querySelector('input');
                    if (firstInput) {
                        setTimeout(() => firstInput.focus(), 100);
                    }
                }
            }
        });
    });

    modalObserver.observe(bookingModal, { attributes: true });
});
