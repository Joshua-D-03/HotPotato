// Pulling from environment variables
const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_KEY;
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

    // Authentication State
    let isLoginMode = false;

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

    // Vault Logic
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

    // STEAM FILE VALIDATION
    function isSteamGame(file) {
        const name = file.name.toLowerCase();
        // Steam games are usually executables (.exe for Windows, .app for Mac)
        return name.endsWith('.exe') || name.endsWith('.app') || name.includes('steam');
    }

    // Compression Logic
    document.getElementById('igniteBtn').onclick = () => {
        const file = fileInput.files[0];
        if(!file) return alert("Please drop a game file into the box first.");

        // Check if it's a Steam Game
        if(!isSteamGame(file)) {
            alert("ERROR: This tool only accepts Steam Video Games (.exe or .app). Photos and regular documents are not supported.");
            return;
        }

        const fileSizeGB = file.size / (1024 * 1024 * 1024);
        if(fileSizeGB > 50) {
            if(!confirm(`WARNING: Large Steam library file (${fileSizeGB.toFixed(2)}GB) detected. Proceed?`)) return;
        }

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
        potato.classList.replace('compressing-red', 'blue-aura');
        progressContainer.classList.add('hidden');
        
        if(vaultItems.length < 12) {
            vaultItems.push({ name: file.name, img: `https://picsum.photos/seed/${file.name}/200/300` });
            localStorage.setItem('hp_vault', JSON.stringify(vaultItems));
            renderVault();
        }
        alert(`STEAM COMPRESSION SUCCESS!\nSaved to Vault.`);
    }

    // AUTH LOGIC (Logging back in)
    const authModal = document.getElementById('authModal');
    const modalTitle = document.getElementById('modalTitle');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authToggleText = document.getElementById('auth-toggle-text');

    function toggleAuthMode() {
        isLoginMode = !isLoginMode;
        modalTitle.innerText = isLoginMode ? "LOG BACK IN" : "JOIN THE PATCH";
        authSubmitBtn.innerText = isLoginMode ? "LOGIN" : "CREATE ACCOUNT";
        authToggleText.innerText = isLoginMode ? "Need an account? Sign Up" : "Already have an account? Log In";
        document.getElementById('username').style.display = isLoginMode ? 'none' : 'block';
    }

    authToggleText.onclick = toggleAuthMode;

    authSubmitBtn.onclick = () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const user = document.getElementById('username').value;

        if(!email || !pass) return alert("Fill in all fields");

        if(isLoginMode) {
            const storedUser = JSON.parse(localStorage.getItem('hp_account'));
            if(storedUser && storedUser.email === email && storedUser.pass === pass) {
                loginUser(storedUser.username);
            } else {
                alert("Invalid Credentials");
            }
        } else {
            localStorage.setItem('hp_account', JSON.stringify({ email, pass, username: user }));
            loginUser(user);
        }
    };

    function loginUser(name) {
        localStorage.setItem('hp_user', name);
        document.getElementById('userDisplay').innerText = name.toUpperCase();
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('loggedOutNav').classList.add('hidden');
        document.getElementById('newPostBtn').classList.remove('hidden');
        authModal.classList.add('hidden');
    }

    document.getElementById('signOutBtn').onclick = () => {
        localStorage.removeItem('hp_user');
        location.reload();
    };

    document.getElementById('openSignup').onclick = () => { isLoginMode = false; toggleAuthMode(); toggleAuthMode(); authModal.classList.remove('hidden'); };
    document.getElementById('openLogin').onclick = () => { isLoginMode = true; toggleAuthMode(); toggleAuthMode(); authModal.classList.remove('hidden'); };
    document.getElementById('closeModal').onclick = () => authModal.classList.add('hidden');

    // Dropzone trigger
    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if(e.target.files[0]) {
            document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>STEAM FILE DETECTED`;
        }
    };
});
