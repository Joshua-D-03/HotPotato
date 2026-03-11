// Restored hardcoded keys to prevent script crashes in standard browsers
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

    let isLoginMode = false;

    // Sidebar Toggle Logic
    document.getElementById('toggleSidebar').onclick = function() {
        const closed = sidebar.classList.toggle('closed');
        this.innerText = closed ? "▶" : "◀";
    };

    // Navigation Logic
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.dataset.page;
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // STEAM-ONLY VALIDATION
    function isSteamGame(file) {
        const name = file.name.toLowerCase();
        return name.endsWith('.exe') || name.endsWith('.app') || name.includes('steam');
    }

// Find your igniteBtn logic or add it here:
const igniteBtn = document.getElementById('igniteBtn');
if (igniteBtn) {
    igniteBtn.onclick = async () => {
        const selectedMode = document.getElementById('compLevel').value;
        const fileLabel = document.getElementById('fileLabel').innerText;

        // Save to Supabase
        await saveToVault(fileLabel, selectedMode);

        // Visual Progress Trigger
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        const percentText = document.getElementById('percentText');

        progressContainer.classList.remove('hidden');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                alert("Task logged to Vault. Run your local .bat file to begin compression.");
            }
            progressBar.style.width = progress + "%";
            percentText.innerText = Math.floor(progress) + "%";
        }, 300);
    };
}

    // 3. Start the Visual Progress
    document.getElementById('progressContainer').classList.remove('hidden');
    // ... rest of your progress bar animation ...}

    // 2. Validate file extension (Only allow game archives or containers)
    // You can adjust these extensions based on what you want to support
    const validExtensions = ['.zip', '.rar', '.7z', '.exe']; 
    const fileName = file.name.toLowerCase();
    
    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
        alert("Error: That does not appear to be a valid game file. Please upload a game archive or executable.");
        return;
    }

    // 3. If validation passes, proceed with the ignition
    console.log("File validated. Starting sequence...");
    // Trigger your compression animation here
};

    // 1. Rotation logic: Clear old classes and add new based on level
    potato.classList.remove('rotate-25', 'rotate-50', 'rotate-100', 'rotate-200');
    if (compLevel === "0.15") potato.classList.add('rotate-25');
    else if (compLevel === "0.30") potato.classList.add('rotate-50');
    else if (compLevel === "0.65") potato.classList.add('rotate-100');
    else if (compLevel === "0.85") potato.classList.add('rotate-200');

    // 2. Start Compression
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
        potato.classList.replace('compressing-red', 'blue-aura');
        progressContainer.classList.add('hidden');
        alert(`STEAM COMPRESSION SUCCESS! Game saved to Vault.`);
    }

    // LOGIN PERSISTENCE [Request: log back in after making account]
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
            const stored = JSON.parse(localStorage.getItem('hp_account'));
            if(stored && stored.email === email && stored.pass === pass) {
                loginUser(stored.username);
            } else { alert("Invalid Credentials"); }
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
    
    // Reveal the "Start Discussion" button only when logged in
    const newPostBtn = document.getElementById('newPostBtn');
    if(newPostBtn) newPostBtn.classList.remove('hidden');
    
    authModal.classList.add('hidden');
}

    // Check persistence on load
    const savedUser = localStorage.getItem('hp_user');
    if(savedUser) loginUser(savedUser);

    document.getElementById('openSignup').onclick = () => { isLoginMode = false; toggleAuthMode(); authModal.classList.remove('hidden'); };
    document.getElementById('openLogin').onclick = () => { isLoginMode = true; toggleAuthMode(); authModal.classList.remove('hidden'); };
    document.getElementById('closeModal').onclick = () => authModal.classList.add('hidden');
    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => { if(e.target.files[0]) document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>STEAM FILE DETECTED`; };
});
window.onload = () => {
    if(localStorage.getItem('hp_user')) {
        loginUser(localStorage.getItem('hp_user'));
    }
};
async function saveToVault(gameName, level) {
    const user = localStorage.getItem('hp_user');
    if (!user) return alert("Please log in to save to your Vault.");

    const { data, error } = await supabaseClient
        .from('user_vault') // Ensure you have this table in Supabase
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

// Example Trigger: You can call this after the user "Ignites"
// updateComparisonChart(60, 24); // Representing a 60GB game becoming 24GB
