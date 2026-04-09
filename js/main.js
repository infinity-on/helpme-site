/* ── Header scroll effect ── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Waitlist form (seção CTA) ── */
const waitlistForm = document.getElementById('waitlist-form');
const waitlistSuccess = document.getElementById('waitlist-success');

if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!waitlistForm.querySelector('input[type="email"]').value) return;
        waitlistForm.hidden = true;
        waitlistSuccess.hidden = false;
    });
}

/* ── Modal de lista de espera ── */
const modal = document.getElementById('waitlist-modal');
const modalForm = document.getElementById('modal-waitlist-form');
const modalSuccess = document.getElementById('modal-waitlist-success');
const modalClose = modal.querySelector('.modal__close');

function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
}

function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
}

document.querySelectorAll('[data-waitlist-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
});

modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = modalForm.querySelector('input[type="email"]');
    if (!emailInput.value) return;

    const role = modalForm.querySelector('input[name="role"]:checked').value;
    const roleLabel = role === 'profissional' ? 'Prestador de serviços' : 'Cliente';
    const subject = `Lista de espera — ${roleLabel}`;
    const body = `Perfil: ${roleLabel}\nE-mail: ${emailInput.value}`;

    window.location.href = `mailto:contato@helpme.technology?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    modalForm.hidden = true;
    modalSuccess.hidden = false;
});

/* ── Ano dinâmico no footer ── */
document.getElementById('copyright-year').textContent = new Date().getFullYear();

/* ── Animações de entrada no scroll ── */
const animEls = document.querySelectorAll('[data-animate]');

// Exclui os elementos do hero (já animados por CSS)
const heroSection = document.querySelector('.hero-section');
const scrollAnimEls = Array.from(animEls).filter(el => !heroSection.contains(el));

const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

scrollAnimEls.forEach(el => animObserver.observe(el));

/* ── Menu ── */
const menuToggle = document.querySelector('.header__menu-toggle');
const menu = document.querySelector('.header__menu');
const [menuIconOpen, menuIconClose] = document.querySelectorAll('.header__menu-icon');
const menuLinks = document.querySelectorAll('.header__menu-link');
// Observa apenas seções que têm link correspondente no nav
const navIds = Array.from(menuLinks).map(l => l.getAttribute('href').slice(1));
const sections = Array.from(document.querySelectorAll('section[id]'))
    .filter(s => navIds.includes(s.id));

let lastActivedMenuLink = document.querySelector('.header__menu-item--active .header__menu-link');
let notExecuteIntersectionObserver = false;
let notExecuteIntersectionObserverTimeout = null;

const observer = new IntersectionObserver((entries) => {
    if (notExecuteIntersectionObserver) return;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const link = document.querySelector(`.header__menu-link[href="#${entry.target.id}"]`);
            if (!link) return;
            if (lastActivedMenuLink) {
                lastActivedMenuLink.parentElement.classList.remove('header__menu-item--active');
            }
            link.parentElement.classList.add('header__menu-item--active');
            lastActivedMenuLink = link;
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.4
});

sections.forEach(section => observer.observe(section));

function updateMenuIcon() {
    const isMenuVisible = menu.classList.contains('header__menu--show');
    menuIconOpen.classList.toggle('header__menu-icon--hide', isMenuVisible);
    menuIconClose.classList.toggle('header__menu-icon--hide', !isMenuVisible);
}

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('header__menu--show');
    menuToggle.setAttribute('aria-expanded', menu.classList.contains('header__menu--show'));
    updateMenuIcon();
});

document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menu.classList.remove('header__menu--show');
        menuToggle.setAttribute('aria-expanded', 'false');
        updateMenuIcon();
    }
});

menuLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        menu.classList.remove('header__menu--show');
        updateMenuIcon();

        const href = link.getAttribute('href');
        const targetSection = document.querySelector(href);
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const sectionPosition = targetSection.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: sectionPosition - headerHeight,
                behavior: 'smooth',
            });

            menuToggle.setAttribute('aria-expanded', 'false');

            if (lastActivedMenuLink) {
                lastActivedMenuLink.parentElement.classList.remove('header__menu-item--active');
            }
            link.parentElement.classList.add('header__menu-item--active');
            lastActivedMenuLink = link;
            notExecuteIntersectionObserver = true;

            if (notExecuteIntersectionObserverTimeout) {
                clearTimeout(notExecuteIntersectionObserverTimeout);
            }

            notExecuteIntersectionObserverTimeout = setTimeout(() => {
                notExecuteIntersectionObserver = false;
            }, 1000);
        }
    });
});