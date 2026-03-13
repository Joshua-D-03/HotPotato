// --- Supabase Setup ---
const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// --- Global Variables for Sizing & Comparison ---
let selectedReduction = 0;
let currentGameSize = 50; // Mock size in GB for visual comparison

// FUSED: Sizing & Bar Logic (Global so HTML can see it)
function setLevel(percent, name) {
    selectedReduction = percent;
    document.getElementById('comparison-view').classList.remove('hidden');
    
    const newSize = (currentGameSize * (1 - percent/100)).toFixed(2);
    document.getElementById('oldSize').innerText = currentGameSize;
    document.getElementById('newSize').innerText = newSize;
    
    // Visual bar update
    document.getElementById('newBar').style.width = (100 - percent) + "%";
}

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Variables ---
    const potato = document.getElementById('potato');
    const pcField = document.getElementById('pcType');
    const historyGrid = document.getElementById('historyGrid');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const percentText = document.getElementById('percentText');
    const authModal = document.getElementById('authModal');
    
    // Electron Remote Init
    const { ipcRenderer } = require('electron');
    const remoteMain = require('@electron/remote/main');
    remoteMain.initialize();
    
    let isLoginMode = false;

    // --- SIDEBAR & MODAL FIXES ---
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            const closed = sidebar.classList.toggle('closed');
            toggleBtn.innerText = closed ? "▶" : "◀";
        };
    }

    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.onclick = () => {
            authModal.classList.add('hidden');
        };
    }

    // Navigation Logic
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.dataset.page;
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            const targetPage = document.getElementById(`${page}Page`);
            if (targetPage) targetPage.classList.remove('hidden');
            
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // --- IGNITE & COMPRESSION LOGIC ---
    document.getElementById('igniteBtn').onclick = function() {
        // Validation check from original code
        const file = fileInput.files[0];
        if (file) {
            const allowedExtensions = ['.mp4', '.avi', '.mkv', '.wmv'];
            const fileName = file.name.toLowerCase();
            const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));

            if (!isValid) {
                alert("Invalid file type. Please select a video game file (.mp4, .avi, .mkv, .wmv).");
                fileInput.value = ""; 
                document.getElementById('fileLabel').innerHTML = `DROP GAME HERE`;
                return;
            }
        }

        // Animation & Progress
        this.disabled = true;
        this.innerText = "COMPRESSING...";
        potato.classList.add('ignite-animation');
        potato.classList.add('compressing'); // Turn aura red
        progressContainer.classList.remove('hidden');

        // Apply specific spin speed based on selection
        const levelVal = document.getElementById('compressionLevel') ? document.getElementById('compressionLevel').value : 'standard';
        potato.classList.remove('spin-standard', 'spin-balance', 'spin-extreme', 'spin-potato');
        potato.classList.add(`spin-${levelVal}`);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if(progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    alert("GAME OPTIMIZED!");
                    this.disabled = false;
                    this.innerText = "IGNITE COMPRESSION";
                    stopCompressionEffect();
                    
                    // Final Logic Fused: Save data and run bridge
                    finish(); 
                    updateComparisonChart(100, 40); 
                }, 1000);
            }
            progressBar.style.width = progress + "%";
            percentText.innerText = Math.floor(progress) + "%";
        }, 300);

        // Backend Bridge Call
        window.api.sendCompress({ 
            folderPath: window.selectedFolderPath, 
            mode: document.getElementById('compLevel') ? document.getElementById('compLevel').value : 'balanced', 
            level: selectedReduction || levelVal
        });
    };

    function stopCompressionEffect() {
        potato.classList.remove('ignite-animation', 'compressing', 'spin-standard', 'spin-balance', 'spin-extreme', 'spin-potato');
    }

    // --- AUTHENTICATION LOGIC ---
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

    function loginUser(email) {
        localStorage.setItem('hp_user', email);
        document.getElementById('loggedOutNav').classList.add('hidden');
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('userDisplay').innerText = email.split('@')[0].toUpperCase();
        
        const newPostBtn = document.getElementById('newPostBtn');
        if(newPostBtn) newPostBtn.classList.remove('hidden');
        
        authModal.classList.add('hidden');
    }

    // Event Bindings
    document.getElementById('openSignup').onclick = () => { isLoginMode = false; toggleAuthMode(); authModal.classList.remove('hidden'); };
    document.getElementById('openLogin').onclick = () => { isLoginMode = true; toggleAuthMode(); authModal.classList.remove('hidden'); };
    document.getElementById('dropZone').onclick = () => fileInput.click();
    
    fileInput.onchange = (e) => { 
        if(e.target.files[0]) {
            document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>STEAM FILE DETECTED`;
        }
    };

    // --- DATA & VAULT FUNCTIONS ---
    async function saveToVault(gameName, level) {
        const user = localStorage.getItem('hp_user');
        if (!user) return;

        const { data, error } = await supabaseClient
            .from('user_vault')
            .insert([{ 
                game_name: gameName, 
                compression_level: level,
                user_id: user 
            }]);
        
        if (error) console.error("Vault Save Error:", error);
        else console.log("Added to Vault!");
    }

    function updateComparisonChart(originalSizeGB, compressedSizeGB) {
        const barAfter = document.getElementById('barAfter');
        const savePercent = document.getElementById('savePercent');
        const gbSaved = document.getElementById('gbSaved');

        const reduction = ((originalSizeGB - compressedSizeGB) / originalSizeGB) * 100;
        const heightPercent = (compressedSizeGB / originalSizeGB) * 100;

        barAfter.style.height = `${heightPercent}%`;
        savePercent.innerText = `${reduction.toFixed(1)}%`;
        gbSaved.innerText = `${(originalSizeGB - compressedSizeGB).toFixed(2)} GB`;
    }

    // --- ELECTRON BRIDGE FUNCTIONS ---
    async function selectGameFolder() {
        const path = await window.api.selectFolder();
        if (path) {
            window.selectedFolderPath = path;
            alert("Folder Selected: " + path);
        }
    }

    // FUSED: Enhanced finish function for Supabase Sync
    async function finish() {
        const gameName = fileInput.files[0] ? fileInput.files[0].name : "Unknown Game";
        const finalSize = (currentGameSize * (1 - selectedReduction/100)).toFixed(2);

        window.api.sendCompress({ 
            folderPath: window.selectedFolderPath, 
            level: selectedReduction 
        });

        const user = localStorage.getItem('hp_user');
        if (user) {
            const { error } = await supabaseClient
                .from('user_vault')
                .insert([{ 
                    game_name: gameName, 
                    original_size: currentGameSize, 
                    compressed_size: finalSize,
                    level: selectedReduction + "%"
                }]);
            if (!error) alert("Saved to your Steam Vault!");
        }
    }

    // Bridge Result Listeners
    window.api.onCompressResult((response) => {
        if (response.status === 'success') {
            alert("Success! Game compressed.");
        } else {
            alert("Compression Failed: " + response.message);
        }
    });

    // Check persistence on load
    const savedUser = localStorage.getItem('hp_user');
    if(savedUser) loginUser(savedUser);

}); // End DOMContentLoaded
