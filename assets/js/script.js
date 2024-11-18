document.getElementById("search").addEventListener("input", async (e) => {
    const query = e.target.value;
    if (query) {
        songs = await fetchSongs(query);
        updatePlaylist(songs);
        if (songs.length > 0) {
            loadSong(0);
        }
    }
});

function updatePlaylist(songs) {
    const playlist = document.getElementById("playlist");
    playlist.innerHTML = songs.map((song, index) => `
        <li onclick="loadSong(${index}); playSong();">
            ${song.title} - ${song.artist}
        </li>
    `).join("");
}
