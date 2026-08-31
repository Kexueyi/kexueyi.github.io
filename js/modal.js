document.addEventListener('DOMContentLoaded', function() {
    const imageModal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    if (!imageModal || !modalImg) return;

    const open = src => {
        imageModal.classList.add('active');
        modalImg.src = src;
        modalImg.classList.add('modal-content-active');
    };

    // Delegated so it also covers publication entries injected by
    // publication.js after this listener is attached.
    document.addEventListener('click', function(e) {
        const teaser = e.target.closest('.teaser');
        if (teaser) {
            e.preventDefault();
            open(teaser.dataset.full || teaser.querySelector('img').src);
            return;
        }

        const legacy = e.target.closest('.publication-image img');
        if (legacy) {
            open(legacy.dataset.full || legacy.src);
        }
    });

    imageModal.addEventListener('click', function() {
        imageModal.classList.remove('active');
        modalImg.classList.remove('modal-content-active');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            imageModal.classList.remove('active');
            modalImg.classList.remove('modal-content-active');
        }
    });
});
