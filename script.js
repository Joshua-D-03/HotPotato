document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const igniteBtn = document.getElementById('igniteBtn');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    
    let currentFile = null;

    // --- DRAG AND DROP HANDLERS (Reinforced) ---
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
        fileLabel.innerHTML = `<strong>TARGET ACQUIRED:</strong><br>${file.name}`;
        addHwLog(`File loaded: ${file.name}`);
    }

    // --- BENCHMARK ---
    document.getElementById('runBenchmark').onclick = () => {
        addHwLog("Running CPU test...");
        setTimeout(() => {
            addHwLog("Analysis complete.");
            document.getElementById('suggestedLevel').innerText = "EXTREME CRUSH";
        }, 1000);
    };

    function addHwLog(msg) {
        const p = document.createElement('p');
        p.innerText = `> ${msg}`;
        document.getElementById('hwLog').prepend(p);
    }

    // --- COMPRESSION START ---
    igniteBtn.onclick = () => {
        if (!currentFile) return alert("Please select a game first.");
        
        document.getElementById('progressArea').classList.remove('hidden');
        igniteBtn.disabled = true;
        
        let i = 0;
        const steps = ["Scrubbing Assets...", "Downscaling Texture Maps...", "Finalizing Build..."];
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
        }, 1000);
    };

    function finish() {
        document.getElementById('repName').innerText = currentFile.name;
        successModal.classList.remove('hidden');

        // Trigger Download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(currentFile);
        a.download = `potatofied_${currentFile.name}`;
        a.click();
        
        saveToLibrary(currentFile.name);
    }

    // --- THE FIX: RESET UI FUNCTION ---
    closeModal.onclick = () => {
        // 1. Hide Modal
        successModal.classList.add('hidden');
        
        // 2. Reset Button and Progress
        igniteBtn.disabled = false;
        document.getElementById('progressArea').classList.add('hidden');
        document.getElementById('progressFill').style.width = "0%";
        document.getElementById('statusLog').innerHTML = "";
        
        // 3. Clear current file
        currentFile = null;
        fileLabel.innerHTML = `<strong>DRAG GAME HERE</strong><br>or click to browse`;
        addHwLog("System Reset. Ready for next game.");
    };

    function saveToLibrary(name) {
        let lib = JSON.parse(localStorage.getItem('hp_lib')) || [];
        lib.push({ name: name, id: Date.now() });
        localStorage.setItem('hp_lib', JSON.stringify(lib));
        render();
    }

    function render() {
        const lib = JSON.parse(localStorage.getItem('hp_lib')) || [];
        document.getElementById('gameGrid').innerHTML = lib.map(g => `<div class="game-card"><h4>${g.name}</h4><p>Potatofied</p></div>`).join('');
    }

    document.getElementById('clearLib').onclick = () => { localStorage.removeItem('hp_lib'); render(); };
    render();
});
