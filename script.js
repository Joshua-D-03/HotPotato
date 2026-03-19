const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// --- Global Variables ---
let selectedReduction = 0;
let currentGameSize = 50; 
let isLoginMode = false;
window.selectedFolderPath = null;

document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const percentText = document.getElementById('percentText');
    const authModal = document.getElementById('authModal');
    
    // Auth Modal Elements
    const openSignup = document.getElementById('openSignup');
    const openLogin = document.getElementById('openLogin');
    const closeModal = document.getElementById('closeModal');

    // Electron Remote Initialization
    try {
        const { ipcRenderer } = require('electron');
        const remoteMain = require('@electron/remote/main');
        remoteMain.initialize();
    } catch(e) {
        console.log("Running in Web Mode (Electron modules not loaded)");
    }

    // --- SIDEBAR ---
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            const closed = sidebar.classList.toggle('closed');
            toggleBtn.innerText = closed ? "▶" : "◀";
        };
    }

    // --- NAVIGATION ---
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.dataset.page;
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            const targetPage = document.getElementById(`${page}Page`);
            if (targetPage) targetPage.classList.remove('hidden');
            
            if (page === 'community') loadDiscussions();
            if (page === 'library') loadLibrary(); 
            
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // --- LIBRARY SEARCH ---
    const librarySearch = document.getElementById('librarySearch');
    if (librarySearch) {
        librarySearch.oninput = (e) => loadLibrary(e.target.value.toLowerCase());
    }

    // --- COMMUNITY SEARCH ---
    const communitySearch = document.getElementById('communitySearch');
    if (communitySearch) {
        communitySearch.oninput = (e) => loadDiscussions(e.target.value.toLowerCase());
    }

    // --- AUTH MODAL LOGIC ---
    const showAuth = (isLogin) => {
        isLoginMode = isLogin;
        toggleAuthMode();
        authModal.classList.remove('hidden');
    };

    if (openSignup) openSignup.onclick = () => showAuth(false);
    if (openLogin) openLogin.onclick = () => showAuth(true);
    if (closeModal) closeModal.onclick = () => authModal.classList.add('hidden');

    // --- INTENSITY BUTTON LOGIC ---
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setLevel(parseInt(btn.getAttribute('data-value')));
        };
    });

    // --- IGNITE COMPRESSION ---
    const igniteBtn = document.getElementById('btnIgnite');
    if (igniteBtn) {
        igniteBtn.onclick = function() {
            if (!window.selectedFolderPath) {
                alert("Please select a Steam game folder first!");
                return;
            }
            if (selectedReduction === 0) {
                alert("Please select an intensity level!");
                return;
            }

            this.disabled = true;
            this.innerText = "COMPRESSING...";
            potato.classList.add('compressing');
            progressContainer.classList.remove('hidden');

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
                        finish(); 
                    }, 1000);
                }
                progressBar.style.width = progress + "%";
                percentText.innerText = Math.floor(progress) + "%";
            }, 300);
        };
    }

    // --- AUTH UI ---
    const authToggle = document.getElementById('auth-toggle-text');
    if (authToggle) authToggle.onclick = () => { 
        isLoginMode = !isLoginMode; 
        toggleAuthMode(); 
    };

    const authSubmit = document.getElementById('auth-submit-btn');
    if (authSubmit) {
        authSubmit.onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const status = document.getElementById('status-msg');

    if (isLoginMode) {
        // 1. Log in via Supabase Auth
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            status.innerText = error.message;
        } else {
            loginUser(data.user);
        }
    } else {
        // 2. Sign Up Logic
        const username = document.getElementById('username').value;
        if (!username) { status.innerText = "Please enter a username."; return; }

        // Step A: Create the user in Supabase Auth (This triggers the email)
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email,
            password,
            options: { data: { username: username } }
        });

        if (authError) {
            status.innerText = authError.message;
            return;
        }

        // Step B: Manual save to your 'profiles' table (as seen in your screenshot)
        // Note: Supabase Auth saves the password internally, but this adds it to your visible table too.
        const { error: profileError } = await supabaseClient.from('profiles').insert([{
            id: authData.user.id,
            email_address: email,
            password: password, // Saving the password to your custom column
            username: username,
            created_at: new Date()
        }]);

        if (profileError) {
            console.error("Profile Save Error:", profileError);
            status.innerText = "Auth account created, but profile table failed.";
        } else {
            status.innerText = "Account created! Check your email.";
        }
    }
};
    }

    // --- COMMUNITY POSTING ---
    const postBtn = document.getElementById('newPostBtn');
    if (postBtn) postBtn.onclick = () => document.getElementById('postModal').classList.remove('hidden');
    
    const cancelPost = document.getElementById('cancelPost');
    if (cancelPost) cancelPost.onclick = () => document.getElementById('postModal').classList.add('hidden');

    const submitPost = document.getElementById('submitPost');
    if (submitPost) {
        submitPost.onclick = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) return alert("You must be logged in to post!");

            const title = document.getElementById('postTitle').value;
            const body = document.getElementById('postBody').value;

            if (!title.trim() || !body.trim()) return alert("Please enter both a title and content.");

            const { error } = await supabaseClient.from('discussions').insert([{
                author_id: user.id,
                author_name: user.user_metadata.username || user.email.split('@')[0],
                title: title,
                content: body,
                replies_count: 0,
                created_at: new Date()
            }]);

            if (!error) {
                document.getElementById('postTitle').value = "";
                document.getElementById('postBody').value = "";
                document.getElementById('postModal').classList.add('hidden');
                loadDiscussions(); 
            } else {
                alert("Failed to publish: " + error.message);
            }
        };
    }

    const dropZone = document.getElementById('dropZone');
    if (dropZone) dropZone.onclick = selectGameFolder;

    const backBtn = document.getElementById('backToLibrary');
    if (backBtn) backBtn.onclick = () => {
        document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
        document.getElementById('libraryPage').classList.remove('hidden');
        document.getElementById('sidebar').classList.remove('hidden');
    };
});

