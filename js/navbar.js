const navbar = document.querySelector('.navbar');

document.addEventListener('DOMContentLoaded', () => {
    navbar.classList.add('no-transition');
    navbar.classList.add('visible');
    navbar.offsetHeight;
    requestAnimationFrame(() => {
        navbar.classList.remove('no-transition');
    });
});
