let info = document.getElementById('info');
info.addEventListener('click', () => {
    let tiny = document.getElementsByClassName('tiny')[0];
    let curr = tiny.style.display;
    tiny.style.display = (curr === 'none') ? 'inline' : 'none';
});