// --- HELPER FUNCTIONS ---
function toggleAuthMode() {
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleText = document.getElementById('auth-toggle-text');

    if (isLoginMode) {
        modalTitle.innerText = "WELCOME BACK"; 
        submitBtn.innerText = "LOG IN";
        toggleText.innerText = "Need an account? Sign Up";
    } else {
        modalTitle.innerText = "JOIN THE PATCH";
        submitBtn.innerText = "CREATE ACCOUNT";
        toggleText.innerText = "Already have an account? Log In";
    }
}

function stopCompressionEffect() {
    const potatoImg = document.getElementById('potato');
    potatoImg.classList.remove('compressing');
}

function loginUser(user) {
    localStorage.setItem('hp_user_id', user.id);
    document.getElementById('loggedOutNav').classList.add('hidden');
    document.getElementById('loggedInNav').classList.remove('hidden');
    
    const displayName = user.user_metadata.username || user.email.split('@')[0];
    document.getElementById('userDisplay').innerText = displayName.toUpperCase();
    document.getElementById('authModal').classList.add('hidden');
    loadLibrary();
}

function setLevel(percent) {
    selectedReduction = percent;
    const comparisonView = document.getElementById('comparison-view');
    if (comparisonView) comparisonView.classList.remove('hidden');
    
    const newSize = (currentGameSize * (1 - percent/100)).toFixed(2);
    document.getElementById('oldSize').innerText = currentGameSize;
    document.getElementById('newSize').innerText = newSize;
    document.getElementById('newBar').style.width = (100 - percent) + "%";
}

