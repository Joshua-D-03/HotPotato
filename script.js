// --- Supabase Setup ---
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
            if (page === 'library') loadLibrary(); // Added: Load library when entering page
            
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // --- IGNITE LOGIC (Fused Animation + Backend Bridge) ---
    document.getElementById('igniteBtn').onclick = function() {
        if (!window.selectedFolderPath) {
            alert("Please select a game folder/file first!");
            return;
        }

        // Start Visual Effects
        this.disabled = true;
        this.innerText = "COMPRESSING...";
        potato.classList.add('ignite-animation');
        potato.classList.add('compressing'); // Add red aura
        progressContainer.classList.remove('hidden');

        // Apply rotation speed based on level
        const levelVal = document.getElementById('compressionLevel')?.value || 'balance';
        potato.classList.remove('spin-standard', 'spin-balance', 'spin-extreme', 'spin-potato');
        potato.classList.add(`spin-${levelVal}`);

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

    document.getElementById('auth-toggle-text').onclick = () => {
        isLoginMode = !isLoginMode;
        toggleAuthMode();
    };

    document.getElementById('auth-submit-btn').onclick = async () => {
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

    // --- FILE SELECTION LOGIC ---
    document.getElementById('dropZone').onclick = () => {
        if (window.api && window.api.selectFolder) {
            selectGameFolder();
        } else {
            fileInput.click();
        }
    };

    fileInput.onchange = (e) => { 
        const file = e.target.files[0];
        if (file) {
            const allowedExtensions = ['.mp4', '.avi', '.mkv', '.wmv', '.acf'];
            const fileName = file.name.toLowerCase();
            const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));

            if (isValid) {
                window.selectedFolderPath = file.name;
                document.getElementById('fileLabel').innerHTML = `<strong>${file.name}</strong><br>STEAM FILE DETECTED`;
            } else {
                alert("Invalid file type.");
                fileInput.value = "";
                document.getElementById('fileLabel').innerHTML = `DROP GAME HERE`;
            }
        }
    };

    const savedUser = localStorage.getItem('hp_user');
    if(savedUser) loginUser(savedUser);

    document.getElementById('openSignup').onclick = () => { isLoginMode = false; toggleAuthMode(); authModal.classList.remove('hidden'); };
    document.getElementById('openLogin').onclick = () => { isLoginMode = true; toggleAuthMode(); authModal.classList.remove('hidden'); };
});

// --- HELPER FUNCTIONS ---

function stopCompressionEffect() {
    const potatoImg = document.getElementById('potato');
    potatoImg.classList.remove('ignite-animation', 'compressing', 'spin-standard', 'spin-balance', 'spin-extreme', 'spin-potato');
}

function loginUser(email) {
    localStorage.setItem('hp_user', email);
    document.getElementById('loggedOutNav').classList.add('hidden');
    document.getElementById('loggedInNav').classList.remove('hidden');
    document.getElementById('userDisplay').innerText = email.split('@')[0].toUpperCase();
    
    const newPostBtn = document.getElementById('newPostBtn');
    if(newPostBtn) newPostBtn.classList.remove('hidden');
    
    document.getElementById('authModal').classList.add('hidden');
    loadLibrary(); // Check for existing games on login
}

function setLevel(percent, name) {
    selectedReduction = percent;
    document.getElementById('comparison-view').classList.remove('hidden');
    
    const newSize = (currentGameSize * (1 - percent/100)).toFixed(2);
    document.getElementById('oldSize').innerText = currentGameSize;
    document.getElementById('newSize').innerText = newSize;
    
    document.getElementById('newBar').style.width = (100 - percent) + "%";
}

// --- FUSED FINISH & SUPABASE SYNC ---
async function finish() {
    // Attempt to parse folder name from path, fallback to "Unknown Game"
    const gameName = window.selectedFolderPath ? window.selectedFolderPath.split(/[\\/]/).pop() : "Unknown Game";
    const mode = document.getElementById('compMode')?.value || 'balanced';
    const finalSize = (currentGameSize * (1 - selectedReduction/100)).toFixed(2);

    // 1. Trigger the Electron Bridge (Calls core.py)
    if (window.api && window.api.sendCompress) {
        window.api.sendCompress({ 
            folderPath: window.selectedFolderPath, 
            mode: mode, 
            level: selectedReduction 
        });
    }

    // 2. Save to Supabase (Vault & Analytics)
    const user = localStorage.getItem('hp_user');
    if (user) {
        const { error } = await supabaseClient
            .from('user_vault')
            .insert([{ 
                user_id: user,
                game_name: gameName, 
                original_size: currentGameSize, 
                compressed_size: parseFloat(finalSize),
                level: selectedReduction + "%",
                mode: mode
            }]);
        
        if (!error) {
            console.log("Saved to Vault!");
            loadLibrary(); // Refresh library view automatically
        } else {
            console.error("Vault Save Error:", error);
        }
    }

    // 3. Update the Analytics Visuals
    updateComparisonChart(currentGameSize, finalSize);
    alert("Compression Started! Data logged to your Library.");
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
                <p>Mode: ${game.mode || 'N/A'}</p>
                <p>Saved: ${(game.original_size - game.compressed_size).toFixed(2)} GB</p>
                <div class="status-tag">COMPRESSED</div>
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
            alert("Success! Real-time compression completed.");
        } else {
            alert("Compression Failed: " + response.message);
        }
    });
}
