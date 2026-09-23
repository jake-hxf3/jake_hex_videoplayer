//Variables
const player = document.querySelector("video");
const playerCon = document.querySelector("#player-container");
const playButton = document.querySelector("#play-button");
const stopButton = document.querySelector("#stop-button");
const volButton = document.querySelector("#vol-button");
const volumeSlider = document.querySelector("#change-vol");
const fullScreen = document.querySelector("#full-screen");
const videoControls = document.querySelector("#video-controls");
const seeker = document.querySelector("#timeseek");

let timer = null;
let mouseOverControls = false;

// If JS is loaded then let's remove the default controls
player.controls = false;

//functions
function changeIcon(elem, state=true) {
    if(state){
        elem.firstElementChild.classList.toggle("hidden");
        elem.lastElementChild.classList.toggle("hidden");        
    }
}

function playVideo() {
    if(player.paused)
        player.play();
    else
        player.pause();

    changeIcon(playButton);
}

function stopVideo() {
    if(player.paused) return;
    player.pause();
    changeIcon(playButton);
    seeker.value = 0;
    player.currentTime = 1;
}

function endVideo() {
    if(player.currentTime !== player.duration) return;
    seeker.value = 1;
    player.paused = true;
    changeIcon(playButton);
}

function toggleSound() {
    if(player.muted){
        if(player.volume===0) 
            player.volume = 1;
        volumeSlider.value = player.volume;
        player.muted = false;
    }
    else{
        volumeSlider.value = 0;
        player.muted = true;
    }

    changeIcon(volButton);
}

function changeVolume() {
    //console.log(volumeSlider.value);
    //volume property is a value between 0 and 1;
    let vol = player.volume;
    player.volume = volumeSlider.value;
    vol *= player.volume;

    if((player.muted) || (vol===0)) toggleSound();
}

function toggleFullScreen() {
    console.log("Fullscreen fired");
    //if the player is in fullscreen exit fullscreen, otherwise make it full screen
    if(document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        playerCon.requestFullscreen();
    }

    changeIcon(fullScreen);
}

function showControls() {
    videoControls.classList.remove("hide");
}

function hideControls() {
    if(player.paused) return;
    videoControls.classList.add("hide");
    mouseOverControls = false;
}

// prevent automatic periodic shutdown of the controls
function currentControls() {
    mouseOverControls = true;
}

function setVideoTime() {
    player.currentTime = seeker.value*player.duration;
}

//Event Listeners
player.addEventListener("click", playVideo);
player.addEventListener("dblclick", toggleFullScreen);
player.addEventListener("ended", endVideo);

playButton.addEventListener("click", playVideo);
stopButton.addEventListener("click", stopVideo);
volButton.addEventListener("click", toggleSound);
volumeSlider.addEventListener("input", changeVolume);
fullScreen.addEventListener("click", toggleFullScreen);

videoControls.addEventListener("mouseenter", showControls);
videoControls.addEventListener("mouseover", currentControls);
videoControls.addEventListener("mouseleave", hideControls);

player.addEventListener("mousemove", showControls);

seeker.addEventListener("change", setVideoTime);


function update() {   
    if(!player.paused){
        seeker.value = player.currentTime/player.duration;
    }    

    if(!mouseOverControls){
        hideControls();
    }
}

setInterval(update,1000);