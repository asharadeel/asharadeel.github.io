//MUSIC
//puts the two highlight albums on the page and builds the album directory
//behind the view more button. clicking an album opens its track list.
//every track is a 30 second preview taken from the middle of the song -
//the full tracks are not on the site at all, so there is nothing to take.
//to change any of it, edit music/albums.json

//declarations
let musicGrid = document.getElementById("musicGrid");
let viewMore = document.querySelector(".viewMore");

let musicData = null;

//the one player the whole page shares, so two tracks can never overlap
let player = new Audio();
player.preload = "none";

//the row that is playing at the moment
let playingRow = null;

//the layers, each built once and reused
let directory = null;
let albumView = null;
let albumCover = null;
let albumTitle = null;
let albumMeta = null;
let albumTracks = null;


//main method
loadMusic();

async function loadMusic() {
    try {
        musicData = await fetch("music/albums.json").then(file => file.json());

        buildAlbumView();
        buildDirectory();
        showHighlights();
    }
    catch (error) {
        console.log(error);
        musicGrid.innerHTML += "<p class='gamesError'>Could not load the music. If you opened this page by double clicking the file, run it through a local server instead.</p>";
    }
}


//file names can have spaces in them, so each part of the path is encoded
function encodePath(path) {
    return path.split('/').map(encodeURIComponent).join('/');
}


function trackCount() {
    let total = 0;

    for (let i = 0; i < musicData.albums.length; i++) {
        total += musicData.albums[i].tracks.length;
    }

    return total;
}


//---------- playing ----------

//only ever one preview at a time
function playTrack(track, row) {
    if (playingRow === row) {
        stopTrack();
        return;
    }

    stopTrack();

    player.src = encodePath(track.preview);
    player.currentTime = 0;
    player.play();

    playingRow = row;
    row.classList.add('is-playing');
}


function stopTrack() {
    player.pause();

    if (playingRow) {
        playingRow.classList.remove('is-playing');
        playingRow = null;
    }
}


//the preview runs out on its own at the end of the thirty seconds
player.addEventListener('ended', stopTrack);


//---------- the two albums on the page ----------

function showHighlights() {
    for (let i = 0; i < 2 && i < musicData.albums.length; i++) {
        musicGrid.appendChild(makeAlbumCard(musicData.albums[i], i));
    }

    requestAnimationFrame(function() {
        let cards = musicGrid.querySelectorAll('.reveal');
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.add('is-in');
        }
    });
}


//the same card the games and models pages use, so the three pages match
function makeAlbumCard(album, position) {
    let card = document.createElement('button');
    card.className = 'work gameCard reveal';
    card.type = 'button';
    card.style.setProperty('--i', position + 1);

    let background = document.createElement('span');
    background.className = 'gameCard__bg';
    background.style.backgroundImage = "url('" + encodePath(album.cover) + "')";

    let scrim = document.createElement('span');
    scrim.className = 'gameCard__scrim';

    let count = document.createElement('span');
    count.className = 'gameCard__year';
    count.textContent = album.tracks.length + " Tracks";

    let body = document.createElement('span');
    body.className = 'gameCard__body';

    let title = document.createElement('span');
    title.className = 'gameCard__title';
    title.textContent = album.name;

    let go = document.createElement('span');
    go.className = 'gameCard__go';
    go.textContent = "Open";

    body.appendChild(title);
    body.appendChild(go);

    card.appendChild(background);
    card.appendChild(scrim);
    card.appendChild(count);
    card.appendChild(body);

    card.addEventListener('click', function() {
        openAlbum(album);
    });

    return card;
}


//---------- the directory, behind view more ----------

function buildDirectory() {
    directory = document.createElement('dialog');
    directory.id = 'albumDirectory';

    let inner = document.createElement('div');
    inner.className = 'galleryViewInner';

    let top = document.createElement('div');
    top.className = 'gamesListTop';

    let heads = document.createElement('div');

    let heading = document.createElement('h2');
    heading.className = 'gamesListTitle';
    heading.textContent = "Albums";

    let count = document.createElement('span');
    count.className = 'gamesListCount';
    count.textContent = musicData.albums.length + " Albums · " + trackCount() + " Tracks";

    heads.appendChild(heading);
    heads.appendChild(count);

    let close = document.createElement('button');
    close.className = 'gamesListClose';
    close.type = 'button';
    close.textContent = "Close";
    close.addEventListener('click', function() {
        directory.close();
    });

    top.appendChild(heads);
    top.appendChild(close);

    let shelf = document.createElement('div');
    shelf.className = 'albumShelf';

    for (let i = 0; i < musicData.albums.length; i++) {
        shelf.appendChild(makeShelfAlbum(musicData.albums[i]));
    }

    inner.appendChild(top);
    inner.appendChild(shelf);
    directory.appendChild(inner);
    document.body.appendChild(directory);

    if (viewMore) {
        viewMore.addEventListener('click', function() {
            shelf.scrollTop = 0;
            directory.showModal();
        });
    }
}


