// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initCounters();
    loadOpportunities();
    loadEvents();
    initNewsletterForm();
    initBackToTop();
    initMobileMenu();
    initSmoothScroll();
    initFilterButtons();
    
    // Hide preloader
    setTimeout(() => {
        document.querySelector('.preloader')?.classList.add('fade-out');
    }, 1000);
});

// Navigation scroll effect
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const current = parseInt(counter.innerText);
        const increment = target / 50; // Divide animation into 50 steps
        
        if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            setTimeout(() => animateCounter(counter), 20);
        } else {
            counter.innerText = target;
        }
    };
    
    // Intersection Observer to start animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Load opportunities from database
function loadOpportunities() {
    const container = document.getElementById('opportunities-container');
    if (!container) return;
    
    const opportunities = db.getFeaturedOpportunities();
    
    container.innerHTML = opportunities.map(opp => `
        <div class="opportunity-card hover-lift">
            <div class="opportunity-header">
                <i class="fas ${opp.icon}"></i>
                <h3>${opp.title}</h3>
            </div>
            <p class="company"><i class="fas fa-building"></i> ${opp.company}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${opp.location}</p>
            <p>${opp.description}</p>
            <span class="deadline"><i class="fas fa-clock"></i> Deadline: ${formatDate(opp.deadline)}</span>
            <a href="${opp.link}" class="btn-small" style="display: inline-block; margin-top: 15px;">Apply Now</a>
        </div>
    `).join('');
}

// Load events from database
function loadEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;
    
    const events = db.getUpcomingEvents(2);
    
    container.innerHTML = events.map(event => `
        <div class="event-card hover-lift">
            <div class="event-date">
                <span class="day">${event.day}</span>
                <span class="month">${event.month}</span>
            </div>
            <div class="event-details">
                <h3>${event.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-tag"></i> ${event.type}</p>
                <a href="#" class="btn-small" style="margin-top: 10px; display: inline-block;">Register</a>
            </div>
        </div>
    `).join('');
}

// Newsletter form
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        const result = db.subscribeNewsletter(email);
        
        // Show toast notification
        showToast(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            form.reset();
        }
    });
}

// Back to top button
function initBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile menu
function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenu || !navLinks) return;
    
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        mobileMenu.classList.toggle('active');
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
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
}

// Filter buttons for resources page
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterResources(filter);
        });
    });
}

// Filter resources
function filterResources(category) {
    const resourceCards = document.querySelectorAll('.resource-card');
    
    resourceCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => card.classList.add('fade-in'), 10);
        } else {
            card.style.display = 'none';
        }
    });
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Add styles dynamically
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--secondary)' : '#dc3545'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: var(--shadow);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
    `;
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// Load more posts (for community page)
function loadPosts() {
    const container = document.getElementById('forum-posts');
    if (!container) return;
    
    const posts = db.getPosts();
    
    container.innerHTML = posts.map(post => `
        <div class="forum-post">
            <div class="post-header">
                <img src="${post.authorImg}" alt="${post.author}">
                <div>
                    <h4>${post.title}</h4>
                    <p>Posted by ${post.author} • ${formatDate(post.date)}</p>
                </div>
            </div>
            <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
            <div class="post-stats">
                <span><i class="fas fa-heart"></i> ${post.likes}</span>
                <span><i class="fas fa-comment"></i> ${post.comments}</span>
                <button class="btn-small">Read More</button>
            </div>
        </div>
    `).join('');
}

// Initialize resource page
function initResourcesPage() {
    if (!window.location.pathname.includes('resources.html')) return;
    
    // Load internships
    const internshipsList = document.getElementById('internships-list');
    if (internshipsList) {
        const opportunities = db.getOpportunities();
        internshipsList.innerHTML = opportunities.map(opp => `
            <div class="internship-item">
                <h4>${opp.title}</h4>
                <p><strong>${opp.company}</strong> - ${opp.location}</p>
                <p>${opp.description}</p>
                <span class="deadline">Apply by: ${formatDate(opp.deadline)}</span>
                <a href="${opp.link}" class="btn-small">View Details</a>
            </div>
        `).join('');
    }
}

// Call page-specific functions
initResourcesPage();
loadPosts();