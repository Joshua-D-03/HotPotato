document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const statusText = document.getElementById('statusText');
    const potatoBin = document.getElementById('potatoBin');
    const historyGrid = document.getElementById('historyGrid');
    const fileInput = document.getElementById('fileInput');
    const benchBar = document.getElementById('benchmarkBar');
    const benchBarContainer = document.getElementById('benchmarkBarContainer');

    // Sidebar Toggle
    document.getElementById('toggleSidebar').onclick = () => {
        const isClosed = document.getElementById('sidebar').classList.toggle('closed');
        document.getElementById('toggleSidebar').innerText = isClosed ? "▶" : "◀";
    };

    // Page Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.getAttribute('data-page');
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // File Input (Placing the Game)
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('fileLabel').innerHTML = `<strong>${file.name}</strong><br>LOADED IN CHAMBER`;
            
            // Visual feedback in Potato Bin
            const icon = document.createElement('div');
            icon.style = "width:35px; height:35px; background:var(--orange); border-radius:4px; font-size:8px; display:flex; align-items:center; justify-content:center; text-align:center; color:white; overflow:hidden;";
            icon.innerText = file.name.substring(0, 4).toUpperCase();
            potatoBin.appendChild(icon);
            statusText.innerText = "GAME PLACED. READY TO IGNITE.";
        }
    };

    // AI Analysis + Compression Logic
    document.getElementById('igniteBtn').onclick = async () => {
        if (!fileInput.files[0]) return alert("Place a game in the bin first!");

        const pcModel = document.getElementById('pcType').value.toLowerCase();
        const storage = parseInt(document.getElementById('storageInput').value);
        const gameSize = fileInput.files[0].size / (1024 ** 3) || 15;

        // Storage Check
        if (storage < (gameSize * 1.5)) return alert("INSUFFICIENT STORAGE FOR COMPRESSION.");

        // AI Scan Phase
        potato.classList.add('scanning');
        statusText.innerText = "AI SCANNING HARDWARE PROFILE...";
        await new Promise(r => setTimeout(r, 2000));

        let score = 0.75; // Base score
        if (pcModel.includes("rtx") || pcModel.includes("40")) score = 0.98;
        if (pcModel.includes("deck") || pcModel.includes("gtx")) score = 0.65;

        // Benchmark Phase
        potato.classList.remove('scanning');
        potato.classList.add('igniting'); // Visual jitter
        benchBarContainer.classList.remove('hidden');
        statusText.innerText = "CALIBRATING ENGINE...";

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            benchBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                finalizeCompression(score, pcModel.toUpperCase());
            }
        }, 100);
    };

    function finalizeCompression(score, model) {
        setTimeout(() => {
            potato.classList.remove('igniting');
            benchBarContainer.classList.add('hidden');
            statusText.innerText = "IGNITION SUCCESSFUL";

            // Add Result to Library
            const entry = document.createElement('div');
            entry.className = 'dashed-square';
            const randomSeed = Math.floor(Math.random() * 9000);
            entry.innerHTML = `
                <div style="width:100%; height:100%; background:url('https://picsum.photos/seed/${randomSeed}/300/400'); background-size:cover;"></div>
                <div class="info-overlay">
                    <p style="color:var(--orange); font-weight:bold;">SCORE: ${(score * 100).toFixed(0)}%</p>
                    <p style="font-size:10px">${model || "GENERIC PC"}</p>
                    <p style="font-size:10px; color:var(--cyan)">OPTIMIZED</p>
                </div>
            `;
            historyGrid.prepend(entry);
            alert("Compression sequence finished. Results moved to Library.");
        }, 1000);
    }

    document.getElementById('dropZone').onclick = () => fileInput.click();
});
