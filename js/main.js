//Variables
const player = document.querySelector("video");
const playerCon = document.querySelector("#player-container");
const playButton = document.querySelector("#play-button");
const stopButton = document.querySelector("#stop-button");
const captButton = document.querySelector("#caption");
const volButton = document.querySelector("#vol-button");
const volumeSlider = document.querySelector("#change-vol");
const fullScreen = document.querySelector("#full-screen");
const videoControls = document.querySelector("#video-controls");
const seeker = document.querySelector("#timeseek");
const seektimer = document.querySelector("#timer");

let timer = null;
let hasPlayed = false;
let mouseOverControls = false;

// If JS is loaded then let's remove the default controls
player.controls = false;

seektimer.textContent = player.dataset.duration;
player.textTracks[0].mode = "hidden";


//functions
function isMobile() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

function hms(num) {
    let hours = disp(parseInt(num / 3600,10));
    let minutes = disp(parseInt(num / 60, 10));
    let seconds = disp(parseInt(num) % 60);

    if(hours !== '00')
        return `${hours}:${minutes}:${seconds}`;
    else
        return `${minutes}:${seconds}`
}

function disp(time) {
    if (time < 10)
        return `0${time}`;
    return time;
}

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

function toggleCaption() {
    if(player.textTracks[0].mode === "hidden") {
        player.textTracks[0].mode = "showing";
    } else {
        player.textTracks[0].mode = "hidden";
    }
    changeIcon(captButton);
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
caption.addEventListener("click", toggleCaption);
fullScreen.addEventListener("click", toggleFullScreen);

videoControls.addEventListener("mouseenter", showControls);
videoControls.addEventListener("mouseover", currentControls);
videoControls.addEventListener("mouseleave", hideControls);

player.addEventListener("mousemove", showControls);

seeker.addEventListener("change", setVideoTime);


function update() {   
    if(!player.paused){
        seektimer.textContent = hms(player.currentTime);
        seeker.value = player.currentTime/player.duration;
    }    

    if(!mouseOverControls){
        hideControls();
    }

    console.log(player.textTracks[0].mode);
}

setInterval(update,1000);