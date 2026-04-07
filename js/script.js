document.addEventListener('DOMContentLoaded', () => {
    
    // --- Opening Animation ---
    const btnOpen = document.getElementById('btn-open');
    const openingOverlay = document.getElementById('opening-invitation');
    const bgMusic = document.getElementById('bg-music');
    const btnMusic = document.getElementById('btn-music');

    btnOpen.addEventListener('click', () => {
        openingOverlay.classList.add('closed');
        // Start music on click (browser policy usually needs interaction)
        bgMusic.play();
        btnMusic.classList.add('playing');
        
        // Remove overlay from DOM after animation
        setTimeout(() => {
            openingOverlay.style.display = 'none';
        }, 1000);
    });

    // --- Music Toggle ---
    btnMusic.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            btnMusic.classList.add('playing');
        } else {
            bgMusic.pause();
            btnMusic.classList.remove('playing');
        }
    });

    // --- Countdown Timer ---
    const targetDate = new Date('September 5, 2026 16:30:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const gap = targetDate - now;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        document.getElementById('days').innerText = d < 10 ? '0' + d : d;
        document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
        document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
        document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // --- Gallery Modal ---
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const imgSrc = button.getAttribute('data-img');
            const modalImg = document.getElementById('modalImg');
            modalImg.src = imgSrc;
        });
    }

    // --- RSVP Form ---
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpFeedback = document.getElementById('rsvp-feedback');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation check (Bootstrap handles most via required)
        const name = document.getElementById('name').value;
        if (!name) return;

        // Simulate API loading
        const btnSubmit = rsvpForm.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerText;
        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Enviando...';

        setTimeout(() => {
            rsvpForm.classList.add('d-none');
            rsvpFeedback.classList.remove('d-none');
            
            // --- WhatsApp Integration ---
            const phoneNumber = rsvpForm.querySelector('input[name="contact"]:checked').value;
            const attendance = rsvpForm.querySelector('input[name="attendance"]:checked').value === 'yes' ? 'Sim, com certeza!' : 'Infelizmente não posso';
            const guestCount = document.getElementById('guests').value;
            const userMessage = document.getElementById('message').value || 'Sem mensagem adicional.';

            const waText = `Olá Gabriel e Danielle!\n\n` +
                         `*Confirmação de Presença*\n` +
                         `*Nome:* ${name}\n` +
                         `*Comparecerá:* ${attendance}\n` +
                         `*Acompanhantes:* ${guestCount}\n` +
                         `*Mensagem:* ${userMessage}`;

            const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waText)}`;
            
            // Redirect to WhatsApp after showing the success message for 1.5s
            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 1500);

            // Log for verification
            console.log("RSVP Submitted:", {
                name,
                guests: guestCount,
                attendance,
                message: userMessage
            });
        }, 1000);
    });

    // --- Smooth Scroll Fix (Optional for legacy browsers) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});

// --- PIX Copy Function ---
function copyPix(elementId) {
    const pixText = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(pixText).then(() => {
        const toast = document.getElementById('copy-toast');
        toast.classList.remove('d-none');
        setTimeout(() => {
            toast.classList.add('d-none');
        }, 2500);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}
