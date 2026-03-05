const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const sidebar = document.getElementById('sidebar');
    const pcField = document.getElementById('pcType');
    const historyGrid = document.getElementById('historyGrid');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const percentText = document.getElementById('percentText');

    // Hardware Scanner Load
    const hardware = ["RTX 4090 | i9-14900K", "RTX 3070 | Ryzen 7", "GTX 1660 Ti | i5-11th"];
    setTimeout(() => { pcField.value = hardware[Math.floor(Math.random()*hardware.length)]; }, 1000);

    // Sidebar & Navigation
    document.getElementById('toggleSidebar').onclick = function() {
        const closed = sidebar.classList.toggle('closed');
        this.innerText = closed ? "▶" : "◀";
    };

    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.dataset.page;
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // Vault Logic with Local Storage Persistence
    let vaultItems = JSON.parse(localStorage.getItem('hp_vault')) || [];

    function renderVault() {
        historyGrid.innerHTML = '';
        for(let i=0; i<12; i++) {
            const div = document.createElement('div');
            div.className = 'blank-square';
            if(vaultItems[i]) {
                div.classList.add('filled');
                div.style.backgroundImage = `url('${vaultItems[i].img}')`;
                div.innerHTML = `<button class="delete-vault" onclick="deleteVaultItem(${i})">REMOVE</button>`;
            }
            historyGrid.appendChild(div);
        }
    }

    window.deleteVaultItem = (index) => {
        vaultItems.splice(index, 1);
        localStorage.setItem('hp_vault', JSON.stringify(vaultItems));
        renderVault();
    };

    renderVault();

    // Ignition Compression Logic
    document.getElementById('igniteBtn').onclick = () => {
        const file = fileInput.files[0];
        if(!file) return alert("Please drop a game file into the box first.");

        const fileSizeGB = file.size / (1024 * 1024 * 1024);
        if(fileSizeGB > 50) {
            if(!confirm(`WARNING: ${fileSizeGB.toFixed(2)}GB detected. Proceed?`)) return;
        }

        // Setup Progress Bar
        progressContainer.classList.remove('hidden');
        potato.classList.replace('blue-aura', 'compressing-red');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if(progress >= 100) {
                progress = 100;
                clearInterval(interval);
                finalizeCompression(file);
            }
            progressBar.style.width = `${progress}%`;
            percentText.innerText = `${Math.floor(progress)}%`;
        }, 300);
    };

    function finalizeCompression(file) {
        const compLevel = parseFloat(document.getElementById('compLevel').value);
        const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const newSizeMB = (originalSizeMB * (1 - compLevel)).toFixed(2);
        const savedMB = (originalSizeMB - newSizeMB).toFixed(2);

        potato.classList.replace('compressing-red', 'blue-aura');
        progressContainer.classList.add('hidden');
        progressBar.style.width = '0%';

        // Create Vault Item
        if(vaultItems.length < 12) {
            vaultItems.push({
                name: file.name,
                img: `https://picsum.photos/seed/${file.name}/200/300`
            });
            localStorage.setItem('hp_vault', JSON.stringify(vaultItems));
            renderVault();
        }

        alert(`COMPRESSION SUCCESS!\nOriginal: ${originalSizeMB} MB\nPotato-Mode: ${newSizeMB} MB\nYou saved ${savedMB} MB!`);
        
        // Return file (Simulated by triggering a dummy download of the original)
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = `POTATO_${file.name}`;
        link.click();
    }

    // Community Toggle for Logged In Users
    function checkLoginStatus() {
        const user = localStorage.getItem('hp_user'); 
        if(user) {
            document.getElementById('newPostBtn').classList.remove('hidden');
        }
    }
    checkLoginStatus();

    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if(e.target.files[0]) {
            document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>READY FOR IGNITION`;
        }
    };

    document.getElementById('openSignup').onclick = () => document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('closeModal').onclick = () => document.getElementById('authModal').classList.add('hidden');
});
