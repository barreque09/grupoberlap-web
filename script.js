document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const service = document.getElementById('service-type').value;
        const message = document.getElementById('message').value;

        if (name && email && message && service !== "Elija un servicio...") {
            formFeedback.innerHTML = `
                <div class="alert alert-success" role="alert">
                    ¡Gracias, ${name}! Hemos recibido su mensaje y nos pondremos en contacto pronto.
                </div>
            `;
            contactForm.reset();
        } else {
             formFeedback.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Por favor, complete todos los campos requeridos.
                </div>
            `;
        }
    });

    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Close the navbar when a link is clicked (for mobile view)
    const navLinks = document.querySelectorAll('.nav-link');
    const navCollapse = document.querySelector('.navbar-collapse');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Check if the navbar is collapsed (mobile view)
            if (navCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });

    // Flip card behavior for magnetic particles (toggle on click, hover on pointer-capable)
    // Apply flip behavior to all flip-card elements (supports multiple service cards)
    document.querySelectorAll('.flip-card').forEach(flipCardEl => {
        flipCardEl.addEventListener('click', () => {
            flipCardEl.classList.toggle('is-flipped');
        });
        flipCardEl.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                flipCardEl.classList.add('is-flipped');
            }
        });
        flipCardEl.addEventListener('mouseleave', () => {
            if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                flipCardEl.classList.remove('is-flipped');
            }
        });
    });
});