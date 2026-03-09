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

// Portfolio lightbox logic
const mediaItems = Array.from(document.querySelectorAll('.media-item'));
const lightbox = document.getElementById('lightbox');
const lbStage = document.getElementById('lbStage');
const lbClose = document.querySelector('.lb-close');
const lbPrev = document.querySelector('.lb-prev');
const lbNext = document.querySelector('.lb-next');
let currentIndex = -1;

function openLightbox(index){
    const node = mediaItems[index];
    if (!node) return;
    currentIndex = index;
    const type = node.dataset.type;
    const src = node.dataset.src;
    lbStage.innerHTML = '';
    if (type === 'image'){
        const img = document.createElement('img');
        img.src = src;
        img.alt = node.querySelector('figcaption')?.textContent || '';
        lbStage.appendChild(img);
    } else if (type === 'video'){
        const vid = document.createElement('video');
        vid.src = src;
        vid.controls = true;
        vid.autoplay = true;
        vid.playsInline = true;
        lbStage.appendChild(vid);
    }
    lightbox.setAttribute('aria-hidden','false');
}

function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    lbStage.innerHTML = '';
    currentIndex = -1;
}

function showPrev(){
    if (currentIndex <= 0) currentIndex = mediaItems.length - 1;
    else currentIndex -= 1;
    openLightbox(currentIndex);
}

function showNext(){
    if (currentIndex >= mediaItems.length -1) currentIndex = 0;
    else currentIndex += 1;
    openLightbox(currentIndex);
}

mediaItems.forEach((el, idx)=>{
    el.addEventListener('click', ()=>openLightbox(idx));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

// close on overlay click (but not when clicking the stage content)
lightbox.addEventListener('click', (e)=>{
    if (e.target === lightbox) closeLightbox();
});

// keyboard navigation
document.addEventListener('keydown', (e)=>{
    if (lightbox.getAttribute('aria-hidden') === 'false'){
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    }
});

// Contact form mock handler
const contactForm = document.getElementById('contactForm');
if (contactForm){
    contactForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const name = document.getElementById('name').value || 'there';
        alert(`Thanks ${name}! I received your message (demo).`);
        contactForm.reset();
    });
}

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});
backToTopBtn.addEventListener('click', ()=>{
    window.scrollTo({top: 0, behavior: 'smooth'});
});

// Image loading animation
const galleryImages = document.querySelectorAll('.gallery img');
galleryImages.forEach(img => {
    if (img.complete) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }
});