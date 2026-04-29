document.addEventListener('DOMContentLoaded', () => {
    
    // --- Animação de Abertura ---
    const envelope = document.getElementById('envelope');
    const openingOverlay = document.getElementById('opening-invitation');
    const bgMusic = document.getElementById('bg-music');
    const btnMusic = document.getElementById('btn-music');

    envelope.addEventListener('click', () => {
        envelope.classList.add('open');

        // Inicia a música ao clicar (política dos navegadores exige interação do usuário)
        bgMusic.play();
        btnMusic.classList.add('playing');
        
        // Espera a animação do envelope terminar antes de remover o overlay
        setTimeout(() => {
            openingOverlay.classList.add('closed');
            // Remove o overlay do DOM após a animação de deslize
            setTimeout(() => {
                openingOverlay.style.display = 'none';
            }, 1000);
        }, 1500);
    });

    // --- Controle da Música ---
    btnMusic.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            btnMusic.classList.add('playing');
        } else {
            bgMusic.pause();
            btnMusic.classList.remove('playing');
        }
    });

    // --- Temporizador de Contagem Regressiva ---
    const targetDate = new Date('September 12, 2026 16:30:00').getTime();

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

    // --- Animações de Scroll (Intersection Observer) ---
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

    // --- Modal da Galeria ---
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const imgSrc = button.getAttribute('data-img');
            const modalImg = document.getElementById('modalImg');
            modalImg.src = imgSrc;
        });
    }

    // --- Formulário de RSVP ---
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpFeedback = document.getElementById('rsvp-feedback');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validação básica (o Bootstrap lida com a maioria via atributo required)
        const name = document.getElementById('name').value;
        if (!name) return;

        // Simula o carregamento da API
        const btnSubmit = rsvpForm.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerText;
        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Enviando...';

        setTimeout(() => {
            rsvpForm.classList.add('d-none');
            rsvpFeedback.classList.remove('d-none');
            
            // --- Integração com WhatsApp ---
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
            
            // Redireciona para o WhatsApp após mostrar a mensagem de sucesso por 1.5s
            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 1500);

            // Log para verificação
            console.log("RSVP Submitted:", {
                name,
                guests: guestCount,
                attendance,
                message: userMessage
            });
        }, 1000);
    });

    // --- Correção de Scroll Suave (Opcional para navegadores antigos) ---
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

// --- Função de Copiar PIX ---
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
