import './style.css';
import soundUrl from './assets/sound.mp3';
import sound1Url from './assets/sound1.mp3';
import sound2Url from './assets/sound2.mp3';
const API_KEY = import.meta.env.VITE_NASA_API_KEY;
document.querySelector("#app").innerHTML = "<p>loading...</p>";


fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    let media;

    if (data.media_type === "image") {
      media = `<img src="${data.url}"/>`;
    } else if (data.media_type === "iframe"){
      media = `<iframe src="${data.url}" controls></iframe>`
    }
    else {
      media = `<video src="${data.url}" controls></video>`;
    }

    document.querySelector("#app").innerHTML = `

    <div class="grid-parent">
        <div class="nasa" id="box1">
        <h1>${data.title}</h1>
        ${media}
        <p>${data.explanation}</p>
        </div>

      <div class="container" id="box2">
        <h1 class="title">
            Pomodoro Timer
        </h1>
        <p class="timer" id="timer">
            25:00
        </p>
        <div class="button-wrapper">
            <button class="button" id="Start">Start</button>
            <button class="button" id="Stop">stop</button>
            <button class="button" id="Reset">Reset</button>
        </div>
      </div>

    <div class="player-card" id="box3">
        
        <div class="song-info">
            <h2 class="song-name" id="songTitle">Frost Moon Ost</h2>
            <p class="artist-name" id="artistTitle">Hoyo Mix</p>
        </div>

        <input type="range" class="playline" id="playline" value="0" min="0" max="100">

        <div class="controls">
            <button class="btn btn-skipper" id="prevBtn" title="Previous Track">⏮</button>
            <button class="btn btn-player" id="playBtn" title="Play/Pause">▶</button>
            <button class="btn btn-skipper" id="nextBtn" title="Next Track">⏭</button>
        </div>

      </div>


    <footer> <p>Hey Folks, I am Mohammad Ahetasmaul Rasul. This cool projects that I have made recently is space themed pomodoro clock.<br>
     Please, leave a message for me about the project and don't forget to visit my <a href="https://github.com/Ahetasamul1212">github</a> and  <a href="https://kingmdahetasmulrasul.netlify.app/">personal portfolio</a>.</p>
    </footer>
      </div>
    
    `;


// ================================ logical js part   =======================================
    const startEl = document.getElementById("Start");
    const stopEl = document.getElementById("Stop");
    const resetEl = document.getElementById("Reset");
    const timerEl = document.getElementById("timer");
    let interval;
    let timeLeft = 1500;

    function updateTimer(){
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerEl.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    function startTimer(){
      interval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if(timeLeft === 0){
          clearInterval(interval);
          alert("Time is up!");
          timeLeft = 1500;
          updateTimer();
        }
      }, 1000);
    }

    function stopTimer(){
      clearInterval(interval);
    }

    function resetTimer(){
      clearInterval(interval);
      timeLeft = 1500;
      updateTimer();
    }

    startEl.addEventListener("click", startTimer);
    stopEl.addEventListener("click", stopTimer);
    resetEl.addEventListener("click", resetTimer);



    const playBtn = document.getElementById('playBtn');
    const playline = document.getElementById('playline');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const audio = new Audio(soundUrl);
    const songs = [
      { url: soundUrl, title: 'Frost Moon Ost', artist: 'HoyoMIX' },
      { url: sound1Url, title: 'Moonlight Drift', artist: 'Space Echoes' },
      { url: sound2Url, title: 'Deep Space Galaxy', artist: 'Countdown Studio' }
    ];
    let currentSongIndex = 0;
    const songTitle = document.getElementById('songTitle');
    const artistTitle = document.getElementById('artistTitle');

    function loadSong() {
      const song = songs[currentSongIndex];
      audio.src = song.url;
      songTitle.textContent = song.title;
      artistTitle.textContent = song.artist;
      audio.currentTime = 0;
      playline.value = 0;
    }

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playBtn.innerText = '⏸';
      } else {
        audio.pause();
        playBtn.innerText = '▶';
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        playline.value = (audio.currentTime / audio.duration) * 100;
      }
    });

    audio.addEventListener('ended', () => {
      skipToNextSong();
    });

    playline.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (playline.value / 100) * audio.duration;
      }
    });

    function skipToNextSong() {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      loadSong();
      audio.play();
      playBtn.innerText = '⏸';
    }

    prevBtn.addEventListener('click', () => {
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      loadSong();
      audio.play();
      playBtn.innerText = '⏸';
    });
    nextBtn.addEventListener('click', skipToNextSong);
  })
  .catch(err => {
    document.querySelector("#app").innerHTML = `<p>Error: ${err.message}</p>`;

  });





