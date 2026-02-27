// --- Supabase Config (Insert your keys here) ---
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    // --- Auth DOM Elements ---
    const authEmail = document.getElementById('authEmail');
    const authPass = document.getElementById('authPass');
    const rememberMe = document.getElementById('rememberMe');
    const loggedOutUI = document.getElementById('loggedOutUI');
    const loggedInUI = document.getElementById('loggedInUI');
    const userDisplay = document.getElementById('userDisplay');

    // --- Remember Me Logic ---
    const savedEmail = localStorage.getItem('hp_remember_email');
    if (savedEmail) {
        authEmail.value = savedEmail;
        rememberMe.checked = true;
    }

    // --- Check Active Session ---
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        updateAuthUI(session.user);
    }

    function updateAuthUI(user) {
        if (user) {
            loggedOutUI.classList.add('hidden');
            loggedInUI.classList.remove('hidden');
            userDisplay.innerText = user.email;
        }
    }

    // --- Auth Actions ---
    document.getElementById('signUpBtn').onclick = async () => {
        const { error } = await supabaseClient.auth.signUp({ 
            email: authEmail.value, 
            password: authPass.value 
        });
        if (error) alert(error.message);
        else alert("Verification email sent! Check your inbox.");
    };

    document.getElementById('signInBtn').onclick = async () => {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ 
            email: authEmail.value, 
            password: authPass.value 
        });
        if (error) return alert(error.message);

        if (rememberMe.checked) localStorage.setItem('hp_remember_email', authEmail.value);
        else localStorage.removeItem('hp_remember_email');
        
        location.reload();
    };

    document.getElementById('signOutBtn').onclick = async () => {
        await supabaseClient.auth.signOut();
        location.reload();
    };

    // --- Compression Engine ---
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const igniteBtn = document.getElementById('igniteBtn');
    const potato = document.getElementById('potato');
    const energyRing = document.getElementById('energyRing');
    let currentFile = null;

    ['dragover', 'drop'].forEach(e => window.addEventListener(e, ev => ev.preventDefault()));

    dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files.length) {
            currentFile = e.dataTransfer.files[0];
            document.getElementById('fileLabel').innerHTML = `<strong>TARGET:</strong> ${currentFile.name}`;
        }
    });

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.onchange = (e) => { if(e.target.files[0]) { 
        currentFile = e.target.files[0];
        document.getElementById('fileLabel').innerHTML = `<strong>TARGET:</strong> ${currentFile.name}`;
    }};

    // Benchmark Logic
    document.getElementById('runBenchmark').onclick = () => {
        const start = performance.now();
        for(let i=0; i<5000000; i++) Math.sqrt(i);
        const time = performance.now() - start;
        const ram = parseInt(document.getElementById('ramInput').value) || 0;
        
        const log = document.getElementById('hwLog');
        const p = document.createElement('p');
        p.innerText = `> CPU Latency: ${time.toFixed(2)}ms | RAM: ${ram}GB`;
        log.prepend(p);
        
        document.getElementById('suggestedLevel').innerText = (ram < 6) ? "SUGGESTION: POTATO" : "SUGGESTION: STANDARD";
    };

    // Ignite Compression
    igniteBtn.onclick = () => {
        if (!currentFile) return alert("Please select a game first!");
        
        document.getElementById('progressArea').classList.remove('hidden');
        igniteBtn.disabled = true;

        const ratio = parseFloat(document.getElementById('compLevel').value);
        const fileSizeMB = currentFile.size / 1e6;
        let timeLeft = Math.ceil(3 + (fileSizeMB / 100) + (ratio * 10));
        const total = timeLeft;

        const interval = setInterval(() => {
            timeLeft--;
            const progress = ((total - timeLeft) / total) * 100;
            document.getElementById('progressFill').style.width = progress + "%";
            document.getElementById('timeLeft').innerText = `Est: ${timeLeft}s`;

            if (progress > 80) {
                potato.classList.add('overdrive');
                energyRing.style.borderColor = "#ff0000";
            }

            if (timeLeft <= 0) {
                clearInterval(interval);
                showSuccess(ratio);
            }
        }, 1000);
    };

    function showSuccess(ratio) {
        const oldSize = currentFile.size / 1e6;
        document.getElementById('oldSize').innerText = oldSize.toFixed(2) + " MB";
        document.getElementById('newSize').innerText = (oldSize * (1 - ratio)).toFixed(2) + " MB";
        document.getElementById('percentSaved').innerText = (ratio * 100).toFixed(0) + "%";
        document.getElementById('successModal').classList.remove('hidden');

        // Auto Download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(currentFile);
        a.download = `potatofied_${currentFile.name}`;
        a.click();
    }

    document.getElementById('closeModal').onclick = () => location.reload();
});
