// Restored hardcoded keys to prevent script crashes in standard browsers
const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const pcField = document.getElementById('pcType');
    const historyGrid = document.getElementById('historyGrid');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const percentText = document.getElementById('percentText');
    const authModal = document.getElementById('authModal');
    const { ipcRenderer } = require('electron');
    const remoteMain = require('@electron/remote/main');
        remoteMain.initialize();
    
    let isLoginMode = false;

    // --- INTEGRATED FIXES START ---

    // Sidebar Logic (Adjusted)
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            const closed = sidebar.classList.toggle('closed');
            toggleBtn.innerText = closed ? "▶" : "◀";
        };
    }

    // Modal Closing Logic (Fixes the "Stuck" screen)
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.onclick = () => {
            authModal.classList.add('hidden');
        };
    }

    // Navigation Fix
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

    // --- INTEGRATED FIXES END ---

    // Ignite Logic (Compression Simulation)
    document.getElementById('igniteBtn').onclick = function() {
        const file = e.target.files[0];
    if (file) {
        const allowedExtensions = ['.mp4', '.avi', '.mkv', '.wmv'];
        const fileName = file.name.toLowerCase();
        const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (isValid) {
            document.getElementById('fileLabel').innerHTML = `<strong>${file.name}</strong><br>VIDEO GAME FILE DETECTED`;
        } else {
            alert("Invalid file type. Please select a video game file (.mp4, .avi, .mkv, .wmv).");
            fileInput.value = ""; // Clear the selection
            document.getElementById('fileLabel').innerHTML = `DROP GAME HERE`;
        }
    };

        this.disabled = true;
        this.innerText = "COMPRESSING...";
        potato.classList.add('ignite-animation');
        progressContainer.classList.remove('hidden');

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
                    potato.classList.remove('ignite-animation');
                    saveToVault(file.name, pcField.value);
                    updateComparisonChart(100, 40); // Simulated 60% saving
                }, 1000);
            }
            progressBar.style.width = progress + "%";
            percentText.innerText = Math.floor(progress) + "%";
        }, 300);
    const igniteBtn = document.getElementById('igniteBtn');
const compressionLevel = document.getElementById('compressionLevel');
const potatoImg = document.getElementById('potato');

igniteBtn.onclick = () => {
    const level = compressionLevel.value;

    // 1. Turn aura red
    potatoImg.classList.add('compressing');

    // 2. Remove any old spin classes first
    potatoImg.classList.remove('spin-standard', 'spin-balance', 'spin-extreme', 'spin-potato');

    // 3. Apply the specific speed class
    potatoImg.classList.add(`spin-${level}`);

   function finish(file) {
    const level = document.getElementById('compLevel').value;
    const mode = "Quality"; 

    // Tell the Backend to start compressing
    // Ensure window.selectedFolderPath is set by your folder-picker logic
    ipcRenderer.send('compress-game', { 
        folderPath: window.selectedFolderPath, 
        mode: mode, 
        level: level 
    });
}
    
    // For demo purposes, we stop it after 5 seconds
    setTimeout(() => {
        stopCompressionEffect();
    }, 5000);
};

function stopCompressionEffect() {
    potatoImg.classList.remove('compressing', 'spin-standard', 'spin-balance', 'spin-extreme', 'spin-potato');
}
    };

    // Auth Mode Toggling
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

    // Form Submission
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

    // Check persistence on load
    const savedUser = localStorage.getItem('hp_user');
    if(savedUser) loginUser(savedUser);

    document.getElementById('openSignup').onclick = () => { isLoginMode = false; toggleAuthMode(); authModal.classList.remove('hidden'); };
    document.getElementById('openLogin').onclick = () => { isLoginMode = true; toggleAuthMode(); authModal.classList.remove('hidden'); };
    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => { if(e.target.files[0]) document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>STEAM FILE DETECTED`; };

window.onload = () => {
    if(localStorage.getItem('hp_user')) {
        loginUser(localStorage.getItem('hp_user'));
    }
};

async function saveToVault(gameName, level) {
    const user = localStorage.getItem('hp_user');
    if (!user) return; // Silent return as per requested logic

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
    const barBefore = document.getElementById('barBefore');
    const barAfter = document.getElementById('barAfter');
    const savePercent = document.getElementById('savePercent');
    const gbSaved = document.getElementById('gbSaved');

    // Calculate percentage
    const reduction = ((originalSizeGB - compressedSizeGB) / originalSizeGB) * 100;
    const heightPercent = (compressedSizeGB / originalSizeGB) * 100;

    // Update Visuals
    barAfter.style.height = `${heightPercent}%`;
    savePercent.innerText = `${reduction.toFixed(1)}%`;
    gbSaved.innerText = `${(originalSizeGB - compressedSizeGB).toFixed(2)} GB`;
}
ipcRenderer.on('compression-result', (event, response) => {
    if (response.status === 'success') {
        alert("Real compression applied successfully!");
    } else {
        alert("Error: " + response.message);
    }
});
// This function should be triggered by your "Select Folder" button
async function selectGameFolder() {
    const { dialog } = require('@electron/remote');
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    
    if (!result.canceled) {
        window.selectedFolderPath = result.filePaths[0];
        console.log("Folder selected:", window.selectedFolderPath);
    }
}
    });
