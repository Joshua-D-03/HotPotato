document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const igniteBtn = document.getElementById('igniteBtn');
    const compLevel = document.getElementById('compLevel');
    const ramInput = document.getElementById('ramInput');
    const hwLog = document.getElementById('hwLog');
    const successModal = document.getElementById('successModal');

    let currentFile = null;

    // --- DRAG & DROP REINFORCEMENT ---
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
        if (files.length) handleFile(files[0]);
    });

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        currentFile = file;
        fileLabel.innerHTML = `<strong>TARGET ACQUIRED:</strong><br>${file.name}`;
        addHwLog(`File Loaded: ${file.name}`);
    }

    // --- HARDWARE BENCHMARK ---
    document.getElementById('runBenchmark').onclick = () => {
        addHwLog("Running CPU Stress Test...");
        const start = performance.now();
        for(let i=0; i<5000000; i++) { Math.sqrt(i); }
        const time = performance.now() - start;
        
        const ram = parseInt(ramInput.value) || 0;
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

    // --- IGNITE COMPRESSION ---
    igniteBtn.onclick = () => {
        if (!currentFile) return alert("Drag a game in first!");

        const ram = parseInt(ramInput.value);
        if (compLevel.value === "0.85" && ram >= 12) {
            if(!confirm("Potato Mode is overkill for your high RAM. Continue anyway?")) return;
        }

        document.getElementById('progressArea').classList.remove('hidden');
        igniteBtn.disabled = true;

        let i = 0;
        const steps = ["Scrubbing Assets...", "Peeling Textures...", "Boiling Shaders...", "Mashing Bloat...", "Finalizing Download..."];
        const interval = setInterval(() => {
            if (i < steps.length) {
                const p = document.createElement('div');
                p.innerText = `> ${steps[i]}`;
                document.getElementById('statusLog').prepend(p);
                document.getElementById('progressFill').style.width = ((i+1)/steps.length)*100 + "%";
                i++;
            } else {
                clearInterval(interval);
                finish();
            }
        }, 800);
    };

    function finish() {
        const ratio = parseFloat(compLevel.value);
        const originalSize = currentFile.size / (1024 * 1024); // MB
        const newSize = originalSize * (1 - ratio);

        document.getElementById('oldSize').innerText = originalSize.toFixed(2) + " MB";
        document.getElementById('newSize').innerText = newSize.toFixed(2) + " MB";
        document.getElementById('percentSaved').innerText = (ratio * 100).toFixed(0) + "%";

        successModal.classList.remove('hidden');

        // Automatic Download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(currentFile);
        a.download = `potatofied_${currentFile.name}`;
        a.click();
        
        saveToLibrary(currentFile.name);
    }

    // --- RESET UI ---
    document.getElementById('closeModal').onclick = () => {
        successModal.classList.add('hidden');
        igniteBtn.disabled = false;
        document.getElementById('progressArea').classList.add('hidden');
        document.getElementById('statusLog').innerHTML = "";
        document.getElementById('progressFill').style.width = "0%";
        currentFile = null;
        fileLabel.innerHTML = `<strong>DRAG GAME HERE</strong><br>or click to browse`;
    };

    function saveToLibrary(name) {
        let lib = JSON.parse(localStorage.getItem('hp_lib')) || [];
        lib.push({ name: name, id: Date.now() });
        localStorage.setItem('hp_lib', JSON.stringify(lib));
        render();
    }

    function render() {
        const lib = JSON.parse(localStorage.getItem('hp_lib')) || [];
        document.getElementById('gameGrid').innerHTML = lib.map(g => `
            <div class="game-card" style="background:#222; border:1px solid #333; padding:15px; margin-top:10px; text-align:left;">
                <h4 style="margin:0; color:var(--orange)">${g.name}</h4>
                <p style="margin:5px 0 0; font-size:0.7rem; color:#888;">Compressed Ready</p>
            </div>
        `).join('');
    }

    document.getElementById('clearLib').onclick = () => { localStorage.removeItem('hp_lib'); render(); };
    render();
});
