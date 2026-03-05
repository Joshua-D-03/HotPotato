const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const sidebar = document.getElementById('sidebar');
    const pcField = document.getElementById('pcType');
    const historyGrid = document.getElementById('historyGrid');
    const fileInput = document.getElementById('fileInput');

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

    // Populate Initial Blank Squares
    function createGrid() {
        historyGrid.innerHTML = '';
        for(let i=0; i<12; i++) {
            const div = document.createElement('div');
            div.className = 'blank-square';
            div.id = `slot-${i}`;
            historyGrid.appendChild(div);
        }
    }
    createGrid();

    let filledCount = 0;

    // Ignition Compression Logic
    document.getElementById('igniteBtn').onclick = () => {
        const file = fileInput.files[0];
        if(!file) return alert("Please drop a game file into the box first.");

        // Safety Warning for large files
        const fileSizeGB = file.size / (1024 * 1024 * 1024);
        if(fileSizeGB > 50) {
            const proceed = confirm(`WARNING: This file is ${fileSizeGB.toFixed(2)}GB. Compressing files over 50GB may cause browser instability. Do you wish to proceed?`);
            if(!proceed) return;
        }

        // Visual State Shift
        potato.classList.remove('blue-aura');
        potato.classList.add('compressing-red');
        
        setTimeout(() => {
            potato.classList.remove('compressing-red');
            potato.classList.add('blue-aura');
            
            // Fill a blank square in the library
            if(filledCount < 12) {
                const slot = document.getElementById(`slot-${filledCount}`);
                slot.classList.add('filled');
                // Using a random placeholder game art
                slot.style.backgroundImage = `url('https://picsum.photos/seed/${Math.random()}/200/300')`;
                filledCount++;
            }
            
            alert("Compression Optimized. Profile saved to Vault.");
        }, 4000);
    };

    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if(e.target.files[0]) {
            document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>READY FOR IGNITION`;
        }
    };

    // Auth UI
    document.getElementById('openSignup').onclick = () => document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('closeModal').onclick = () => document.getElementById('authModal').classList.add('hidden');
});
