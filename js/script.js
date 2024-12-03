const menuToggle = document.querySelector('.header__menu-toggle');
const menu = document.querySelector('.header__menu');
const [menuIconOpen, menuIconClose] = document.querySelectorAll('.header__menu-icon');
const menuLinks = document.querySelectorAll('.header__menu-link');
const sections = document.querySelectorAll('section');
let lastActivedMenuLink = document.querySelector('.header__menu-item--active .header__menu-link');
let notExecuteIntersectionObserver = false;
let notExecuteIntersectionObserverTimeout = null;

const observer = new IntersectionObserver((entries) => {
    if (notExecuteIntersectionObserver) return;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const link = document.querySelector(`.header__menu-link[href="#${entry.target.id}"]`);
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
    threshold: 0.5
});

sections.forEach(section => observer.observe(section));

function updateMenuIcon() {
    const isMenuVisible = menu.classList.contains('header__menu--show');
    menuIconOpen.classList.toggle('header__menu-icon--hide', isMenuVisible);
    menuIconClose.classList.toggle('header__menu-icon--hide', !isMenuVisible);
}

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('header__menu--show');
    updateMenuIcon();
});

document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menu.classList.remove('header__menu--show');
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
            const headerHeight = document.querySelector('.header').offsetHeight / 2;
            const sectionPosition = targetSection.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: sectionPosition - headerHeight,
                behavior: 'smooth',
            });

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