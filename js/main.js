/* ── Header scroll effect ── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Analytics helper ── */
function trackEvent(name, params = {}) {
    if (typeof gtag === 'function') gtag('event', name, params);
}

/* ── Lista de espera ──
 * Os dois formulários (seção CTA e modal) gravam numa planilha do Google via
 * Apps Script (ver `apps-script/README.md`). Enquanto a URL não estiver
 * configurada, cai no mailto para não perder o cadastro.
 */
const WAITLIST_ENDPOINT = '';
const WAITLIST_FALLBACK_EMAIL = 'contato@helpme.technology';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function roleLabel(role) {
    return role === 'profissional' ? 'Prestador de serviços' : 'Cliente';
}

function openMailtoFallback(email, role) {
    const subject = `Lista de espera — ${roleLabel(role)}`;
    const body = `Perfil: ${roleLabel(role)}\nE-mail: ${email}`;
    window.location.href = `mailto:${WAITLIST_FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function postWaitlist({ email, role, source, website }) {
    // x-www-form-urlencoded é "simple request": sem preflight CORS, que o
    // Apps Script não responde.
    const response = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams({ email, role, source, website }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (!result.ok) throw new Error(result.error || 'falha ao gravar');
}

function setupWaitlistForm(form, successEl, source) {
    if (!form) return;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const errorEl = form.querySelector('[data-waitlist-error]');
    const submitLabel = submitBtn.textContent;

    function showError(message) {
        errorEl.textContent = message;
        errorEl.hidden = false;
        emailInput.setAttribute('aria-invalid', 'true');
    }

    function clearError() {
        errorEl.hidden = true;
        errorEl.textContent = '';
        emailInput.removeAttribute('aria-invalid');
    }

    emailInput.addEventListener('input', clearError);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError();

        const email = emailInput.value.trim();
        if (!EMAIL_PATTERN.test(email)) {
            showError('Digite um e-mail válido.');
            emailInput.focus();
            return;
        }

        const role = form.querySelector('input[name="role"]:checked')?.value ?? 'cliente';
        const website = form.querySelector('input[name="website"]')?.value ?? '';

        if (!WAITLIST_ENDPOINT) {
            trackEvent('waitlist_submit', { method: source, role, channel: 'mailto' });
            openMailtoFallback(email, role);
            form.hidden = true;
            successEl.hidden = false;
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando…';
        try {
            await postWaitlist({ email, role, source, website });
            trackEvent('waitlist_submit', { method: source, role, channel: 'sheets' });
            form.hidden = true;
            successEl.hidden = false;
        } catch (err) {
            trackEvent('waitlist_error', { method: source });
            showError('Não conseguimos registrar agora. Tente de novo em instantes.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
        }
    });
}

setupWaitlistForm(
    document.getElementById('waitlist-form'),
    document.getElementById('waitlist-success'),
    'section',
);

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
        trackEvent('waitlist_open', { source: btn.closest('header') ? 'header' : 'hero' });
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

setupWaitlistForm(modalForm, modalSuccess, 'modal');

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