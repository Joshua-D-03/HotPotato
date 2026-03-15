const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// --- Global Variables for Compression Math ---
let selectedReduction = 0;
let currentGameSize = 50; // Mock size in GB for visual comparison
window.selectedFolderPath = null;

document.addEventListener('DOMContentLoaded', () => {
    // --- UI References ---
    const potato = document.getElementById('potato');
    const pcField = document.getElementById('pcType');
    const historyGrid = document.getElementById('historyGrid');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const percentText = document.getElementById('percentText');
    const authModal = document.getElementById('authModal');
    
    // Electron Remote Initialization (if running in Electron)
    try {
        const { ipcRenderer } = require('electron');
        const remoteMain = require('@electron/remote/main');
        remoteMain.initialize();
    } catch(e) {
        console.log("Running in Web Mode (Electron modules not loaded)");
    }

    let isLoginMode = false;

    // --- INTEGRATED SIDEBAR LOGIC ---
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            const closed = sidebar.classList.toggle('closed');
            toggleBtn.innerText = closed ? "▶" : "◀";
        };
    }

    // --- MODAL CLOSING LOGIC ---
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.onclick = () => {
            authModal.classList.add('hidden');
        };
    }

    // --- NAVIGATION LOGIC ---
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.dataset.page;
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            const targetPage = document.getElementById(`${page}Page`);
            if (targetPage) targetPage.classList.remove('hidden');
            
            // Handle page-specific loading
            if (page === 'community') loadDiscussions();
            if (page === 'library') loadLibrary(); 
            
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // --- IGNITE LOGIC (Fused Animation + Backend Bridge) ---
    const igniteBtn = document.getElementById('igniteBtn');
    if (igniteBtn) {
        igniteBtn.onclick = function() {
            if (!window.selectedFolderPath) {
                alert("Please select a Steam game folder first!");
                return;
            }

            // Start Visual Effects
            this.disabled = true;
            this.innerText = "COMPRESSING...";
            potato.classList.add('ignite-animation');
            potato.classList.add('compressing'); 
            progressContainer.classList.remove('hidden');

            // Apply rotation speed based on level
            // Note: Ensure your HTML select id is 'compLevel'
            const levelVal = document.getElementById('compLevel')?.value || '30'; 
            potato.classList.remove('rotate-25', 'rotate-50', 'rotate-100', 'rotate-200');
            
            if (levelVal === "15") potato.classList.add('rotate-25');
            else if (levelVal === "30") potato.classList.add('rotate-50');
            else if (levelVal === "65") potato.classList.add('rotate-100');
            else if (levelVal === "85") potato.classList.add('rotate-200');

            // Progress Bar Simulation
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if(progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        stopCompressionEffect();
                        this.disabled = false;
                        this.innerText = "IGNITE COMPRESSION";
                        finish(); // Trigger Fused Supabase Sync and Electron Command
                    }, 1000);
                }
                progressBar.style.width = progress + "%";
                percentText.innerText = Math.floor(progress) + "%";
            }, 300);
        };
    }

    // --- AUTH LOGIC ---
    function toggleAuthMode() {
        const title = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('auth-submit-btn');
        const toggleText = document.getElementById('auth-toggle-text');
        const userField = document.getElementById('username');

        if(isLoginMode) {
            title.innerText = "WELCOME BACK";
            submitBtn.innerText = "LOG IN";
            toggleText.innerText = "Need an account? Sign Up";
            userField.style.display = "none";
        } else {
            title.innerText = "JOIN THE PATCH";
            submitBtn.innerText = "CREATE ACCOUNT";
            toggleText.innerText = "Already have an account? Log In";
            userField.style.display = "block";
        }
    }

    const authToggle = document.getElementById('auth-toggle-text');
    if (authToggle) {
        authToggle.onclick = () => {
            isLoginMode = !isLoginMode;
            toggleAuthMode();
        };
    }

    const authSubmit = document.getElementById('auth-submit-btn');
    if (authSubmit) {
        authSubmit.onclick = async () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const status = document.getElementById('status-msg');

            if(isLoginMode) {
                const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if(error) status.innerText = error.message;
                else loginUser(data.user.email);
            } else {
                const { data, error } = await supabaseClient.auth.signUp({ email, password });
                if(error) status.innerText = error.message;
                else status.innerText = "Check your email for the confirmation link!";
            }
        };
    }

    // --- FILE SELECTION LOGIC ---
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.onclick = () => {
            if (window.api && window.api.selectFolder) {
                selectGameFolder();
            } else {
                fileInput.click();
            }
        };
    }

    if (fileInput) {
        fileInput.onchange = (e) => { 
            const file = e.target.files[0];
            if (file) {
                window.selectedFolderPath = file.name;
                document.getElementById('fileLabel').innerHTML = `<strong>${file.name}</strong><br>READY FOR IGNITION`;
            }
        };
    }

    const savedUser = localStorage.getItem('hp_user');
    if(savedUser) loginUser(savedUser);

    const openSignup = document.getElementById('openSignup');
    if (openSignup) openSignup.onclick = () => { isLoginMode = false; toggleAuthMode(); authModal.classList.remove('hidden'); };
    
    const openLogin = document.getElementById('openLogin');
    if (openLogin) openLogin.onclick = () => { isLoginMode = true; toggleAuthMode(); authModal.classList.remove('hidden'); };
});

