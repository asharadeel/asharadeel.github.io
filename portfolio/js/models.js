//3D MODELLING
//puts the two highlight boxes on the page, and builds the full gallery
//behind the view more button - one big picture at the top, then rows of
//different widths, then a folder for each car.
//clicking a folder opens that car in a two wide grid, and clicking any
//picture opens it full size.
//to change any of it, edit models/gallery.json

//declarations
let modelsGrid = document.getElementById("modelsGrid");
let viewMore = document.querySelector(".viewMore");

//everything that was loaded
let modelData = null;

//the three layers, each built once and reused
let galleryView = null;
let galleryBody = null;
let folderView = null;
let folderTitle = null;
let folderYear = null;
let folderGrid = null;
let viewer = null;
let viewerImage = null;


//main method
loadModels();

async function loadModels() {
    try {
        modelData = await fetch("models/gallery.json").then(file => file.json());

        buildViewer();
        buildFolderView();
        buildGalleryView();
        showHighlights();
    }
    catch (error) {
        console.log(error);
        modelsGrid.innerHTML += "<p class='gamesError'>Could not load the gallery. If you opened this page by double clicking the file, run it through a local server instead.</p>";
    }
}


//file names here have spaces and hashes in them, and a hash cuts a url
//short, so every part of the path is encoded on its own
function encodePath(path) {
    return path.split('/').map(encodeURIComponent).join('/');
}


//finds a folder by its name
function findFolder(name) {
    for (let i = 0; i < modelData.folders.length; i++) {
        if (modelData.folders[i].name === name) {
            return modelData.folders[i];
        }
    }

    return null;
}


//---------- the two boxes on the page ----------

function showHighlights() {
    for (let i = 0; i < modelData.highlights.length; i++) {
        modelsGrid.appendChild(makeHighlight(modelData.highlights[i], i));
    }

    requestAnimationFrame(function() {
        let cards = modelsGrid.querySelectorAll('.reveal');
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.add('is-in');
        }
    });
}


//the same card as the games, so the two pages match
function makeHighlight(highlight, position) {
    let card = document.createElement('button');
    card.className = 'work gameCard reveal';
    card.type = 'button';
    card.style.setProperty('--i', position + 1);

    let background = document.createElement('span');
    background.className = 'gameCard__bg';
    background.style.backgroundImage = "url('" + encodePath(highlight.image) + "')";

    let scrim = document.createElement('span');
    scrim.className = 'gameCard__scrim';

    let year = document.createElement('span');
    year.className = 'gameCard__year';
    year.textContent = highlight.year;

    let body = document.createElement('span');
    body.className = 'gameCard__body';

    let title = document.createElement('span');
    title.className = 'gameCard__title';
    title.textContent = highlight.title;

    let go = document.createElement('span');
    go.className = 'gameCard__go';
    go.textContent = "Open";

    body.appendChild(title);
    body.appendChild(go);

    card.appendChild(background);
    card.appendChild(scrim);
    card.appendChild(year);
    card.appendChild(body);

    card.addEventListener('click', function() {
        let folder = findFolder(highlight.folder);

        if (folder) {
            openFolder(folder);
        }
    });

    return card;
}


//---------- the gallery, behind view more ----------

function buildGalleryView() {
    galleryView = document.createElement('dialog');
    galleryView.id = 'galleryView';

    let inner = document.createElement('div');
    inner.className = 'galleryViewInner';

    let top = document.createElement('div');
    top.className = 'gamesListTop';

    let heads = document.createElement('div');

    let heading = document.createElement('h2');
    heading.className = 'gamesListTitle';
    heading.textContent = "Gallery";

    let count = document.createElement('span');
    count.className = 'gamesListCount';
    count.textContent = countImages() + " Renders · " + modelData.folders.length + " Sets";

    heads.appendChild(heading);
    heads.appendChild(count);

    let close = document.createElement('button');
    close.className = 'gamesListClose';
    close.type = 'button';
    close.textContent = "Close";
    close.addEventListener('click', function() {
        galleryView.close();
    });

    top.appendChild(heads);
    top.appendChild(close);

    galleryBody = document.createElement('div');
    galleryBody.className = 'gallery';

    //the one massive picture the gallery opens on
    galleryBody.appendChild(makeShot(modelData.hero, 'shot shot--hero'));

    //then the uneven rows, three across and then two across
    for (let i = 0; i < modelData.rows.length; i++) {
        let row = document.createElement('div');
        row.className = 'galleryRow';
        row.style.setProperty('--cols', modelData.rows[i].images.length);

        for (let j = 0; j < modelData.rows[i].images.length; j++) {
            row.appendChild(makeShot(modelData.rows[i].images[j], 'shot'));
        }

        galleryBody.appendChild(row);
    }

    //and the sets, each one a folder that opens
    let heading2 = document.createElement('h3');
    heading2.className = 'galleryHeading';
    heading2.textContent = "Vehicles and Sets";
    galleryBody.appendChild(heading2);

    let folders = document.createElement('div');
    folders.className = 'folderRow';

    for (let i = 0; i < modelData.folders.length; i++) {
        folders.appendChild(makeFolder(modelData.folders[i]));
    }

    galleryBody.appendChild(folders);

    inner.appendChild(top);
    inner.appendChild(galleryBody);
    galleryView.appendChild(inner);
    document.body.appendChild(galleryView);

    if (viewMore) {
        viewMore.addEventListener('click', function() {
            galleryBody.scrollTop = 0;
            galleryView.showModal();
        });
    }
}


