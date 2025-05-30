// Create button SCROLL TO TOP
const topButton = document.createElement('a');
topButton.href = '#top';
topButton.className = 'topbutton';

const arrowImg = document.createElement('img');
arrowImg.src = 'media/arrowup.png';
topButton.appendChild(arrowImg);

document.body.appendChild(topButton);

window.addEventListener('scroll', () => {
    topButton.style.opacity = window.scrollY > 300 ? '1' : '0';
});