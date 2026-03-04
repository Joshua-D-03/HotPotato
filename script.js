document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const statusText = document.getElementById('statusText');
    const benchBarContainer = document.getElementById('benchmarkBarContainer');
    const benchBar = document.getElementById('benchmarkBar');
    const historyGrid = document.getElementById('historyGrid');

    // Sidebar/Nav Controls
    document.getElementById('toggleSidebar').onclick = () => {
        const closed = document.getElementById('sidebar').classList.toggle('closed');
        document.getElementById('toggleSidebar').innerText = closed ? "▶" : "◀";
    };

    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.getAttribute('data-page');
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // AI HARDWARE ANALYSIS & COMPRESSION ENGINE
    document.getElementById('igniteBtn').onclick = async () => {
        const pcModel = document.getElementById('pcType').value.toLowerCase();
        const fileInp = document.getElementById('fileInput');
        const storage = parseInt(document.getElementById('storageInput').value);
        
        if (!fileInp.files[0]) return alert("CORE ERROR: No game directory detected.");
        if (!pcModel) return alert("CORE ERROR: Enter PC Model for AI Hardware Analysis.");

        // 1. STORAGE VALIDATION
        const gameSizeGB = fileInp.files[0].size / (1024 ** 3) || 12.5; 
        if (storage < (gameSizeGB * 1.5)) return alert(`STORAGE DENIED: Need ${ (gameSizeGB * 1.5).toFixed(1) }GB for processing.`);

        // 2. AI WEB SEARCH SIMULATION
        potato.classList.add('scanning');
        statusText.innerText = "Searching Web for Hardware Specs...";
        await new Promise(r => setTimeout(r, 2000));

        let hardwareScore = 0.5; // Baseline for unknown hardware
        let recommendation = "Balance Focus";

        // Deep Search Analysis Logic
        if (pcModel.includes("rtx") || pcModel.includes("40") || pcModel.includes("3080") || pcModel.includes("3090")) {
            hardwareScore = 0.98;
            recommendation = "Quality Focus (High-End GPU Detected)";
            document.getElementById('optFocus').value = "quality";
        } else if (pcModel.includes("gtx") || pcModel.includes("deck") || pcModel.includes("1650") || pcModel.includes("1050")) {
            hardwareScore = 0.68;
            recommendation = "Performance Focus (Handheld/Mid-Range Detected)";
            document.getElementById('optFocus').value = "performance";
        } else if (pcModel.includes("integrated") || pcModel.includes("uhd") || pcModel.includes("iris")) {
            hardwareScore = 0.32;
            recommendation = "Extreme Compression (Low Power Detected)";
            document.getElementById('compLevel').value = "0.85";
        }

        // 3. HARDWARE STRESS-TEST (BENCHMARK)
        potato.classList.remove('scanning');
        potato.classList.add('benchmarking');
        statusText.innerText = `Calibrating: ${recommendation}`;
        benchBarContainer.classList.remove('hidden');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            benchBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                runIgnition(hardwareScore, pcModel.toUpperCase());
            }
        }, 40);

        function runIgnition(score, modelName) {
            // 4. FINAL IGNITION
            potato.classList.remove('benchmarking');
            potato.classList.add('igniting');
            statusText.innerText = "Igniting Compression Engine...";

            setTimeout(() => {
                potato.classList.remove('igniting');
                benchBarContainer.classList.add('hidden');
                statusText.innerText = "Compression Success!";

                const finalPotatoScore = (score * 100).toFixed(1);
                
                // Add to History Grid
                const newSquare = document.createElement('div');
                newSquare.className = 'dashed-square';
                const randomID = Math.floor(Math.random() * 8000);
                
                newSquare.innerHTML = `
                    <div class="poster-fill" style="background-image: url('https://picsum.photos/seed/${randomID}/400/600')"></div>
                    <div class="info-overlay">
                        <p style="color:var(--cyan); font-size:0.65rem; letter-spacing:1px">${modelName}</p>
                        <p class="overlay-value">SCORE: ${finalPotatoScore}%</p>
                        <p style="font-size:0.7rem">SAVED: ${(gameSizeGB * 0.45).toFixed(1)} GB</p>
                        <button class="report-btn" onclick="alert('Report Saved: Optimization aligned to ${modelName}')">GENERATE REPORT</button>
                    </div>
                `;
                historyGrid.prepend(newSquare);
                alert(`Compression Complete. Game metadata optimized for ${modelName}.`);
            }, 3000);
        }
    };
});