// --- HELPER FUNCTIONS ---

function stopCompressionEffect() {
    const potatoImg = document.getElementById('potato');
    potatoImg.classList.remove('ignite-animation', 'compressing', 'rotate-25', 'rotate-50', 'rotate-100', 'rotate-200');
}

function loginUser(email) {
    localStorage.setItem('hp_user', email);
    document.getElementById('loggedOutNav').classList.add('hidden');
    document.getElementById('loggedInNav').classList.remove('hidden');
    document.getElementById('userDisplay').innerText = email.split('@')[0].toUpperCase();
    
    const newPostBtn = document.getElementById('newPostBtn');
    if(newPostBtn) newPostBtn.classList.remove('hidden');
    
    document.getElementById('authModal').classList.add('hidden');
    loadLibrary(); 
}

function setLevel(percent, name) {
    selectedReduction = percent;
    const comparisonView = document.getElementById('comparison-view');
    if (comparisonView) comparisonView.classList.remove('hidden');
    
    const newSize = (currentGameSize * (1 - percent/100)).toFixed(2);
    document.getElementById('oldSize').innerText = currentGameSize;
    document.getElementById('newSize').innerText = newSize;
    
    const newBar = document.getElementById('newBar');
    if (newBar) newBar.style.width = (100 - percent) + "%";
}

// --- FUSED FINISH & SUPABASE SYNC ---
async function finish() {
    const gameName = window.selectedFolderPath ? window.selectedFolderPath.split(/[\\/]/).pop() : "Unknown Game";
    const levelVal = document.getElementById('compLevel')?.value || '30';
    const finalSize = (currentGameSize * (1 - parseInt(levelVal)/100)).toFixed(2);

    // 1. Trigger the Electron Bridge (Calls core.py)
    if (window.api && window.api.sendCompress) {
        window.api.sendCompress({ 
            folderPath: window.selectedFolderPath, 
            mode: levelVal // Passes '15', '30', '85' etc to python
        });
    }

    // 2. Save to Supabase
    const user = localStorage.getItem('hp_user');
    if (user) {
        const { error } = await supabaseClient
            .from('user_vault')
            .insert([{ 
                user_id: user,
                game_name: gameName, 
                original_size: currentGameSize, 
                compressed_size: parseFloat(finalSize),
                level: levelVal + "%"
            }]);
        
        if (!error) {
            console.log("Saved to Vault!");
            loadLibrary(); 
        }
    }

    // 3. Update Visuals
    updateComparisonChart(currentGameSize, finalSize);
    alert("Ignition successful! " + gameName + " is being compressed.");
}

// --- LIBRARY LOADER ---
async function loadLibrary() {
    const user = localStorage.getItem('hp_user');
    if (!user) return;

    const { data, error } = await supabaseClient
        .from('user_vault')
        .select('*')
        .eq('user_id', user)
        .order('created_at', { ascending: false });

    const container = document.getElementById('libraryGrid');
    if (container && data) {
        container.innerHTML = data.map(game => `
            <div class="library-card">
                <h4>${game.game_name}</h4>
                <p>Reduction: ${game.level || 'N/A'}</p>
                <p>Saved: ${(game.original_size - game.compressed_size).toFixed(2)} GB</p>
                <div class="status-tag">OPTIMIZED</div>
            </div>
        `).join('');
    }
}

function updateComparisonChart(originalSizeGB, compressedSizeGB) {
    const barAfter = document.getElementById('barAfter');
    const savePercent = document.getElementById('savePercent');
    const gbSaved = document.getElementById('gbSaved');

    const reduction = ((originalSizeGB - compressedSizeGB) / originalSizeGB) * 100;
    const heightPercent = (compressedSizeGB / originalSizeGB) * 100;

    if(barAfter) barAfter.style.height = `${heightPercent}%`;
    if(savePercent) savePercent.innerText = `${reduction.toFixed(1)}%`;
    if(gbSaved) gbSaved.innerText = `${(originalSizeGB - compressedSizeGB).toFixed(2)} GB`;
}

// --- COMMUNITY HUB LOGIC ---
async function loadDiscussions() {
    const { data, error } = await supabaseClient
        .from('discussions')
        .select('*')
        .order('created_at', { ascending: false });

    const tbody = document.querySelector('#nexusTable tbody');
    if (tbody && data) {
        tbody.innerHTML = data.map(post => `
            <tr>
                <td class="nexus-blue">${post.title}</td>
                <td>${post.author}</td>
                <td>${post.replies_count}</td>
            </tr>
        `).join('');
    }
}

// --- ELECTRON BRIDGE FUNCTIONS ---
async function selectGameFolder() {
    if (window.api && window.api.selectFolder) {
        const path = await window.api.selectFolder();
        if (path) {
            window.selectedFolderPath = path;
            document.getElementById('fileLabel').innerHTML = `<strong>Folder Selected</strong><br>${path}`;
        }
    }
}

if (window.api && window.api.onCompressResult) {
    window.api.onCompressResult((response) => {
        if (response.status === 'success') {
            console.log("Backend Success Signal Received");
        } else {
            alert("Backend Error: " + response.message);
        }
    });
}
