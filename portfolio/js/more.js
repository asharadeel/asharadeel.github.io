//MORE
//puts the video projects on the page. clicking one opens a page of its own
//with every video on it - each one plays in place, and links out to youtube.
//a project is either a set of videos or a set of websites - a website
//preview loads the live site once it is asked for, the same way a video does.
//to change any of it, edit more/projects.json

//declarations
let moreGrid = document.getElementById("moreGrid");

let videoData = null;

//the project page, built once and reused
let projectView = null;
let projectTitle = null;
let projectMeta = null;
let projectText = null;
let projectList = null;


//main method
loadVideos();

async function loadVideos() {
    try {
        videoData = await fetch("more/projects.json").then(file => file.json());

        buildProjectView();
        showProjects();
    }
    catch (error) {
        console.log(error);
        moreGrid.innerHTML += "<p class='gamesError'>Could not load this page. If you opened it by double clicking the file, run it through a local server instead.</p>";
    }
}


function encodePath(path) {
    return path.split('/').map(encodeURIComponent).join('/');
}


//---------- the cards on the page ----------

function showProjects() {
    for (let i = 0; i < videoData.projects.length; i++) {
        moreGrid.appendChild(makeProjectCard(videoData.projects[i], i));
    }

    requestAnimationFrame(function() {
        let cards = moreGrid.querySelectorAll('.reveal');
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.add('is-in');
        }
    });
}


//the same card the other three pages use
function makeProjectCard(project, position) {
    let card = document.createElement('button');
    card.className = 'work gameCard reveal';
    card.type = 'button';
    card.style.setProperty('--i', position + 1);

    let background = document.createElement('span');
    background.className = 'gameCard__bg';
    background.style.backgroundImage = "url('" + encodePath(project.cover) + "')";

    let scrim = document.createElement('span');
    scrim.className = 'gameCard__scrim';

    let year = document.createElement('span');
    year.className = 'gameCard__year';
    year.textContent = project.year;

    let body = document.createElement('span');
    body.className = 'gameCard__body';

    let title = document.createElement('span');
    title.className = 'gameCard__title';
    title.textContent = project.name;

    let go = document.createElement('span');
    go.className = 'gameCard__go';
    go.textContent = itemsOf(project).length + (project.kind === 'site' ? " Sites" : " Videos");

    body.appendChild(title);
    body.appendChild(go);

    card.appendChild(background);
    card.appendChild(scrim);
    card.appendChild(year);
    card.appendChild(body);

    card.addEventListener('click', function() {
        openProject(project);
    });

    return card;
}


//---------- the project page ----------

function buildProjectView() {
    projectView = document.createElement('dialog');
    projectView.id = 'projectView';

    let inner = document.createElement('div');
    inner.className = 'galleryViewInner';

    let top = document.createElement('div');
    top.className = 'gamesListTop';

    let heads = document.createElement('div');

    projectTitle = document.createElement('h2');
    projectTitle.className = 'gamesListTitle';

    projectMeta = document.createElement('span');
    projectMeta.className = 'gamesListCount';

    heads.appendChild(projectTitle);
    heads.appendChild(projectMeta);

    let close = document.createElement('button');
    close.className = 'gamesListClose';
    close.type = 'button';
    close.textContent = "Close";
    close.addEventListener('click', function() {
        projectView.close();
    });

    top.appendChild(heads);
    top.appendChild(close);

    let body = document.createElement('div');
    body.className = 'projectBody';

    projectText = document.createElement('p');
    projectText.className = 'projectText';

    projectList = document.createElement('div');
    projectList.className = 'videoList';

    body.appendChild(projectText);
    body.appendChild(projectList);

    inner.appendChild(top);
    inner.appendChild(body);
    projectView.appendChild(inner);
    document.body.appendChild(projectView);

    //shutting the page stops whatever was playing, by emptying the players
    projectView.addEventListener('close', function() {
        let frames = projectList.querySelectorAll('iframe');
        for (let i = 0; i < frames.length; i++) {
            let data = frames[i].dataset;
            let back = data.url ? makeSiteThumb(data) : makeThumb(data);
            frames[i].parentNode.replaceChild(back, frames[i]);
        }
    });
}


//whichever kind of thing this project holds
function itemsOf(project) {
    return project.kind === 'site' ? project.sites : project.videos;
}


function openProject(project) {
    let items = itemsOf(project);

    projectTitle.textContent = project.name;
    projectMeta.textContent = items.length + (project.kind === 'site' ? " Sites · " : " Videos · ") + project.made;
    projectText.textContent = project.description;

    projectList.innerHTML = "";
    projectList.scrollTop = 0;

    for (let i = 0; i < items.length; i++) {
        projectList.appendChild(project.kind === 'site'
            ? makeSite(items[i])
            : makeVideo(items[i], project.channel));
    }

    projectView.showModal();
}


