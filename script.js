document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const statusText = document.getElementById('statusText');
    const historyGrid = document.getElementById('historyGrid');
    const fileInput = document.getElementById('fileInput');
    const benchBar = document.getElementById('benchmarkBar');
    const benchBarContainer = document.getElementById('benchmarkBarContainer');

    // Sidebar Toggle
    document.getElementById('toggleSidebar').onclick = () => {
        const isClosed = document.getElementById('sidebar').classList.toggle('closed');
        document.getElementById('toggleSidebar').innerText = isClosed ? "▶" : "◀";
    };

    // Navigation Switcher
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.getAttribute('data-page');
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // Ignite Sequence
    document.getElementById('igniteBtn').onclick = () => {
        if (!fileInput.files[0]) return alert("Please select a game to compress.");

        const pcModel = document.getElementById('pcType').value || "Standard PC";
        
        // Trigger Rotation & Glow
        potato.classList.add('compressing-active');
        statusText.innerText = "INITIALIZING CORE...";
        benchBarContainer.classList.remove('hidden');

        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            benchBar.style.width = `${progress}%`;
            
            if (progress === 40) statusText.innerText = "MAPPING TEXTURE DATA...";
            if (progress === 80) statusText.innerText = "FINALIZING OPTIMIZATION...";

            if (progress >= 100) {
                clearInterval(interval);
                finalize(pcModel);
            }
        }, 60);
    };

    function finalize(model) {
        setTimeout(() => {
            // Reset Animation
            potato.classList.remove('compressing-active');
            benchBarContainer.classList.add('hidden');
            statusText.innerText = "COMPRESSION SUCCESSFUL";

            const entry = document.createElement('div');
            entry.className = 'dashed-square';
            const seed = Math.floor(Math.random() * 10000);
            entry.innerHTML = `
                <div style="width:100%; height:100%; background:url('https://picsum.photos/seed/${seed}/300/400'); background-size:cover;"></div>
                <div class="info-overlay">
                    <p style="color:var(--orange); font-weight:bold;">OPTIMIZED</p>
                    <p style="font-size:10px; color:#fff">${model.toUpperCase()}</p>
                </div>
            `;
            historyGrid.prepend(entry);
            alert(`Succesfully compressed metadata for ${model}.`);
            benchBar.style.width = "0%";
        }, 500);
    }

    // Auth Simulation
    document.getElementById('guestBtn').onclick = () => {
        document.getElementById('loggedOutNav').classList.add('hidden');
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('userDisplay').innerText = "GUEST_USER";
    };

    document.getElementById('signOutBtn').onclick = () => location.reload();
    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if(e.target.files[0]) document.getElementById('fileLabel').innerText = e.target.files[0].name;
    };
});
