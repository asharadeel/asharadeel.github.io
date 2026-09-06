//PROJECTS
//reads every project from the projects folder, makes a button for each one,
//and opens that project in a card when the button is clicked.
//to add a project: make a new .json in the projects folder, then add its
//file name to projects/index.json

//declarations
let professionalButtons = document.getElementById("professionalButtons");
let gamesButtons = document.getElementById("gamesButtons");

let card = document.getElementById("projectCard");
let cardTitle = document.getElementById("cardTitle");
let cardDate = document.getElementById("cardDate");
let cardTech = document.getElementById("cardTech");
let cardDescription = document.getElementById("cardDescription");
let cardLinks = document.getElementById("cardLinks");
let cardClose = document.getElementById("cardClose");

let cardImageRoll = document.getElementById("cardImageRoll");
let cardImage = document.getElementById("cardImage");
let cardNext = document.getElementById("cardNext");
let cardPrevious = document.getElementById("cardPrevious");

//images of the project that is currently open
let cardsources = new Array();
let cardpos = 0;

//listeners
cardNext.addEventListener('click', cardNextImage);
cardPrevious.addEventListener('click', cardPreviousImage);
cardClose.addEventListener('click', closeCard);

//close when the dark area around the card is clicked
card.addEventListener('click', function(event) {
    if (event.target === card) {
        closeCard();
    }
});


//main method - load the list of projects, then load each project in turn
loadProjects();

async function loadProjects() {
    try {
        let response = await fetch("projects/index.json");
        let list = await response.json();

        for (let i = 0; i < list.length; i++) {
            let project = await fetch("projects/" + list[i]).then(file => file.json());
            makeButton(project);
        }
    }
    catch (error) {
        console.log(error);
        professionalButtons.innerHTML = "<p class='textbox'>Could not load the projects. If you opened this page by double clicking the file, run it through a local server instead.</p>";
    }
}


//makes one button and puts it in the right section
function makeButton(project) {
    let button = document.createElement('button');
    button.className = 'projButton';

    let title = document.createElement('span');
    title.className = 'projButtonTitle';
    title.textContent = project.title;

    let date = document.createElement('span');
    date.className = 'projButtonDate';
    date.textContent = project.date;

    let summary = document.createElement('span');
    summary.className = 'projButtonSummary';
    summary.textContent = project.summary;

    button.appendChild(title);
    button.appendChild(date);
    button.appendChild(summary);

    button.addEventListener('click', function() {
        openCard(project);
    });

    if (project.category === "professional") {
        professionalButtons.appendChild(button);
    }
    else {
        gamesButtons.appendChild(button);
    }
}


//fills the card with one project and opens it
function openCard(project) {
    cardTitle.textContent = project.title;
    cardDate.textContent = project.date;
    cardTech.textContent = "Developed using " + project.tech + ".";
    cardDescription.innerHTML = project.description;

    //images - only show the image roll if the project has images
    cardsources = project.images;
    cardpos = 0;

    if (cardsources.length > 0) {
        cardImageRoll.style.display = 'grid';
        cardImage.src = cardsources[0];
        cardImage.alt = project.title;
    }
    else {
        cardImageRoll.style.display = 'none';
    }

    //hide the arrows when there is only one image to look at
    if (cardsources.length > 1) {
        cardNext.style.visibility = 'visible';
        cardPrevious.style.visibility = 'visible';
    }
    else {
        cardNext.style.visibility = 'hidden';
        cardPrevious.style.visibility = 'hidden';
    }

    //links
    cardLinks.innerHTML = "";
    for (let i = 0; i < project.links.length; i++) {
        let link = document.createElement('a');
        link.className = 'abutton';
        link.href = project.links[i].url;
        link.target = '_blank';
        link.textContent = project.links[i].label;
        cardLinks.appendChild(link);
    }

    card.showModal();
}

function closeCard() {
    card.close();
}


//image roll inside the open card
function cardNextImage() {
    cardpos++;
    cardImageHandle();
}

function cardPreviousImage() {
    cardpos--;
    cardImageHandle();
}

function cardImageHandle() {
    //wraps both ways - the extra length keeps it positive when going backwards
    let cap = ((cardpos % cardsources.length) + cardsources.length) % cardsources.length;
    cardImage.src = cardsources[cap];
}
