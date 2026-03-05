const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const fileInput = document.getElementById('fileInput');
    const pcInput = document.getElementById('pcType');
    const historyGrid = document.getElementById('historyGrid');
    let libraryData = [];

    // Memory: Remember PC Model
    if(localStorage.getItem('savedPC')) pcInput.value = localStorage.getItem('savedPC');

    // Sidebar Toggle
    toggleSidebar.onclick = () => {
        const isClosed = sidebar.classList.toggle('closed');
        toggleSidebar.innerText = isClosed ? "▶" : "◀";
    };

    // Page Switching
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.getAttribute('data-page');
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            if(page === 'history') renderLibrary();
        };
    });

    // Username Availability / Recommendation
    document.getElementById('username').oninput = function() {
        const val = this.value;
        const sug = document.getElementById('nameSuggestions');
        if(val.length > 2) {
            sug.classList.remove('hidden');
            sug.innerHTML = `Recommended: <b>${val}_Potatofied</b> or <b>Hot_${val}</b>`;
        }
    };

    // File Box Logic
    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if(e.target.files[0]) {
            document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>CHAMBERED`;
        }
    };

    // Compression Ignition
    document.getElementById('igniteBtn').onclick = () => {
        const file = fileInput.files[0];
        if(!file) return alert("Please drag a game into the box!");

        // Assessment Simulation
        localStorage.setItem('savedPC', pcInput.value);
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
                finishCompression(file);
            }
        }, 50);
    };

    function finishCompression(file) {
        potato.classList.remove('compressing-red');
        document.getElementById('benchmarkBarContainer').classList.add('hidden');
        document.getElementById('statusText').innerText = "SUCCESS";

        const level = parseFloat(document.getElementById('compLevel').value);
        const originalGB = (file.size / (1024 ** 3)).toFixed(2);
        const compressedGB = (originalGB * (1 - level)).toFixed(2);
        const savedMB = ((originalGB - compressedGB) * 1024).toFixed(0);

        const newGame = {
            title: `Potatofied-${file.name}`,
            info: `${originalGB}GB → ${compressedGB}GB (Saved ${savedMB}MB)`,
            date: new Date().toLocaleDateString(),
            img: `https://picsum.photos/seed/${Math.random()}/200/200`
        };

        libraryData.unshift(newGame);
        renderLibrary();
    }

    function renderLibrary() {
        historyGrid.innerHTML = '';
        // Fill with current library + blank squares
        libraryData.forEach(game => {
            const square = document.createElement('div');
            square.className = 'dashed-square';
            square.style.backgroundImage = `url(${game.img})`;
            square.style.backgroundSize = 'cover';
            square.innerHTML = `<div class="hover-info"><b>${game.title}</b><br>${game.info}<br>${game.date}</div>`;
            historyGrid.appendChild(square);
        });
        for(let i=0; i<8; i++) {
            const blank = document.createElement('div');
            blank.className = 'dashed-square';
            historyGrid.appendChild(blank);
        }
    }

    // Auth Modal Handlers (Supabase placeholders)
    document.getElementById('openSignup').onclick = () => document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('closeModal').onclick = () => document.getElementById('authModal').classList.add('hidden');
});
