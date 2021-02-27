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
/*
for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}*/