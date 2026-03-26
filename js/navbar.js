const navbar = document.querySelector('.navbar');

// Scroll-based active section highlighting
const sectionIds = ['research', 'experience', 'education'];
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

function updateActiveNav() {
    const scrollPos = window.scrollY + 80;
    let currentSection = '';

    for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= scrollPos) {
            currentSection = id;
        }
    }

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Always show navbar
    navbar.classList.add('no-transition');
    navbar.classList.add('visible');
    navbar.offsetHeight;
    requestAnimationFrame(() => {
        navbar.classList.remove('no-transition');
    });

    updateActiveNav();
});

window.addEventListener('scroll', updateActiveNav, { passive: true });
