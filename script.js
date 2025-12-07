// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animated counter for statistics - synchronized timing
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds - smooth and consistent
    const frameRate = 60; // 60fps
    const totalFrames = (duration / 1000) * frameRate;
    const increment = target / totalFrames;
    let current = 0;
    let frame = 0;
    
    const updateCounter = () => {
        frame++;
        current += increment;
        if (frame < totalFrames) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target; // Ensure exact target value
        }
    };
    
    updateCounter();
};

// Intersection Observer for animations - more lenient to show elements sooner
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Synchronized stagger animations - consistent timing
            const staggerDelay = 50; // Match project card stagger
            setTimeout(() => {
                entry.target.classList.add('visible');
                
                // Animate counters when stats section is visible
                if (entry.target.classList.contains('stats')) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach((counter, counterIndex) => {
                        if (!counter.classList.contains('animated')) {
                            counter.classList.add('animated');
                            // Start counter animation after fade-in completes (500ms)
                            setTimeout(() => {
                                animateCounter(counter);
                            }, 500 + (counterIndex * 100));
                        }
                    });
                }
            }, index * staggerDelay);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.fade-in, .stats, .project-card, .service-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Make sure elements become visible even if observer doesn't trigger immediately
setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
        if (!el.classList.contains('visible')) {
            // If element is in viewport, make it visible
            const rect = el.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInViewport) {
                el.classList.add('visible');
            }
        }
    });
}, 100);

// Project filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        const transitionDuration = 400; // Match CSS transition duration (0.4s)
        const staggerDelay = 50; // Consistent stagger delay
        
        projectCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || cardCategory === filterValue;
            
            if (shouldShow) {
                // Show card with synchronized staggered animation
                setTimeout(() => {
                    card.style.display = 'block';
                    // Use requestAnimationFrame for smooth transition start
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        });
                    });
                }, index * staggerDelay);
            } else {
                // Hide card with synchronized transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, transitionDuration);
            }
        });
    });
});

// Form submission handler
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Since this is frontend only, we'll show a success message
    // In a real application, this would send data to a backend
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitButton.textContent = 'Message Sent! ✓';
        submitButton.style.background = '#4caf50';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);
    }, 1500);
    
    // Log form data (in production, this would be sent to a server)
    console.log('Form submitted:', formData);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    }
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements that should animate with synchronized delays
    const animateElements = document.querySelectorAll('.about-text, .about-image, .section-header');
    const staggerDelay = 0.1; // Consistent stagger (100ms)
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * staggerDelay}s`;
    });
    
    // Set initial state for project cards with synchronized transition
    const transitionTiming = '0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    projectCards.forEach(card => {
        card.style.transition = `opacity ${transitionTiming}, transform ${transitionTiming}`;
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        // Make sure overlay is visible
        const overlay = card.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.transform = 'translateY(0)';
        }
    });
    
    // Force visibility check for all fade-in elements
    setTimeout(() => {
        const allFadeIns = document.querySelectorAll('.fade-in');
        allFadeIns.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200;
            if (isVisible && !el.classList.contains('visible')) {
                el.classList.add('visible');
            }
        });
    }, 50);
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--accent-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Interactive mouse tracking for project cards
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.01)`;
        
        // Add glow effect based on mouse position
        const overlay = card.querySelector('.project-overlay');
        if (overlay) {
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            overlay.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), linear-gradient(to top, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.92) 30%, rgba(0, 0, 0, 0.75) 60%, rgba(0, 0, 0, 0.4) 85%, transparent 100%)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        const overlay = card.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.background = '';
        }
    });
});

// Interactive mouse tracking for service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
});

// Interactive button ripple effect
const buttons = document.querySelectorAll('.btn, .filter-btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Interactive form inputs
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
    
    // Add floating label effect
    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});

// Scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

// Enhanced parallax for multiple elements
const parallaxElements = document.querySelectorAll('.section-header, .about-image, .project-card');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const speed = 0.1 + (index % 3) * 0.05;
            const yPos = -(scrolled - elementTop + windowHeight) * speed;
            element.style.transform = `translateY(${yPos}px)`;
        }
    });
});

// Interactive project card reveal on scroll
const projectCardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.classList.add('revealed');
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px'
});

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) scale(0.9)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    projectCardObserver.observe(card);
});

// Interactive navigation link hover effect
navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        navLinks.forEach(l => {
            if (l !== this) {
                l.style.opacity = '0.5';
            }
        });
    });
    
    link.addEventListener('mouseleave', function() {
        navLinks.forEach(l => {
            l.style.opacity = '1';
        });
    });
});

// Smooth reveal animation for sections
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('section:not(#home)').forEach(section => {
    sectionObserver.observe(section);
});

// Make hero section visible immediately
document.querySelector('#home')?.classList.add('section-visible');

// Initialize scroll progress on load
createScrollProgress();

