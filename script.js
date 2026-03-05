const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const pcInput = document.getElementById('pcType');
    const fileInput = document.getElementById('fileInput');
    const historyGrid = document.getElementById('historyGrid');
    let libraryData = [];

    // Persist PC Model Memory
    if(localStorage.getItem('pc_assessment')) pcInput.value = localStorage.getItem('pc_assessment');

    // Sidebar Logic
    document.getElementById('toggleSidebar').onclick = function() {
        const sidebar = document.getElementById('sidebar');
        const closed = sidebar.classList.toggle('closed');
        this.innerText = closed ? "▶" : "◀";
    };

    // Navigation Logic
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.dataset.page;
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // Username Logic
    document.getElementById('username').oninput = function() {
        const sug = document.getElementById('nameSuggestions');
        if(this.value.length > 2) {
            sug.classList.remove('hidden');
            sug.innerHTML = `Suggested: <b>${this.value}_Potatofied</b>`;
        }
    };

    // Drag/Box Logic
    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if(e.target.files[0]) document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>READY FOR PROCESSING`;
    };

    // Ignite Compression
    document.getElementById('igniteBtn').onclick = () => {
        const file = fileInput.files[0];
        if(!file) return alert("Please place a game in the box.");

        // Remember PC for next visit
        localStorage.setItem('pc_assessment', pcInput.value);

        potato.classList.add('compressing-red');
        document.getElementById('benchmarkBarContainer').classList.remove('hidden');
        document.getElementById('statusText').innerText = "WEB ASSESSMENT: ANALYZING HARDWARE...";

        let progress = 0;
        const bar = document.getElementById('benchmarkBar');
        const interval = setInterval(() => {
            progress += 2;
            bar.style.width = progress + "%";
            if(progress >= 100) {
                clearInterval(interval);
                completeCompression(file);
            }
        }, 60);
    };

    function completeCompression(file) {
        potato.classList.remove('compressing-red');
        document.getElementById('benchmarkBarContainer').classList.add('hidden');
        
        const level = parseFloat(document.getElementById('compLevel').value);
        const originalSize = (file.size / (1024 ** 3)).toFixed(2); // GB
        const compressedSize = (originalSize * (1 - level)).toFixed(2);

        const entry = {
            title: `Potatofied-${file.name.split('.')[0]}`,
            stats: `${originalSize}GB → ${compressedSize}GB`,
            date: new Date().toLocaleDateString(),
            poster: `https://picsum.photos/seed/${Math.random()}/300/400`
        };

        libraryData.unshift(entry);
        updateLibrary();
        alert(`${entry.title} created! Saved ${(level*100).toFixed(0)}% storage.`);
    }

    function updateLibrary() {
        historyGrid.innerHTML = '';
        libraryData.forEach(game => {
            const div = document.createElement('div');
            div.className = 'dashed-square';
            div.style.backgroundImage = `url(${game.poster})`;
            div.style.backgroundSize = 'cover';
            div.innerHTML = `<div class="hover-info"><b>${game.title}</b><br>${game.stats}<br>${game.date}</div>`;
            historyGrid.appendChild(div);
        });
        // Blank squares
        for(let i=0; i<12; i++) {
            const div = document.createElement('div');
            div.className = 'dashed-square';
            historyGrid.appendChild(div);
        }
    }
    updateLibrary(); // Initialize blank grid
});
