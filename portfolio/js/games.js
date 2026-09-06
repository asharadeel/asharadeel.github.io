//GAMES
//reads every game from the games folder and makes a card for each one.
//the card is the game picture with the title and year on top of it, and
//clicking it opens the game.
//to add a game: make a new .json in the games folder, then add its file
//name to games/index.json

//declarations
let gamesGrid = document.getElementById("gamesGrid");
let viewMore = document.querySelector(".viewMore");

//how many fit on the page - the rest are kept back for the view more list
let gamesLimit = Number(gamesGrid.dataset.limit || 0);

//every game that was loaded, in the order they are listed
let allGames = new Array();


//main method - load the list of games, then load each game in turn
loadGames();

async function loadGames() {
    try {
        let response = await fetch("games/index.json");
        let list = await response.json();

        for (let i = 0; i < list.length; i++) {
            let game = await fetch("games/" + list[i]).then(file => file.json());
            allGames.push(game);
        }

        showGames();
        buildList();
    }
    catch (error) {
        console.log(error);
        gamesGrid.innerHTML = "<p class='gamesError'>Could not load the games. If you opened this page by double clicking the file, run it through a local server instead.</p>";
    }
}


//puts the first few games on the page
function showGames() {
    let shown = gamesLimit > 0 ? allGames.slice(0, gamesLimit) : allGames;

    for (let i = 0; i < shown.length; i++) {
        gamesGrid.appendChild(makeCard(shown[i], i));
    }

    //the cards are built after the page has loaded, so they are faded in here
    //rather than by the observer in portfolio.js
    requestAnimationFrame(function() {
        let cards = gamesGrid.querySelectorAll('.reveal');
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.add('is-in');
        }
    });
}


//makes one game card
function makeCard(game, position) {
    //a game with no link yet is not clickable, so it is not a link
    let card = document.createElement(game.link ? 'a' : 'article');
    card.className = 'work gameCard reveal';
    card.style.setProperty('--i', position);

    if (game.link) {
        card.href = game.link;
        card.target = '_blank';
        card.rel = 'noopener';
    }

    //the picture sits behind everything else
    let background = document.createElement('span');
    background.className = 'gameCard__bg';

    if (game.image) {
        //the file names have spaces and capitals in them, so they are encoded
        background.style.backgroundImage = "url('" + encodeURI(game.image) + "')";
    }

    //keeps the title readable whatever the picture looks like
    let scrim = document.createElement('span');
    scrim.className = 'gameCard__scrim';

    let body = document.createElement('span');
    body.className = 'gameCard__body';

    let year = document.createElement('span');
    year.className = 'gameCard__year';
    year.textContent = game.year;

    let title = document.createElement('span');
    title.className = 'gameCard__title';
    title.textContent = game.title;

    body.appendChild(year);
    body.appendChild(title);

    if (game.link) {
        let go = document.createElement('span');
        go.className = 'gameCard__go';
        go.textContent = "Play";
        body.appendChild(go);
    }

    card.appendChild(background);
    card.appendChild(scrim);
    card.appendChild(body);

    return card;
}


//the full record - every game on a page of its own, opened by view more
function buildList() {
    if (!viewMore) {
        return;
    }

    let list = document.createElement('dialog');
    list.id = 'gamesList';

    let inner = document.createElement('div');
    inner.className = 'gamesListInner';

    let top = document.createElement('div');
    top.className = 'gamesListTop';

    let heads = document.createElement('div');

    let heading = document.createElement('h2');
    heading.className = 'gamesListTitle';
    heading.textContent = "All Games";

    let count = document.createElement('span');
    count.className = 'gamesListCount';
    count.textContent = allGames.length + " Games · 2017 to now";

    heads.appendChild(heading);
    heads.appendChild(count);

    let close = document.createElement('button');
    close.className = 'gamesListClose';
    close.type = 'button';
    close.textContent = "Close";

    top.appendChild(heads);
    top.appendChild(close);

    //the same cards as the highlights, just all of them
    let grid = document.createElement('div');
    grid.className = 'gamesListGrid';

    for (let i = 0; i < allGames.length; i++) {
        grid.appendChild(makeCard(allGames[i], i));
    }

    inner.appendChild(top);
    inner.appendChild(grid);
    list.appendChild(inner);
    document.body.appendChild(list);

    viewMore.addEventListener('click', function() {
        list.showModal();

        //the cards fade in each time the page is opened
        let cards = grid.querySelectorAll('.reveal');
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.remove('is-in');
        }

        requestAnimationFrame(function() {
            for (let i = 0; i < cards.length; i++) {
                cards[i].classList.add('is-in');
            }
        });
    });

    close.addEventListener('click', function() {
        list.close();
    });
}
