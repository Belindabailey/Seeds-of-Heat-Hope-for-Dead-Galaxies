// BioStellar Music Bar — include on any page to get persistent theme music
// Usage: <script src="music.js"></script> before </body>
(function() {
  const CSS = `
    #bs-music-bar{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;align-items:center;gap:.75rem;background:rgba(2,4,8,.9);border:1px solid rgba(29,158,117,.4);padding:.6rem 1rem;backdrop-filter:blur(8px);opacity:0;transition:opacity 1s ease;font-family:monospace;}
    #bs-music-bar.visible{opacity:1;}
    #bs-music-btn{font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;color:#5DCAA5;background:transparent;border:1px solid rgba(29,158,117,.4);padding:.4rem .85rem;cursor:pointer;transition:background .2s,color .2s;white-space:nowrap;}
    #bs-music-btn:hover{background:#1D9E75;color:#020408;}
    #bs-music-label{font-size:.5rem;letter-spacing:.08em;color:#6a7a8a;max-width:130px;line-height:1.5;}
    #bs-music-disc{width:20px;height:20px;border-radius:50%;border:1px solid rgba(29,158,117,.5);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .3s;}
    #bs-music-disc.spinning{animation:bsDiscSpin 3s linear infinite;border-color:#1D9E75;}
    @keyframes bsDiscSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  `;

  // Find the root of the site to resolve MP3 path
  const pathDepth = window.location.pathname.split('/').filter(Boolean).length;
  const mp3Path = 'The%20Seed%20of%20Heat%20and%20the%20Frolickers%20of%20Night.mp3';

  // Inject styles
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // Inject audio + bar HTML
  document.body.insertAdjacentHTML('beforeend', `
    <audio id="bs-audio" src="${mp3Path}" preload="auto"></audio>
    <div id="bs-music-bar">
      <div id="bs-music-disc">
        <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
          <circle cx="5" cy="5" r="4" stroke="#1D9E75" stroke-width=".8"/>
          <circle cx="5" cy="5" r="1.2" fill="#1D9E75" opacity=".7"/>
        </svg>
      </div>
      <div id="bs-music-label">Seeds of Heat<br>Theme</div>
      <button id="bs-music-btn">&#9654; Play</button>
    </div>
  `);

  const audio = document.getElementById('bs-audio');
  const bar   = document.getElementById('bs-music-bar');
  const btn   = document.getElementById('bs-music-btn');
  const disc  = document.getElementById('bs-music-disc');

  function setPlaying(p) {
    disc.classList.toggle('spinning', p);
    btn.textContent = p ? '\u25a0 Stop' : '\u25b6 Play';
  }

  function startMusic(pos) {
    audio.currentTime = pos || 0;
    audio.play().catch(() => {});
    setPlaying(true);
  }

  function stopMusic() {
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    sessionStorage.setItem('bs_playing', '0');
  }

  audio.addEventListener('ended', () => {
    setPlaying(false);
    sessionStorage.setItem('bs_playing', '0');
  });

  btn.addEventListener('click', () => {
    if (audio.paused) startMusic();
    else stopMusic();
  });

  audio.addEventListener('play', () => sessionStorage.setItem('bs_playing', '1'));

  // Save position before navigating away
  window.addEventListener('beforeunload', () => {
    if (!audio.paused) {
      sessionStorage.setItem('bs_playing', '1');
      sessionStorage.setItem('bs_pos', audio.currentTime);
    }
  });

  // Show bar and resume if was playing
  setTimeout(() => {
    bar.classList.add('visible');
    const wasPlaying = sessionStorage.getItem('bs_playing');
    const pos = parseFloat(sessionStorage.getItem('bs_pos') || 0);
    // First ever visit: autoplay
    if (!localStorage.getItem('bs_visited')) {
      localStorage.setItem('bs_visited', '1');
      startMusic(0);
    } else if (wasPlaying === '1') {
      startMusic(pos);
    }
  }, 1200);

})();
