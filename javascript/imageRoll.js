
//PROJECT LUNA
//declarations
let lunasources = new Array('media/luna1.png','media/luna2.png','media/luna3.png');

let lunapos = 0;

let lunanext = document.getElementById("lunanext");
let lunaprevious = document.getElementById("lunaprevious");
let lunaimage = document.getElementById("lunaimages");


console.log(lunanext);
console.log(lunaprevious);
console.log(lunaimage);
//listeners
lunanext.addEventListener('click',lunanextImage);
lunaprevious.addEventListener('click',lunapreviousImage);

function lunanextImage(){
    lunapos++;
    lunaimageHandle();
}

function lunapreviousImage(){
    lunapos--;
    lunaimageHandle();
}

//main method
function lunaimageHandle(){
    let cap = Math.abs(lunapos%lunasources.length);    
    lunaimage.src=lunasources[cap];
}


// - - -- - - - - -- 
//PROJECT HP
//declarations
let hpsources = new Array('media/hp1.png','media/hp2.png','media/hp3.png');

let hppos = 0;

let hpnext = document.getElementById("hpnext");
let hpprevious = document.getElementById("hpprevious");
let hpimage = document.getElementById("hpimages");


console.log(hpnext);
console.log(hpprevious);
console.log(hpimage);
//listeners
hpnext.addEventListener('click',hpnextImage);
hpprevious.addEventListener('click',hppreviousImage);

function hpnextImage(){
    hppos++;
    hpimageHandle();
}

function hppreviousImage(){
    hppos--;
    hpimageHandle();
}

//main method
function hpimageHandle(){
    let cap = Math.abs(hppos%hpsources.length);    
    hpimage.src=hpsources[cap];
}
