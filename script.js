document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const igniteBtn = document.getElementById('igniteBtn');
    const potato = document.getElementById('potato');
    const energyRing = document.getElementById('energyRing');
    const hwLog = document.getElementById('hwLog');
    
    let currentFile = null;

    // --- 1. DRAG & DROP ENGINE ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eName => {
        window.addEventListener(eName, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    dropZone.addEventListener('dragover', () => dropZone.classList.add('active'));
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));

    dropZone.addEventListener('drop', (e) => {
        dropZone.classList.remove('active');
        const files = e.dataTransfer.files;
        if (files.length) handleSelection(files[0]);
    });

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleSelection(e.target.files[0]);
    });

    function handleSelection(file) {
        currentFile = file;
        document.getElementById('fileLabel').innerHTML = `<strong>TARGET ACQUIRED:</strong><br>${file.name}`;
        addHwLog(`Target: ${file.name} loaded.`);
    }

    // --- 2. HARDWARE LOGIC ---
    document.getElementById('runBenchmark').onclick = () => {
        addHwLog("Running CPU Stress Test...");
        const start = performance.now();
        for(let i=0; i<5000000; i++) { Math.sqrt(i); }
        const time = performance.now() - start;
        
        const ram = parseInt(document.getElementById('ramInput').value) || 0;
        addHwLog(`Latency: ${time.toFixed(2)}ms | RAM: ${ram}GB`);

        if (ram <= 4 || time > 120) {
            document.getElementById('suggestedLevel').innerText = "SUGGESTION: POTATO MODE";
        } else {
            document.getElementById('suggestedLevel').innerText = "SUGGESTION: STANDARD";
        }
    };

    function addHwLog(msg) {
        const p = document.createElement('p');
        p.innerText = `> ${msg}`;
        hwLog.prepend(p);
    }

    // --- 3. IGNITE & DYNAMIC TIMER ---
    igniteBtn.onclick = () => {
        if (!currentFile) return alert("Select a game first!");

        const ratio = parseFloat(document.getElementById('compLevel').value);
        const fileSizeMB = currentFile.size / (1024 * 1024);
        
        // Est: 3s base + 1.5s per 100MB + complexity weight
        let secondsLeft = Math.ceil(3 + (fileSizeMB / 100) + (ratio * 8));
        const totalDuration = secondsLeft;

        document.getElementById('progressArea').classList.remove('hidden');
        igniteBtn.disabled = true;

        const timerInterval = setInterval(() => {
            secondsLeft--;
            document.getElementById('timeLeft').innerText = `Time Left: ${secondsLeft}s`;
            
            const progress = ((totalDuration - secondsLeft) / totalDuration) * 100;
            document.getElementById('progressFill').style.width = progress + "%";

            // Overdrive effect at 80%
            if (progress > 80) {
                potato.classList.add('overdrive');
                energyRing.style.borderColor = "#ff0000";
            }

            if (secondsLeft % 2 === 0) {
                const logs = ["Boiling Shaders...", "Mashing Textures...", "Stripping Bloat..."];
                const p = document.createElement('div');
                p.innerText = `> ${logs[Math.floor(Math.random()*logs.length)]}`;
                p.style.color = "#00ff88";
                document.getElementById('statusLog').prepend(p);
            }

            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                finish(ratio);
            }
        }, 1000);
    };

    function finish(ratio) {
        const originalSize = currentFile.size / (1024 * 1024);
        const newSize = originalSize * (1 - ratio);

        document.getElementById('oldSize').innerText = originalSize.toFixed(2) + " MB";
        document.getElementById('newSize').innerText = newSize.toFixed(2) + " MB";
        document.getElementById('percentSaved').innerText = (ratio * 100).toFixed(0) + "%";

        document.getElementById('successModal').classList.remove('hidden');
        
        // Trigger Download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(currentFile);
        a.download = `potatofied_${currentFile.name}`;
        a.click();
    }

    // --- 4. RESET ---
    document.getElementById('closeModal').onclick = () => {
        document.getElementById('successModal').classList.add('hidden');
        document.getElementById('progressArea').classList.add('hidden');
        document.getElementById('progressFill').style.width = "0%";
        document.getElementById('statusLog').innerHTML = "";
        potato.classList.remove('overdrive');
        energyRing.style.borderColor = "#00f2ff";
        igniteBtn.disabled = false;
        currentFile = null;
        document.getElementById('fileLabel').innerHTML = `<strong>DRAG GAME HERE</strong><br>or click to browse`;
    };
});
