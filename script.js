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

    let currentUser = null; 
    let isSignupMode = true;

    // --- AUTH LOGIC (Local persistent users) ---
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
            loginUser(user);
        } else {
            const found = accounts.find(a => a.email === email && a.password === pass);
            if (found) loginUser(found.username);
            else status.innerText = "Invalid credentials!";
        }
    };

    const loginUser = (name) => {
        currentUser = name;
        localStorage.setItem('hp_current_user', name);
        document.getElementById('userDisplay').innerText = name.toUpperCase();
        document.getElementById('loggedOutNav').classList.add('hidden');
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('authModal').classList.add('hidden');
        document.getElementById('replySection')?.classList.remove('hidden');
        document.getElementById('loginToReplyMsg')?.classList.add('hidden');
    };

    // Sidebar
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

    // Vault Logic
    let vaultItems = JSON.parse(localStorage.getItem('hp_vault')) || [];
    const renderVault = () => {
        historyGrid.innerHTML = '';
        for(let i=0; i<12; i++) {
            const item = vaultItems[i];
            const div = document.createElement('div');
            div.className = `blank-square ${item ? 'filled' : ''}`;
            if(item) {
                div.style.backgroundImage = `url(${item.img})`;
                div.innerHTML = `<button class="delete-vault" onclick="deleteItem(${i})">×</button>`;
            }
            historyGrid.appendChild(div);
        }
    };

    window.deleteItem = (index) => {
        vaultItems.splice(index, 1);
        localStorage.setItem('hp_vault', JSON.stringify(vaultItems));
        renderVault();
    };
    renderVault();

    // Compression Simulation
    document.getElementById('igniteBtn').onclick = () => {
        const file = fileInput.files[0];
        if(!file) return alert("Upload a file first.");
        
        progressContainer.classList.remove('hidden');
        potato.classList.replace('blue-aura', 'compressing-red');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += (Math.random() * 10);
            if(progress >= 100) { 
                progress = 100; 
                clearInterval(interval); 
                finish(file); 
            }
            progressBar.style.width = `${progress}%`;
            percentText.innerText = `${Math.floor(progress)}%`;
        }, 200);
    };

    function finish(file) {
        const level = parseFloat(document.getElementById('compLevel').value);
        const oldSize = (file.size / (1024*1024)).toFixed(2);
        const newSize = (oldSize * (1 - level)).toFixed(2);
        potato.classList.replace('compressing-red', 'blue-aura');
        progressContainer.classList.add('hidden');
        if(vaultItems.length < 12) {
            vaultItems.push({ name: file.name, img: `https://picsum.photos/seed/${file.name}/200/300` });
            localStorage.setItem('hp_vault', JSON.stringify(vaultItems));
            renderVault();
        }
        alert(`COMPRESSION COMPLETE\nEfficiency: ${Math.floor(level*100)}%\nOriginal: ${oldSize}MB\nPOTATO: ${newSize}MB`);
    }

    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => { if(e.target.files[0]) document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>READY`; };
    
    document.getElementById('authSubmitBtn').onclick = handleAuth;
    document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('hp_current_user');
        location.reload();
    };
});
