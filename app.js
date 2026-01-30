// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(70, 130, 180, 0.95)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #4682B4 0%, #36648B 100%)';
    }
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Book package function
function bookPackage(packageName) {
    const packageSelect = document.getElementById('package');
    if (packageName === 'Adventure Seeker') {
        packageSelect.value = 'adventure';
    } else if (packageName === 'Premium Explorer') {
        packageSelect.value = 'premium';
    } else if (packageName === 'Luxury Expedition') {
        packageSelect.value = 'luxury';
    }
    scrollToSection('booking');
}

// Form submission
function handleBooking(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        destination: document.getElementById('destination').value,
        package: document.getElementById('package').value,
        date: document.getElementById('date').value,
        travelers: document.getElementById('travelers').value,
        message: document.getElementById('message').value
    };

    console.log('Booking Details:', formData);
    alert(`Thank you, ${formData.name}! We'll contact you at ${formData.email} to confirm your booking.`);

    // Reset form
    event.target.reset();
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.destination-card, .package-card, .feature-item, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});