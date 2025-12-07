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
                if (entry.target.classList.contains('reveal')) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.add('visible');
                }
                
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
document.querySelectorAll('.fade-in, .stats, .project-card, .service-card, .reveal').forEach(el => {
    if (el.classList.contains('reveal')) {
        observer.observe(el);
    } else {
        el.classList.add('fade-in');
        observer.observe(el);
    }
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
                    card.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                }, index * staggerDelay);
            } else {
                // Hide card with synchronized transition
                card.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
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

document.addEventListener('DOMContentLoaded', () => {
    // ==== Навигация ====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        navbar.classList.toggle('scrolled', currentScroll > 100);
    });

    // ==== Smooth scroll за anchor линкове ====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offsetTop = target.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // ==== Animated counters ====
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const frameRate = 60;
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
                element.textContent = target;
            }
        };

        updateCounter();
    };

    // ==== Единен IntersectionObserver за .reveal и .stats ====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            el.classList.add('is-visible');

            if (el.classList.contains('stats')) {
                const counters = el.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                });
            }

            // наблюдаваме само веднъж
            revealObserver.unobserve(el);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Маркираме кои елементи да се разкриват
    document.querySelectorAll(
        '.section-header, .about-text, .about-image, .projects-grid, .services-grid, .contact-content, .stats'
    ).forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Hero секцията – веднага видима
    const homeSection = document.querySelector('#home');
    if (homeSection) {
        homeSection.classList.add('section-visible');
    }

    // ==== Project filter ====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || cardCategory === filterValue;

                // Без сложни анимации тук – само показване/скриване,
                // за да няма glitch-ове с други анимации
                card.style.display = shouldShow ? 'block' : 'none';
            });
        });
    });

    // ==== Form submission (frontend demo) ====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                subject: contactForm.querySelector('#subject').value,
                message: contactForm.querySelector('#message').value
            };

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            setTimeout(() => {
                submitButton.textContent = 'Message Sent! ✓';
                submitButton.style.background = '#4caf50';
                contactForm.reset();

                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 3000);
            }, 1500);

            console.log('Form submitted:', formData);
        });
    }

    // ==== Parallax – throttled for smooth performance ====
    const hero = document.querySelector('.hero');
    const heroContent = hero?.querySelector('.hero-content');
    let scrollTimeout;
    
    const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrolled = window.pageYOffset;

            if (hero && heroContent && scrolled < window.innerHeight) {
                heroContent.style.transition = 'none';
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = String(1 - (scrolled / window.innerHeight) * 0.4);
            }

            // Scroll progress bar
            const progress = document.querySelector('.scroll-progress');
            if (progress) {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const percent = (window.scrollY / windowHeight) * 100;
                progress.style.width = percent + '%';
            }
        }, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ==== Active nav link on scroll (throttled) ====
    const sections = document.querySelectorAll('section[id]');
    let navScrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(navScrollTimeout);
        navScrollTimeout = setTimeout(() => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 120;
                const sectionId = section.getAttribute('id');
                const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                }
            });
        }, 50);
    }, { passive: true });

    // ==== Scroll progress bar create ====
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // ==== Hover 3D effect – project cards (throttled for smooth transitions) ====
    let mouseMoveTimeout;
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            clearTimeout(mouseMoveTimeout);
            mouseMoveTimeout = setTimeout(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;

                card.style.transition = 'none';
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.01)`;

                const overlay = card.querySelector('.project-overlay');
                if (overlay) {
                    const glowX = (x / rect.width) * 100;
                    const glowY = (y / rect.height) * 100;
                    overlay.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), linear-gradient(to top, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.92) 30%, rgba(0, 0, 0, 0.75) 60%, rgba(0, 0, 0, 0.4) 85%, transparent 100%)`;
                }
            }, 16); // ~60fps
        });

        card.addEventListener('mouseleave', () => {
            clearTimeout(mouseMoveTimeout);
            card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            const overlay = card.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.background = '';
            }
        });
    });

    // ==== Hover 3D effect – service cards (throttled) ====
    const serviceCards = document.querySelectorAll('.service-card');
    let serviceMouseTimeout;
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            clearTimeout(serviceMouseTimeout);
            serviceMouseTimeout = setTimeout(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                card.style.transition = 'none';
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
            }, 16);
        });

        card.addEventListener('mouseleave', () => {
            clearTimeout(serviceMouseTimeout);
            card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // ==== Button ripple ====
    const buttons = document.querySelectorAll('.btn, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
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

    // ==== Interactive form inputs ====
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // ==== Navigation hover dim effect ====
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            navLinks.forEach(l => {
                if (l !== this) l.style.opacity = '0.5';
            });
        });

        link.addEventListener('mouseleave', function () {
            navLinks.forEach(l => {
                l.style.opacity = '1';
            });
        });
    });

    // ==== Hover 3D effect – architect cards (throttled) ====
    const architectCards = document.querySelectorAll('.architect-card');
    let architectMouseTimeout;
    architectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            clearTimeout(architectMouseTimeout);
            architectMouseTimeout = setTimeout(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                card.style.transition = 'none';
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            }, 16);
        });

        card.addEventListener('mouseleave', () => {
            clearTimeout(architectMouseTimeout);
            card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // ==== Active nav link CSS ====
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

// Removed conflicting parallax - using CSS transitions instead

// Project cards are visible by default - no need for reveal observer that conflicts with transitions

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

