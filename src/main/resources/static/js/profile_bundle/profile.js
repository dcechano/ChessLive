let collapsibles = document.getElementsByClassName('collapsible');

for (let button of collapsibles) {
    button.addEventListener('click', () => {
        button.classList.toggle('open');
        let iTag = button.getElementsByTagName('i')[0];
        iTag.classList.toggle('fa-arrow-down');
        iTag.classList.toggle('fa-arrow-up');
        let child = button.nextElementSibling;
        let curr = child.style.display;
        child.style.display = (curr === 'flex') ? 'none' : 'flex';

    });
}
/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
let prevScroll = window.pageYOffset;
window.onscroll = () => {
    let currentScrollPos = window.pageYOffset;
    let nav = document.getElementsByClassName('nav')[0];
    if (prevScroll > currentScrollPos) {
        nav.style.top = '0';
    } else {
        nav.style.top = '-50px';
    }
    prevScroll = currentScrollPos;
}
