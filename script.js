document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const igniteBtn = document.getElementById('igniteBtn');
    const hwLog = document.getElementById('hwLog');
    const ramInput = document.getElementById('ramInput');
    const suggestLabel = document.getElementById('suggestedLevel');

    let currentFile = null;

    // --- 1. DRAG AND DROP HANDLERS ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eName => {
        dropZone.addEventListener(eName, e => {
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

    // --- 2. FILE INPUT HANDLER ---
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleSelection(e.target.files[0]);
    });

    function handleSelection(file) {
        currentFile = file;
        fileLabel.innerHTML = `<strong>FILE READY:</strong><br>${file.name}`;
        addHwLog(`Target acquired: ${file.name}`);
    }

    // --- 3. HARDWARE BENCHMARK ---
    document.getElementById('runBenchmark').onclick = () => {
        addHwLog("Running CPU stress test...");
        const start = performance.now();
        for(let i=0; i<4000000; i++) { Math.sqrt(i); } // Heavy math
        const duration = performance.now() - start;
        
        const ram = parseInt(ramInput.value) || 0;
        addHwLog(`Latency: ${duration.toFixed(2)}ms | RAM: ${ram}GB`);

        if (ram <= 4 || duration > 100) {
            suggestLabel.innerText = "EXTREME CRUSH";
            addHwLog("Recommendation: Full downscaling required.");
        } else {
            suggestLabel.innerText = "STANDARD PEEL";
            addHwLog("Recommendation: Standard optimization safe.");
        }
    };

    function addHwLog(msg) {
        const p = document.createElement('p');
        p.innerText = `> ${msg}`;
        hwLog.prepend(p);
    }

    // --- 4. OPTIMIZATION LOGIC ---
    igniteBtn.onclick = () => {
        if (!currentFile) return alert("Please drag or select a game file first.");
        
        document.getElementById('progressArea').classList.remove('hidden');
        igniteBtn.disabled = true;
        
        let steps = ["Mashing Shaders...", "Peeling Textures...", "Boiling Bloat...", "Finalizing Download..."];
        let i = 0;

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
        document.getElementById('successModal').classList.remove('hidden');

        // Automatically trigger the download back to the user
        const a = document.createElement('a');
        a.href = URL.createObjectURL(currentFile);
        a.download = `potatofied_${currentFile.name}`;
        a.click();
    }

    document.getElementById('closeModal').onclick = () => location.reload();
});
