//IMAGE VIEWER
//makes every picture on the page clickable - clicking one opens it big
//over a dark overlay. images inside links, buttons and the nav bar are
//left alone so they still do what they are meant to do.
//once open, tapping the picture zooms it in and it can be dragged around.

//declarations - the viewer is built once and reused for every image
let viewer = document.createElement('dialog');
viewer.id = 'imageViewer';

let viewerInner = document.createElement('div');
viewerInner.className = 'viewerInner';

//the frame is what scrolls when the picture is zoomed in
let viewerFrame = document.createElement('div');
viewerFrame.className = 'viewerFrame';

let viewerImage = document.createElement('img');
viewerImage.id = 'viewerImage';
viewerImage.src = "";
viewerImage.alt = "";
viewerImage.draggable = false;

//the x in the corner is for desktop, the button underneath is for phones
let viewerCross = document.createElement('button');
viewerCross.id = 'viewerCross';

let viewerCrossIcon = document.createElement('img');
viewerCrossIcon.src = 'media/cross-button.png';
viewerCrossIcon.alt = 'close';
viewerCross.appendChild(viewerCrossIcon);

let viewerClose = document.createElement('button');
viewerClose.id = 'viewerClose';
viewerClose.textContent = "Close";

viewerFrame.appendChild(viewerImage);
viewerInner.appendChild(viewerFrame);
viewerInner.appendChild(viewerCross);
viewerInner.appendChild(viewerClose);
viewer.appendChild(viewerInner);
document.body.appendChild(viewer);

//used while the picture is being dragged around
let dragging = false;
let dragX = 0;
let dragY = 0;
let dragLeft = 0;
let dragTop = 0;
let dragged = false;

//listeners
viewerCross.addEventListener('click', closeViewer);
viewerClose.addEventListener('click', closeViewer);

//close when the dark area around the picture is clicked
viewer.addEventListener('click', function(event) {
    if (event.target === viewer || event.target === viewerInner || event.target === viewerFrame) {
        closeViewer();
    }
});

//one listener for the whole page, so pictures added later work too
document.addEventListener('click', function(event) {
    let image = event.target;

    if (image === viewerImage) {
        //a drag across the picture is not meant to zoom it back out
        if (!dragged) {
            toggleZoom();
        }
        dragged = false;
    }
    else if (image.tagName === 'IMG' && canOpen(image)) {
        openViewer(image);
    }
});

//dragging the zoomed picture with a mouse - a finger already scrolls the frame
viewerImage.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', moveDrag);
window.addEventListener('mouseup', stopDrag);


//pictures that already do something when clicked are skipped
function canOpen(image) {
    if (image.closest('a') || image.closest('button')) {
        return false;
    }
    if (image.closest('nav') || image.closest('footer')) {
        return false;
    }
    return true;
}


//main methods
function openViewer(image) {
    viewerImage.src = image.currentSrc || image.src;
    viewerImage.alt = image.alt;
    setZoom(false);

    document.documentElement.classList.add('viewerOpen');
    document.body.classList.add('viewerOpen');
    viewer.showModal();
}

function closeViewer() {
    viewer.close();
}

//tidying up happens here so that esc closing the picture is covered too
viewer.addEventListener('close', function() {
    setZoom(false);
    viewerImage.src = "";
    document.documentElement.classList.remove('viewerOpen');
    document.body.classList.remove('viewerOpen');
});


//zoom - the picture grows past the frame, which then scrolls
function toggleZoom() {
    setZoom(!viewerImage.classList.contains('zoomed'));
}

//the frame is only allowed to scroll while the picture is bigger than it is
function setZoom(on) {
    viewerImage.classList.toggle('zoomed', on);
    viewerFrame.classList.toggle('zoomed', on);

    if (on) {
        centreFrame();
    }
}

//starts the zoom off in the middle instead of the top left corner
function centreFrame() {
    viewerFrame.scrollLeft = (viewerFrame.scrollWidth - viewerFrame.clientWidth) / 2;
    viewerFrame.scrollTop = (viewerFrame.scrollHeight - viewerFrame.clientHeight) / 2;
}


//drag to move around a zoomed picture
function startDrag(event) {
    if (!viewerImage.classList.contains('zoomed')) {
        return;
    }

    dragging = true;
    dragged = false;
    dragX = event.clientX;
    dragY = event.clientY;
    dragLeft = viewerFrame.scrollLeft;
    dragTop = viewerFrame.scrollTop;

    viewerImage.style.cursor = 'grabbing';
    event.preventDefault();
}

function moveDrag(event) {
    if (!dragging) {
        return;
    }

    dragged = true;
    viewerFrame.scrollLeft = dragLeft - (event.clientX - dragX);
    viewerFrame.scrollTop = dragTop - (event.clientY - dragY);
}

function stopDrag() {
    dragging = false;
    viewerImage.style.cursor = "";
}