//one album on the shelf
function makeShelfAlbum(album) {
    let box = document.createElement('button');
    box.className = 'albumTile';
    box.type = 'button';

    let art = document.createElement('img');
    art.className = 'albumTile__art';
    art.src = encodePath(album.cover);
    art.alt = album.name;
    art.loading = 'lazy';
    art.draggable = false;

    let name = document.createElement('span');
    name.className = 'albumTile__name';
    name.textContent = album.name;

    let meta = document.createElement('span');
    meta.className = 'albumTile__meta';
    meta.textContent = album.tracks.length + " Tracks";

    box.appendChild(art);
    box.appendChild(name);
    box.appendChild(meta);

    box.addEventListener('click', function() {
        openAlbum(album);
    });

    return box;
}


//---------- one album and its tracks ----------

function buildAlbumView() {
    albumView = document.createElement('dialog');
    albumView.id = 'albumView';

    let inner = document.createElement('div');
    inner.className = 'albumViewInner';

    let side = document.createElement('div');
    side.className = 'albumSide';

    albumCover = document.createElement('img');
    albumCover.className = 'albumSide__art';
    albumCover.alt = "";
    albumCover.draggable = false;

    albumTitle = document.createElement('h2');
    albumTitle.className = 'albumSide__title';

    albumMeta = document.createElement('span');
    albumMeta.className = 'albumSide__meta';

    let note = document.createElement('p');
    note.className = 'albumSide__note';
    note.textContent = "Previews only - thirty seconds from the middle of each track.";

    let close = document.createElement('button');
    close.className = 'gamesListClose albumSide__close';
    close.type = 'button';
    close.textContent = "Close";
    close.addEventListener('click', function() {
        albumView.close();
    });

    side.appendChild(albumCover);
    side.appendChild(albumTitle);
    side.appendChild(albumMeta);
    side.appendChild(note);
    side.appendChild(close);

    albumTracks = document.createElement('div');
    albumTracks.className = 'trackList';

    inner.appendChild(side);
    inner.appendChild(albumTracks);
    albumView.appendChild(inner);
    document.body.appendChild(albumView);

    //nothing keeps playing once the album is shut
    albumView.addEventListener('close', stopTrack);
}


function openAlbum(album) {
    stopTrack();

    albumCover.src = encodePath(album.cover);
    albumCover.alt = album.name;
    albumTitle.textContent = album.name;
    albumMeta.textContent = album.tracks.length + " Tracks";

    albumTracks.innerHTML = "";
    albumTracks.scrollTop = 0;

    for (let i = 0; i < album.tracks.length; i++) {
        albumTracks.appendChild(makeTrackRow(album.tracks[i], i + 1));
    }

    if (directory && directory.open) {
        directory.close();
    }

    albumView.showModal();
}


//one track - a number, a name, and the one button that plays it
function makeTrackRow(track, position) {
    let row = document.createElement('div');
    row.className = 'track';

    let number = document.createElement('span');
    number.className = 'track__number';
    number.textContent = position < 10 ? "0" + position : String(position);

    let title = document.createElement('span');
    title.className = 'track__title';
    title.textContent = track.title;

    let time = document.createElement('span');
    time.className = 'track__time';
    time.textContent = "0:30";

    let button = document.createElement('button');
    button.className = 'track__play';
    button.type = 'button';
    button.setAttribute('aria-label', "Play " + track.title);

    //two shapes, the css shows whichever one belongs
    button.innerHTML = "<span class='icon icon--play'></span><span class='icon icon--pause'></span>";

    button.addEventListener('click', function() {
        playTrack(track, row);
    });

    row.appendChild(button);
    row.appendChild(number);
    row.appendChild(title);
    row.appendChild(time);

    return row;
}
