document.addEventListener('DOMContentLoaded', function() {
    const imageModal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");

    document.querySelectorAll('.publication-image img').forEach(img => {
        img.addEventListener('click', function() {
            imageModal.classList.add('active');
            modalImg.src = this.src;
            modalImg.classList.add('modal-content-active');
        });
    });

    imageModal.addEventListener('click', function() {
        imageModal.classList.remove('active');
        modalImg.classList.remove('modal-content-active');
    });
});
