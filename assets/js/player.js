let currentTrackIndex = 0;
let playlistTracks = [];
const audioPlayer = new Audio();
const volumeControl = document.getElementById("volume-control");
const seekBar = document.getElementById("seek-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const audioElement = document.getElementById('audio'); 
const currentTimeLabel = document.getElementById('current-time');
const durationLabel = document.getElementById('duration');

// Load Playlist
async function loadPlaylist() {
    const tracks = await fetchPlaylistTracks("3cEYpjA9oz9GiPac4AsH4n");
    playlistTracks = tracks.map(item => item.track);
    displayPlaylist();
    loadTrack(0);
}

// Display Playlist
function displayPlaylist() {
    const trackList = document.getElementById("track-list");
    trackList.innerHTML = "";
    playlistTracks.forEach((track, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <img src="${track.album.images[0]?.url}" alt="${track.name}" class="track-cover-small">
            <div>${track.name} - ${track.artists.map(artist => artist.name).join(", ")}</div>
        `;
        listItem.addEventListener("click", () => loadTrack(index));
        trackList.appendChild(listItem);
    });
}

// Load Track
function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlistTracks[index];
    document.getElementById("track-cover").src = track.album.images[0]?.url;
    document.getElementById("track-title").textContent = track.name;
    document.getElementById("track-artist").textContent = track.artists.map(artist => artist.name).join(", ");
    audioPlayer.src = track.preview_url;
    audioPlayer.pause();
}

// Play or Pause Track
function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        document.getElementById("play-pause-btn").textContent = "Pause";
    } else {
        audioPlayer.pause();
        document.getElementById("play-pause-btn").textContent = "Play";
    }
}

// Next or Previous Track
function changeTrack(step) {
    const newIndex = (currentTrackIndex + step + playlistTracks.length) % playlistTracks.length;
    loadTrack(newIndex);
    audioPlayer.play();
    document.getElementById("play-pause-btn").textContent = "Pause";
}

// Update Volume
volumeControl.addEventListener("input", (e) => {
    audioPlayer.volume = e.target.value;
});

// Update Progress
audioPlayer.addEventListener("timeupdate", () => {
    seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    durationEl.textContent = formatTime(audioPlayer.duration);
});

// Seek Track
seekBar.addEventListener("input", (e) => {
    audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
});

// Format Time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

audioElement.addEventListener('loadedmetadata', () => {
    durationLabel.textContent = formatTime(audioElement.duration);
    seekBar.max = Math.floor(audioElement.duration); 
});

// Update seek bar and timer as the song plays
audioElement.addEventListener('timeupdate', () => {
    currentTimeLabel.textContent = formatTime(audioElement.currentTime);
    seekBar.value = Math.floor(audioElement.currentTime);
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

seekBar.addEventListener('input', () => {
    audioElement.currentTime = seekBar.value;
});

// Event Listeners
document.getElementById("play-pause-btn").addEventListener("click", togglePlayPause);
document.getElementById("prev-btn").addEventListener("click", () => changeTrack(-1));
document.getElementById("next-btn").addEventListener("click", () => changeTrack(1));

// Load the Playlist
loadPlaylist();
