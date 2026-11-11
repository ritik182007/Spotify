
let currentsong = new Audio();
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

const play = (track,flag=false) => {
    currentsong.src = `http://127.0.0.1:3000/Spotify%20Clone/assests/Songs/${track}.mp3`
    if (flag==false) currentsong.play()
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";

    seconds = Math.floor(seconds);

    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function main() {
    let songs = await getsongs();

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

    play(songs[0].replaceAll("http://127.0.0.1:3000/Spotify%20Clone/assest", "").replaceAll("%20", " ").replace("mp3", "").replaceAll("s/Songs/", "").replaceAll(".", ""),true)
    let sl = document.querySelector(".songlist").querySelectorAll("li")
    for (let i = 0; i < sl.length; i++) {
        let info = sl[i].querySelector(".info div")

        sl[i].addEventListener("click", () => {
            play(info.innerHTML.trim())
        });
    }
    let playbtn = document.getElementById("play")
    playbtn.addEventListener("click", () => {
        if (currentsong.paused) {
            playbtn.src = "assests/pause.svg"
            currentsong.play()
        }
        else {
            currentsong.pause()
            playbtn.src = "assests/play-svgrepo-com.svg"
        }
    })
    let x = document.querySelector(".songlist")
    x.addEventListener("click", () => {
        playbtn.src = "assests/pause.svg"
    })
    currentsong.addEventListener("ended", () => {
        playbtn.src = "assests/play-svgrepo-com.svg"
    })

    currentsong.addEventListener("timeupdate", () => {
        let t = document.querySelector(".songtime")
        t.innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"

        currentsong.currentTime = (currentsong.duration) * percent / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })


    document.querySelector("#prev").addEventListener("click", () => {
        let current = decodeURIComponent(currentsong.src);
        let idx = songs.findIndex(song => decodeURIComponent(song) === current);

        if (idx === -1) return;

        let song = idx === 0 ? songs[songs.length - 1] : songs[idx - 1];

        let track = decodeURIComponent(song)
            .split("/")
            .pop()
            .replace(".mp3", "");

        play(track);
    });

    document.querySelector("#next").addEventListener("click", () => {
        let current = decodeURIComponent(currentsong.src);
        let idx = songs.findIndex(song => decodeURIComponent(song) === current);

        if (idx === -1) return;

        let song = idx === songs.length - 1 ? songs[0] : songs[idx + 1];

        let track = decodeURIComponent(song)
            .split("/")
            .pop()
            .replace(".mp3", "");

        play(track);
    });
}

main();