function countImages() {
    //the big one at the top, plus the rows, plus everything in the folders
    let total = 1;

    for (let i = 0; i < modelData.rows.length; i++) {
        total += modelData.rows[i].images.length;
    }

    for (let i = 0; i < modelData.folders.length; i++) {
        total += modelData.folders[i].images.length;
    }

    return total;
}


//one picture in the gallery
function makeShot(shot, className) {
    let box = document.createElement('button');
    box.className = className;
    box.type = 'button';

    let image = document.createElement('img');
    image.src = encodePath(shot.image);
    image.alt = shot.title || "";
    image.loading = 'lazy';

    box.appendChild(image);

    if (shot.title) {
        let label = document.createElement('span');
        label.className = 'shot__label';
        label.textContent = shot.title;

        if (shot.caption) {
            let caption = document.createElement('small');
            caption.textContent = shot.caption;
            label.appendChild(caption);
        }

        box.appendChild(label);
    }

    box.addEventListener('click', function() {
        openViewer(shot.image, shot.title);
    });

    return box;
}


//one folder on the gallery
function makeFolder(folder) {
    let box = document.createElement('button');
    box.className = 'folder';
    box.type = 'button';

    let image = document.createElement('img');
    image.src = encodePath(folder.cover);
    image.alt = folder.name;
    image.loading = 'lazy';

    let body = document.createElement('span');
    body.className = 'folder__body';

    let name = document.createElement('span');
    name.className = 'folder__name';
    name.textContent = folder.name;

    let meta = document.createElement('span');
    meta.className = 'folder__meta';
    meta.textContent = folder.year + " · " + folder.images.length + " Images";

    body.appendChild(name);
    body.appendChild(meta);

    box.appendChild(image);
    box.appendChild(body);

    box.addEventListener('click', function() {
        openFolder(folder);
    });

    return box;
}


//---------- a folder, two pictures wide ----------

function buildFolderView() {
    folderView = document.createElement('dialog');
    folderView.id = 'folderView';

    let inner = document.createElement('div');
    inner.className = 'folderViewInner';

    let top = document.createElement('div');
    top.className = 'folderViewTop';

    let heads = document.createElement('div');

    folderTitle = document.createElement('h2');
    folderTitle.className = 'folderViewTitle';

    folderYear = document.createElement('span');
    folderYear.className = 'folderViewYear';

    heads.appendChild(folderTitle);
    heads.appendChild(folderYear);

    let close = document.createElement('button');
    close.className = 'gamesListClose';
    close.type = 'button';
    close.textContent = "Close";
    close.addEventListener('click', function() {
        folderView.close();
    });

    top.appendChild(heads);
    top.appendChild(close);

    folderGrid = document.createElement('div');
    folderGrid.className = 'folderViewGrid';

    inner.appendChild(top);
    inner.appendChild(folderGrid);
    folderView.appendChild(inner);
    document.body.appendChild(folderView);
}


function openFolder(folder) {
    folderTitle.textContent = folder.name;
    folderYear.textContent = folder.year + " · " + folder.images.length + " Images";

    folderGrid.innerHTML = "";
    folderGrid.scrollTop = 0;

    //one on its own goes full width, an even number goes two across,
    //anything else goes three so there is never a lonely one at the end
    let columns = 3;

    if (folder.images.length === 1) {
        columns = 1;
    }
    else if (folder.images.length % 2 === 0) {
        columns = 2;
    }

    folderGrid.style.setProperty("--cols", columns);

    //a set that fits on one row is stretched to fill the height
    folderGrid.classList.toggle("folderViewGrid--single", folder.images.length <= columns);

    for (let i = 0; i < folder.images.length; i++) {
        folderGrid.appendChild(makeShot({ image: folder.images[i] }, 'shot shot--folder'));
    }

    folderView.showModal();
}


//---------- one picture, full size ----------

function buildViewer() {
    viewer = document.createElement('dialog');
    viewer.id = 'shotViewer';

    viewerImage = document.createElement('img');
    viewerImage.id = 'shotViewerImage';
    viewerImage.alt = "";

    let close = document.createElement('button');
    close.className = 'shotViewerClose';
    close.type = 'button';
    close.textContent = "Close";
    close.addEventListener('click', function() {
        viewer.close();
    });

    viewer.appendChild(viewerImage);
    viewer.appendChild(close);
    document.body.appendChild(viewer);

    //close when the dark area around the picture is clicked
    viewer.addEventListener('click', function(event) {
        if (event.target === viewer) {
            viewer.close();
        }
    });
}


function openViewer(image, title) {
    viewerImage.src = encodePath(image);
    viewerImage.alt = title || "";
    viewer.showModal();
}