// --- WORKFLOW ---
async function selectGameFolder() {
    if (window.api && window.api.selectFolder) {
        const path = await window.api.selectFolder();
        if (path) {
            window.selectedFolderPath = path;
            document.getElementById('fileLabel').innerHTML = `<strong>Folder Selected:</strong><br>${path}`;
        }
    } else {
        alert("Electron API not found.");
    }
}

async function finish() {
    if (!window.selectedFolderPath) return;
    const gameName = window.selectedFolderPath.split(/[\\/]/).pop();
    const strategy = document.getElementById('compMode').value;
    const finalSize = (currentGameSize * (1 - selectedReduction/100)).toFixed(2);

    if (window.api && window.api.sendCompress) {
        const algoMap = { '15': 'XPRESS4K', '30': 'XPRESS8K', '65': 'XPRESS16K', '85': 'LZX' };
        window.api.sendCompress({ folderPath: window.selectedFolderPath, algorithm: algoMap[selectedReduction], strategy: strategy });
    }

    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
        const { error } = await supabaseClient.from('user_vault').insert([{
            user_id: user.id,
            game_name: gameName,
            original_size: currentGameSize,
            compressed_size: parseFloat(finalSize),
            intensity_level: selectedReduction + "%",
            compression_strategy: strategy,
            created_at: new Date()
        }]);
        
        if (error) console.error("Vault Error:", error);
        loadLibrary();
    }
}

async function loadLibrary(filter = "") {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;
    
    const { data } = await supabaseClient.from('user_vault').select('*').eq('user_id', user.id);
    const container = document.getElementById('libraryGrid');
    
    if (container && data) {
        const filtered = data.filter(g => g.game_name.toLowerCase().includes(filter));
        
        container.innerHTML = filtered.map(game => `
            <div class="game-card" onclick="openGameDetail(${JSON.stringify(game).replace(/"/g, '&quot;')})">
                <div class="game-poster"></div>
                <h4>${game.game_name.toUpperCase()}</h4>
                <p style="font-size: 0.6rem; color: #666;">SAVED: ${(game.original_size - game.compressed_size).toFixed(2)} GB</p>
            </div>
        `).join('');
    }
}

function openGameDetail(game) {
    document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('gameDetailPage').classList.remove('hidden');
    document.getElementById('detailContent').innerHTML = `
        <h1>${game.game_name}</h1>
        <p>Strategy: ${game.compression_strategy ? game.compression_strategy.toUpperCase() : 'N/A'} | Intensity: ${game.intensity_level}</p>
        <h2>Original: ${game.original_size}GB → Potato: ${game.compressed_size}GB</h2>
        <p>Compressed on: ${new Date(game.created_at).toLocaleDateString()}</p>
    `;
}

async function loadDiscussions(filter = "") {
    const { data } = await supabaseClient.from('discussions').select('*').order('created_at', { ascending: false });
    const container = document.getElementById('discussionList');
    if (container && data) {
        const filtered = data.filter(p => p.title.toLowerCase().includes(filter));
        container.innerHTML = filtered.map(post => `
            <div class="forum-row">
                <div class="thread-info">
                    <strong>${post.title}</strong><br>
                    <span style="font-size: 0.8rem; color: #888;">By ${post.author_name || 'Anonymous'}</span>
                </div>
                <div class="thread-replies">${post.replies_count || 0} replies</div>
                <div class="thread-date">${new Date(post.created_at).toLocaleDateString()}</div>
            </div>
        `).join('');
    }
}

function updateComparisonChart(originalSizeGB, compressedSizeGB) {
    const reduction = ((originalSizeGB - compressedSizeGB) / originalSizeGB) * 100;
    const saveDisplay = document.getElementById('savePercent');
    if (saveDisplay) saveDisplay.innerText = `${reduction.toFixed(1)}%`;
}

if (window.api && window.api.onCompressResult) {
    window.api.onCompressResult((response) => {
        alert(response.status === 'success' ? "Compression complete!" : "Error: " + response.message);
    });
}
