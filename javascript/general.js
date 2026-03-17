//NAV BAR
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
});



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