//one website - the screenshot sits there until it is pressed, then the real
//site is loaded into the frame in its place
function makeSite(site) {
    let box = document.createElement('article');
    box.className = 'video';

    let frame = document.createElement('div');
    frame.className = 'video__frame';
    frame.appendChild(makeSiteThumb(site));

    let body = document.createElement('div');
    body.className = 'video__body';

    let title = document.createElement('h3');
    title.className = 'video__title';
    title.textContent = site.title;

    let note = document.createElement('span');
    note.className = 'video__date';
    note.textContent = site.note;

    let links = document.createElement('div');
    links.className = 'video__links';

    let visit = document.createElement('a');
    visit.className = 'videoLink';
    visit.href = site.url;
    visit.target = '_blank';
    visit.rel = 'noopener';
    visit.textContent = "Visit Site";

    links.appendChild(visit);

    body.appendChild(title);
    body.appendChild(note);
    body.appendChild(links);

    box.appendChild(frame);
    box.appendChild(body);

    return box;
}


function makeSiteThumb(site) {
    let button = document.createElement('button');
    button.className = 'video__thumb';
    button.type = 'button';
    button.setAttribute('aria-label', "Open a preview of " + site.title);

    let image = document.createElement('img');
    image.src = encodePath(site.thumb);
    image.alt = site.title;
    image.loading = 'lazy';

    let play = document.createElement('span');
    play.className = 'video__play video__play--site';

    button.appendChild(image);
    button.appendChild(play);

    button.addEventListener('click', function() {
        let frame = document.createElement('iframe');
        frame.className = 'video__player';
        frame.src = site.url;
        frame.title = site.title;
        frame.loading = 'lazy';

        //a preview only - the site inside cannot reach back out of the frame
        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');

        frame.dataset.url = site.url;
        frame.dataset.thumb = site.thumb;
        frame.dataset.title = site.title;
        frame.dataset.note = site.note;

        button.parentNode.replaceChild(frame, button);
    });

    return button;
}


//one video - the thumbnail sits there until it is pressed, then it is
//swapped for the player. nothing loads from youtube until you ask for it
function makeVideo(video, channel) {
    let box = document.createElement('article');
    box.className = 'video';

    let frame = document.createElement('div');
    frame.className = 'video__frame';
    frame.appendChild(makeThumb(video));

    let body = document.createElement('div');
    body.className = 'video__body';

    let title = document.createElement('h3');
    title.className = 'video__title';
    title.textContent = video.title;

    let date = document.createElement('span');
    date.className = 'video__date';
    date.textContent = "Published " + video.published;

    let links = document.createElement('div');
    links.className = 'video__links';

    let watch = document.createElement('a');
    watch.className = 'videoLink';
    watch.href = "https://www.youtube.com/watch?v=" + video.id;
    watch.target = '_blank';
    watch.rel = 'noopener';
    watch.textContent = "Watch on YouTube";

    let chan = document.createElement('a');
    chan.className = 'videoLink';
    chan.href = channel;
    chan.target = '_blank';
    chan.rel = 'noopener';
    chan.textContent = "Channel";

    links.appendChild(watch);
    links.appendChild(chan);

    body.appendChild(title);
    body.appendChild(date);
    body.appendChild(links);

    box.appendChild(frame);
    box.appendChild(body);

    return box;
}


//the picture with the play button over it
function makeThumb(video) {
    let button = document.createElement('button');
    button.className = 'video__thumb';
    button.type = 'button';
    button.setAttribute('aria-label', "Play " + video.title);

    let image = document.createElement('img');
    image.src = encodePath(video.thumb);
    image.alt = video.title;
    image.loading = 'lazy';

    let play = document.createElement('span');
    play.className = 'video__play';

    button.appendChild(image);
    button.appendChild(play);

    button.addEventListener('click', function() {
        let frame = document.createElement('iframe');
        frame.className = 'video__player';
        frame.src = "https://www.youtube-nocookie.com/embed/" + video.id + "?autoplay=1&rel=0";
        frame.title = video.title;
        frame.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
        frame.allowFullscreen = true;

        //kept so the player can be swapped back for the picture on close
        frame.dataset.id = video.id;
        frame.dataset.thumb = video.thumb;
        frame.dataset.title = video.title;

        button.parentNode.replaceChild(frame, button);
    });

    return button;
}
