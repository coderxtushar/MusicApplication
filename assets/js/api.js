
// Your Spotify Access Token
const accessToken = "BQAgnXRL6qpr9Ec8GKFnfCAZBsvz9dKwZ70PFHjgLB6XhCV5apt-m5noywig5-w3OKlaCUZlmCfaDMrSCebl8CX82CSjEvIA7Tuydu9hSRAcbYIcFNI";

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
