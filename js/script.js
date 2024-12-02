const menuToggle = document.querySelector('.header__menu-toggle');
const menu = document.querySelector('.header__menu');
const menuIcons = document.querySelectorAll('.header__menu-icon');
const menuLinks = document.querySelectorAll('.header__menu-link');

function updateMenuIcon() {
    if (menu.classList.contains('header__menu--show')) {
        menuIcons[0].classList.add('header__menu-icon--hide');
        menuIcons[1].classList.remove('header__menu-icon--hide');
    } else {
        menuIcons[1].classList.add('header__menu-icon--hide');
        menuIcons[0].classList.remove('header__menu-icon--hide');
    }
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
    link.addEventListener('click', () => {
        menu.classList.remove('header__menu--show');
        updateMenuIcon();
    });
});