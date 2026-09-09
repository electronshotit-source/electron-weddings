// ===================================================================
// Electron Weddings — entry gate (camera shutter click-to-enter)
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  const gate = document.getElementById('entryGate');
  const siteContent = document.getElementById('siteContent');
  const btn = document.getElementById('cameraGateBtn');
  const flash = document.getElementById('gateFlash');
  if (!gate || !siteContent || !btn) return;

  document.body.classList.add('gate-locked');

  /* synthesized camera shutter + flash sound — no audio files needed */
  function playCameraSound() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const now = ctx.currentTime;

      function noiseBurst(time, freq, duration, peak, filterType) {
        const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const decay = Math.pow(1 - i / bufferSize, 3);
          data[i] = (Math.random() * 2 - 1) * decay;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = filterType || 'bandpass';
        filter.frequency.value = freq;
        filter.Q.value = 1.1;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(peak, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        noise.connect(filter).connect(gain).connect(ctx.destination);
        noise.start(time);
        noise.stop(time + duration);
      }

      function flashZap(time, duration, peak) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3600, time);
        osc.frequency.exponentialRampToValueAtTime(220, time + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(peak, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(gain).connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);

        /* a little bright sizzle layered under the zap */
        noiseBurst(time, 5200, duration * 0.7, peak * 0.5, 'highpass');
      }

      /* mirror-flip click, shutter-close click, then the flash pop */
      noiseBurst(now, 2200, 0.015, 0.3);
      noiseBurst(now + 0.075, 1300, 0.02, 0.24);
      flashZap(now + 0.09, 0.09, 0.16);

      setTimeout(() => ctx.close(), 500);
    } catch (e) {
      /* audio is a nice-to-have — fail silently */
    }
  }

  /* subtle mouse-follow tilt for a more interactive feel */
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    btn.style.setProperty('--tiltX', (y * -10).toFixed(2) + 'deg');
    btn.style.setProperty('--tiltY', (x * 10).toFixed(2) + 'deg');
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.setProperty('--tiltX', '0deg');
    btn.style.setProperty('--tiltY', '0deg');
  });

  let opened = false;
  btn.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    btn.classList.add('snapping');
    flash.classList.add('flashing');
    playCameraSound();

    setTimeout(() => btn.classList.remove('snapping'), 220);
    setTimeout(() => gate.classList.add('hiding'), 260);
    setTimeout(() => {
      gate.style.display = 'none';
      document.body.classList.remove('gate-locked');
      siteContent.style.display = 'block';
      requestAnimationFrame(() => siteContent.classList.add('revealed'));
    }, 1060);
  });
});
