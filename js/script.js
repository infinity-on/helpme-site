let lastScrollPosition = 0;
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.header__menu-toggle');
const menu = document.querySelector('.header__menu');
const menuLinks = document.querySelectorAll('.header__menu-link');
const SCROLL_THRESHOLD = 14;
let isScrolling = false;

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScroll();
            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

function handleScroll() {
    const currentScrollPosition = window.scrollY;
    if (currentScrollPosition - lastScrollPosition > SCROLL_THRESHOLD) {
        header.classList.add('header--hidden');
        menu.classList.remove('header__menu--show');
    } else if (currentScrollPosition < lastScrollPosition) {
        header.classList.remove('header--hidden');
    }

    lastScrollPosition = currentScrollPosition;
}

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('header__menu--show');
});

document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menu.classList.remove('header__menu--show');
    }
});

menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        menu.classList.remove('header__menu--show');
        header.classList.add('header--hidden');
    });
});