// Configuration
const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabase = window.supabase ? window.supabase.createClient(SB_URL, SB_KEY) : null;

document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let libraryData = JSON.parse(localStorage.getItem('userLibrary')) || [];

    const potato = document.getElementById('potato');
    const statusText = document.getElementById('statusText');
    const pcInput = document.getElementById('pcType');
    const historyGrid = document.getElementById('historyGrid');

    // Persist PC Model
    if(localStorage.getItem('pc_model')) pcInput.value = localStorage.getItem('pc_model');

    // Generate Initial Blank Grid
    const initGrid = () => {
        historyGrid.innerHTML = '';
        const itemsToRender = Math.max(libraryData.length, 12);
        for(let i=0; i < itemsToRender; i++) {
            const item = libraryData[i];
            const div = document.createElement('div');
            div.className = 'dashed-square';
            if(item) {
                div.innerHTML = `
                    <div class="poster-fill" style="background-image:url('${item.img}')"></div>
                    <div class="hover-info">
                        <strong class="orange-text">${item.title}</strong><br>
                        ${item.sizeInfo}<br>
                        <span style="color:#555">${item.date}</span>
                    </div>
                `;
            }
            historyGrid.appendChild(div);
        }
    };
    initGrid();

    // Username Validation & Recommendations
    document.getElementById('username').addEventListener('input', function() {
        const val = this.value;
        const sug = document.getElementById('nameSuggestions');
        if(val.length > 3) {
            sug.classList.remove('hidden');
            sug.innerHTML = `Recommended: <span style="color:white">${val}_Potato</span> or <span style="color:white">Hot_${val}</span>`;
        } else {
            sug.classList.add('hidden');
        }
    });

    // Compression Engine
    document.getElementById('igniteBtn').onclick = () => {
        const file = document.getElementById('fileInput').files[0];
        if(!file) return alert("Game box is empty. Drag a file in.");

        // Speed up potato & turn red
        potato.classList.add('compressing-red');
        document.getElementById('benchmarkBarContainer').classList.remove('hidden');
        statusText.innerText = "WEB ASSESSMENT: ANALYZING HARDWARE...";
        
        localStorage.setItem('pc_model', pcInput.value);

        let progress = 0;
        const bar = document.getElementById('benchmarkBar');
        const interval = setInterval(() => {
            progress += 1.5;
            bar.style.width = progress + "%";
            
            if(progress > 40) statusText.innerText = "RESTRUCTURING INDIE/AAA DATA...";
            if(progress > 80) statusText.innerText = "FINALIZING POTATOFIED PACK...";

            if(progress >= 100) {
                clearInterval(interval);
                finalizeCompression(file);
            }
        }, 60);
    };

    function finalizeCompression(file) {
        potato.classList.remove('compressing-red');
        document.getElementById('benchmarkBarContainer').classList.add('hidden');
        statusText.innerText = "OPTIMIZATION COMPLETE";

        const level = parseFloat(document.getElementById('compLevel').value);
        const originalGB = (file.size / (1024**3)).toFixed(2);
        const compressedGB = (originalGB * (1 - level)).toFixed(2);
        const savedMB = ((originalGB - compressedGB) * 1024).toFixed(0);

        const newEntry = {
            title: `Potatofied-${file.name.split('.')[0]}`,
            sizeInfo: `${originalGB}GB → ${compressedGB}GB (-${savedMB}MB)`,
            date: new Date().toLocaleDateString(),
            img: `https://picsum.photos/seed/${Math.random()}/400/400`,
            timestamp: Date.now()
        };

        libraryData.unshift(newEntry);
        localStorage.setItem('userLibrary', JSON.stringify(libraryData));
        initGrid();
        alert(`Success! Game reduced by ${(level*100)}%`);
    }

    // Modal Controls
    document.getElementById('openSignup').onclick = () => document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('closeModal').onclick = () => document.getElementById('authModal').classList.add('hidden');

    // Sidebar & Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.onclick = () => {
            const page = btn.dataset.page;
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            btn.classList.add('active');
            
            // Community Read-Only Toggle
            const isAuth = currentUser !== null;
            document.getElementById('postContainer').classList.toggle('hidden', !isAuth);
            document.getElementById('loginReminder').classList.toggle('hidden', isAuth);
        };
    });

    // File Drag Hook
    document.getElementById('dropZone').onclick = () => document.getElementById('fileInput').click();
    document.getElementById('fileInput').onchange = (e) => {
        if(e.target.files[0]) document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>CHAMBERED`;
    };
});
