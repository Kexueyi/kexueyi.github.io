document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('.footer-bar');
    const lastUpdated = document.getElementById('last-updated');
    
    // Format the date as DD/MMM/YYYY
    const formatDate = (date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Set the last updated date
    const lastModified = new Date(document.lastModified);
    lastUpdated.textContent = `Last Updated: ${formatDate(lastModified)}`;
    
    // Handle scroll behavior
    window.addEventListener('scroll', function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            footer.classList.add('visible');
        } else {
            footer.classList.remove('visible');
        }
    });
});