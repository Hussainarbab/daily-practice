// Simple site JS for the Etitx demo
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Video editor demo logic
const fileInput = document.getElementById('videoFile');
const video = document.getElementById('editorVideo');
const playPause = document.getElementById('playPause');
const seek = document.getElementById('seek');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const trimStartEl = document.getElementById('trimStart');
const trimEndEl = document.getElementById('trimEnd');
const loopToggle = document.getElementById('loopToggle');
const exportBtn = document.getElementById('exportBtn');

let trimStart = 0;
let trimEnd = 0;

function formatTime(s){
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s/60);
    const sec = Math.floor(s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
}

if (fileInput){
    fileInput.addEventListener('change', (e)=>{
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        video.src = url;
        video.load();
    });
}

video.addEventListener('loadedmetadata', ()=>{
    seek.max = video.duration;
    trimEnd = video.duration;
    trimEndEl.value = trimEnd.toFixed(2);
    durationEl.textContent = formatTime(video.duration);
});

video.addEventListener('timeupdate', ()=>{
    seek.value = video.currentTime;
    currentTimeEl.textContent = formatTime(video.currentTime);
    // loop within trim
    if (loopToggle && loopToggle.checked && video.currentTime > parseFloat(trimEndEl.value || trimEnd)){
        video.currentTime = parseFloat(trimStartEl.value || 0);
    }
});

if (seek){
    seek.addEventListener('input', ()=>{
        video.currentTime = seek.value;
    });
}

if (playPause){
    playPause.addEventListener('click', ()=>{
        if (video.paused) { video.play(); playPause.textContent = 'Pause'; }
        else { video.pause(); playPause.textContent = 'Play'; }
    });
}

if (trimStartEl){
    trimStartEl.addEventListener('input', ()=>{
        trimStart = Math.max(0, parseFloat(trimStartEl.value) || 0);
        if (trimStart < 0) trimStart = 0;
        if (trimStart >= video.duration) trimStart = video.duration;
    });
}

if (trimEndEl){
    trimEndEl.addEventListener('input', ()=>{
        trimEnd = Math.min(video.duration, parseFloat(trimEndEl.value) || video.duration);
        if (trimEnd <= 0) trimEnd = 0;
        if (trimEnd < trimStart) trimEnd = trimStart;
    });
}

if (exportBtn){
    exportBtn.addEventListener('click', ()=>{
        // Real in-browser trimming and exporting requires MediaRecorder/Canvas or ffmpeg.wasm.
        // Here we simulate export for the landing-page demo.
        const s = parseFloat(trimStartEl.value || 0);
        const e = parseFloat(trimEndEl.value || (video.duration||0));
        if (!video.src){
            alert('Please choose a video file first.');
            return;
        }
        alert(`Export started (demo). Trim from ${formatTime(s)} to ${formatTime(e)}. For a real export integrate ffmpeg.wasm or server-side processing.`);
    });
}

// small helper: clicking a nav link closes mobile menu
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click', ()=>{
    if (navMenu.classList.contains('active')){
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}));