console.log("Hello World");

async function getsongs() {
    // 1. Fetch using the direct directory URL
    let a = await fetch("http://127.0.0.1:3000/Spotify%20Clone/assests/Songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            // Normalize any Windows backslashes (%5C or \)
            let normalized = element.href.replaceAll("%5C", "/").replaceAll("\\", "/");

            // Extract ONLY the actual filename (e.g., "SongName.mp3")
            let fileName = normalized.split("/").filter(Boolean).pop();

            // Reconstruct the exact URL to avoid duplicating folder paths
            songs.push(`http://127.0.0.1:3000/Spotify%20Clone/assests/Songs/${fileName}`);
        }
    }
    return songs;
}

async function main() {
    let songs = await getsongs();
    console.log("Working Song URLs:", songs);

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> 
        <img src="assests/music.svg" class="invert">
                            <div class="info">
                                <div>${song.replaceAll("http://127.0.0.1:3000/Spotify%20Clone/assest", "").replaceAll("%20", " ").replace("mp3", "").replaceAll("s/Songs/", "").replaceAll(".", "")}</div>
                                <div>Rick</div>
                            </div>
                            <img src="assests/play-svgrepo-com.svg" class="invert pl">
        
         </li>`
    }

    if (songs.length === 0) {
        console.warn("No songs found.");
        return;
    }

    let audio = new Audio(songs[0]);
    audio.play(songs[0])

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration
        console.log(duration)
    })
}

main();