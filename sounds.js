// sounds.js — Web Audio API synthesized sounds (no external files)

let _audioCtx = null;

function getAudioCtx() {
    if (!_audioCtx) {
        _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browsers suspend until user gesture)
    if (_audioCtx.state === 'suspended') _audioCtx.resume();
    return _audioCtx;
}

function playTone(freq, startTime, duration, type = 'sine', gainVal = 0.3) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
}

// Two-note ascending chime: C5 → E5
function playCorrectSound() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playTone(523.25, t,       0.12, 'sine', 0.35); // C5
    playTone(659.25, t + 0.1, 0.18, 'sine', 0.35); // E5
}

// Descending buzz: E3 → C3
function playWrongSound() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playTone(164.81, t,        0.15, 'sawtooth', 0.2); // E3
    playTone(130.81, t + 0.12, 0.18, 'sawtooth', 0.18); // C3
}

// 4-note ascending fanfare: C5 D5 E5 G5
function playLevelUpSound() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const notes = [523.25, 587.33, 659.25, 783.99]; // C5 D5 E5 G5
    notes.forEach((freq, i) => {
        playTone(freq, t + i * 0.12, 0.22, 'sine', 0.4);
    });
}

// Sparkle arpeggio: C5 E5 G5 C6
function playCollectibleSound() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
        playTone(freq, t + i * 0.08, 0.18, 'sine', 0.3);
    });
}

// Double-ding for streaks
function playStreakSound() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    playTone(880, t,       0.1, 'sine', 0.3); // A5
    playTone(880, t + 0.15, 0.1, 'sine', 0.3); // A5
}
