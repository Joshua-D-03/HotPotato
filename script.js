// Environment variable simulation for security
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

    let currentUser = null; 
    let isSignupMode = true;

    // --- AUTH LOGIC ---
    const getUsers = () => JSON.parse(localStorage.getItem('hp_accounts')) || [];
    
    const handleAuth = () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const user = document.getElementById('username').value;
        const status = document.getElementById('status-msg');
        let accounts = getUsers();

        if (isSignupMode) {
            if (accounts.find(a => a.email === email)) return status.innerText = "Email already exists!";
            if (!user || !email || !pass) return status.innerText = "Fill all fields!";
            accounts.push({ username: user, email, password: pass });
            localStorage.setItem('hp_accounts', JSON.stringify(accounts));
            alert("Account created! You can now log in.");
            toggleAuthUI();
        } else {
            const found = accounts.find(a => a.email === email && a.password === pass);
            if (found) {
                currentUser = found;
                updateAuthUI();
                document.getElementById('authModal').classList.add('hidden');
            } else {
                status.innerText = "Invalid credentials!";
            }
        }
    };

    const toggleAuthUI = () => {
        isSignupMode = !isSignupMode;
        document.getElementById('modalTitle').innerText = isSignupMode ? "JOIN THE PATCH" : "WELCOME BACK";
        document.getElementById('authSubmitBtn').innerText = isSignupMode ? "CREATE ACCOUNT" : "LOGIN";
        document.getElementById('username').style.display = isSignupMode ? "block" : "none";
        document.getElementById('toggleAuthMode').innerText = isSignupMode ? "Already have an account? Log In" : "Need an account? Sign Up";
    };

    const updateAuthUI = () => {
        document.getElementById('loggedOutNav').classList.toggle('hidden', !!currentUser);
        document.getElementById('loggedInNav').classList.toggle('hidden', !currentUser);
        if (currentUser) {
            document.getElementById('userDisplay').innerText = currentUser.username.toUpperCase();
            document.getElementById('replySection').classList.remove('hidden');
            document.getElementById('loginToReplyMsg').classList.add('hidden');
        }
    };

    // --- NAVIGATION ---
    document.getElementById('toggleSidebar').onclick = function() {
        const closed = sidebar.classList.toggle('closed');
        this.innerText = closed ? "▶" : "◀";
    };

    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${item.dataset.page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // --- COMPRESSION LOGIC ---
    let vaultItems = JSON.parse(localStorage.getItem('hp_vault')) || [];
    const renderVault = () => {
        historyGrid.innerHTML = '';
        for(let i=0; i<12; i++) {
            const slot = document.createElement('div');
            slot.className = 'blank-square';
            if(vaultItems[i]) {
                slot.style.backgroundImage = `url(${vaultItems[i].img})`;
                slot.innerHTML = `<button class="delete-vault" onclick="deleteVaultItem(${i})">×</button>`;
            }
            historyGrid.appendChild(slot);
        }
    };
    renderVault();

    window.deleteVaultItem = (index) => {
        vaultItems.splice(index, 1);
        localStorage.setItem('hp_vault', JSON.stringify(vaultItems));
        renderVault();
    };

    document.getElementById('igniteBtn').onclick = () => {
        if(!fileInput.files[0]) return alert("Attach a target file first.");
        
        const file = fileInput.files[0];
        progressContainer.classList.remove('hidden');
        potato.classList.replace('blue-aura', 'compressing-red');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if(progress >= 100) {
                progress = 100;
                clearInterval(interval);
                finishCompression(file);
            }
            progressBar.style.width = `${progress}%`;
            percentText.innerText = `${Math.floor(progress)}%`;
        }, 250);
    };

    function finishCompression(file) {
        const level = parseFloat(document.getElementById('compLevel').value);
        potato.classList.replace('compressing-red', 'blue-aura');
        progressContainer.classList.add('hidden');

        if(vaultItems.length < 12) {
            vaultItems.push({ name: file.name, img: `https://picsum.photos/seed/${file.name}/200/300` });
            localStorage.setItem('hp_vault', JSON.stringify(vaultItems));
            renderVault();
        }
        alert("OPTIMIZATION COMPLETE. Profile added to Vault.");
    }

    // --- EVENT LISTENERS ---
    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if(e.target.files[0]) document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>READY FOR IGNITION`;
    };

    document.getElementById('openSignup').onclick = () => { isSignupMode = true; toggleAuthUI(); document.getElementById('authModal').classList.remove('hidden'); };
    document.getElementById('openLogin').onclick = () => { isSignupMode = false; toggleAuthUI(); document.getElementById('authModal').classList.remove('hidden'); };
    document.getElementById('closeModal').onclick = () => document.getElementById('authModal').classList.add('hidden');
    document.getElementById('toggleAuthMode').onclick = toggleAuthUI;
    document.getElementById('authSubmitBtn').onclick = handleAuth;
    document.getElementById('logoutBtn').onclick = () => { currentUser = null; updateAuthUI(); };
});
