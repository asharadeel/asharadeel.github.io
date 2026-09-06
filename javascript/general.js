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



//PORTFOLIO POPUP
//the portfolio link in the nav bar leads to a separate site with its own
//design, so it asks first instead of jumping straight there.
//the box is built once here and reused by every portfolio link on the page.

let portfolioPopup = document.createElement('dialog');
portfolioPopup.id = 'portfolioPopup';

let popupInner = document.createElement('div');
popupInner.className = 'popupInner';

let popupTitle = document.createElement('h3');
popupTitle.textContent = "Continue to Portfolio";

let popupText = document.createElement('p');
popupText.textContent = "You are leaving the main site. My portfolio is a separate space for my music, 3D modelling, Roblox and other work.";

let popupButtons = document.createElement('div');
popupButtons.className = 'popupButtons';

//an a tag so it still opens in a new tab on a middle click
let popupContinue = document.createElement('a');
popupContinue.className = 'abutton';
popupContinue.id = 'popupContinue';
popupContinue.href = 'portfolio/portfolio-index.html';
popupContinue.textContent = "Continue";

let popupCancel = document.createElement('button');
popupCancel.id = 'popupCancel';
popupCancel.textContent = "Cancel";

popupButtons.appendChild(popupCancel);
popupButtons.appendChild(popupContinue);
popupInner.appendChild(popupTitle);
popupInner.appendChild(popupText);
popupInner.appendChild(popupButtons);
portfolioPopup.appendChild(popupInner);
document.body.appendChild(portfolioPopup);

//every nav link that points at the portfolio opens the box instead
let portfolioLinks = document.querySelectorAll('nav a[href*="portfolio/portfolio-index.html"], nav a#portfolio-link-cv');

portfolioLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
        //a middle click or ctrl click still opens it in a new tab as normal
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        event.preventDefault();

        //the href is taken off the link itself so it works from any page
        popupContinue.href = link.getAttribute('href');
        portfolioPopup.showModal();
    });
});

popupCancel.addEventListener('click', function() {
    portfolioPopup.close();
});

//close when the dark area around the box is clicked
portfolioPopup.addEventListener('click', function(event) {
    if (event.target === portfolioPopup) {
        portfolioPopup.close();
    }
});