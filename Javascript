let sys = { ram: 0, vram: 0 };
let game = { ram: 0, vram: 0 };
let currentMode = 'quality';
let fpsTarget = 30;

function startScan() {
    sys.ram = navigator.deviceMemory || 8;
    sys.vram = sys.ram * 0.25; // Estimated VRAM for integrated/low-end cards
    transition(1, 2);
}

function showManualForm() { document.getElementById('manual-form').classList.remove('hidden'); }

function saveManualSpec() {
    sys.ram = parseFloat(document.getElementById('m-ram').value) || 8;
    sys.vram = parseFloat(document.getElementById('m-vram').value) || 2;
    transition(1, 2);
}

function updateFPS(val) { 
    document.getElementById('fps-val').innerText = val; 
    fpsTarget = parseInt(val); 
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById('mode-quality').classList.toggle('active', mode === 'quality');
    document.getElementById('mode-perf').classList.toggle('active', mode === 'perf');
}

function processComparison() {
    game.ram = parseFloat(document.getElementById('g-ram').value) || 16;
    game.vram = parseFloat(document.getElementById('g-vram').value) || 6;

    const vramPower = sys.vram / game.vram;
    const modeMult = currentMode === 'perf' ? 0.75 : 1.15;
    const fpsWeight = 30 / fpsTarget;

    // The Universal Bridge Formula
    let scale = (vramPower * modeMult * fpsWeight).toFixed(2);
    scale = Math.max(0.30, Math.min(1.0, scale));

    renderResults(scale, vramPower);
    transition(2, 3);
}

function renderResults(scale, vramPower) {
    window.finalScale = scale;
    const stress = Math.min(100, (1 / vramPower) * 50);
    
    document.getElementById('vram-fill').style.width = stress + "%";
    document.getElementById('stress-pct').innerText = Math.round(stress) + "% Pressure";
    document.getElementById('scale-val').innerText = Math.round(scale * 100) + "% of Native";
    
    const status = document.getElementById('read-status');
    const strat = document.getElementById('strat-desc');

    if (scale < 0.48) {
        status.innerText = "CRITICAL BLUR";
        status.style.color = "#f85149";
        strat.innerText = "Extreme Sub-Sampling (Focus on Frame Stability)";
    } else {
        status.innerText = "CLEAR LEGIBILITY";
        status.style.color = "#3fb950";
        strat.innerText = "Balanced Bridge (Optimization Priority)";
    }
}

function downloadConfig() {
    const content = `
; Architect v8.0 Universal Bridge
; ------------------------------
; This file optimizes the game by bridging your hardware deficit.
; Estimated Resolution Scale: ${window.finalScale}

[Display]
ResolutionScale=${window.finalScale}
FrameRateLimit=${fpsTarget}

[Graphics]
TextureQuality=${window.finalScale < 0.5 ? 0 : 1}
ShadowQuality=0
VRAM_Budget_MB=${sys.vram * 1024}
Optimization_Mode=${currentMode}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Bridge_Optimization.ini";
    a.click();
}

function transition(from, to) {
    document.getElementById(`step-${from}`).classList.remove('active');
    document.getElementById(`step-${to}`).classList.add('active');
}
