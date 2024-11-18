
// Your Spotify Access Token
const accessToken = "BQCXs2vuKJUtAKvFK1NG7bdlWabKUZECCJZ0PeyUKEACBMScpoUoKNRLKl_0g6bEPF8a1dPir73XRlW0SEQH6EPPV7nvv338oQQn_BcusuCeNjH0d3k";

// Fetch Playlist Tracks
async function fetchPlaylistTracks(playlistId) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        return data.items.filter(item => item.track.preview_url); // Only tracks with previews
    } catch (error) {
        console.error("Error fetching playlist tracks:", error);
        return [];
    }
}

function populatePlaylist(tracks) {
    const trackList = document.getElementById('track-list');
    trackList.innerHTML = ''; 

    tracks.forEach((track, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = track.track.name; 
        listItem.dataset.index = index; 
        listItem.addEventListener('click', () => {
            playSelectedTrack(index, tracks); 
        });
        trackList.appendChild(listItem);
    });
}

const playPauseButton = document.getElementById('play-pause-btn');
const audioElement = document.getElementById('audio');

function playSelectedTrack(index, tracks) {
    const selectedTrack = tracks[index].track;

    if (selectedTrack.preview_url) {
        const audioElement = document.getElementById('audio'); 
        const trackCover = document.getElementById('track-cover');
        const trackTitle = document.getElementById('track-title');
        const trackArtist = document.getElementById('track-artist');

        audioElement.src = selectedTrack.preview_url;
        trackCover.src = selectedTrack.album.images[0]?.url || 'assets/images/default_cover.png';
        trackTitle.textContent = selectedTrack.name;
        trackArtist.textContent = selectedTrack.artists.map(artist => artist.name).join(', ');

        audioElement.play()
            .then(() => {
                console.log('Playback started successfully');
            })
            .catch(error => {
                console.error('Playback failed:', error);
            });
    } else {
        alert('No preview available for this track.');
    }
}

audioElement.addEventListener('play', () => {
    playPauseButton.textContent = 'Pause';
});

audioElement.addEventListener('pause', () => {
    playPauseButton.textContent = 'Play';
});

// Toggle play/pause on button click
playPauseButton.addEventListener('click', () => {
    if (audioElement.paused) {
        audioElement.play();
    } else {
        audioElement.pause();
    }
});
