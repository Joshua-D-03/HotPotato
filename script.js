// 1. Connection Details
const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc2V2aHRhYXFlcnJ1bWRqcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgwOTQsImV4cCI6MjA4Nzc4NDA5NH0.0OLKUChzRf9Hm0GxvH8cJ9USTiUmOdDkEAiIKlYqB7s";

// 2. Initialize the Supabase Client
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    // --- Auth DOM Elements ---
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const btnSignup = document.getElementById('btn-signup');
    const btnLogin = document.getElementById('btn-login');
    const statusMsg = document.getElementById('status-msg');
    const rememberMe = document.getElementById('rememberMe');
    const loggedOutUI = document.getElementById('loggedOutUI');
    const loggedInUI = document.getElementById('loggedInUI');
    const userDisplay = document.getElementById('userDisplay');

    // Remember Email Logic
    const savedEmail = localStorage.getItem('hp_user_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }

    // Check Session
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        loggedOutUI.classList.add('hidden');
        loggedInUI.classList.remove('hidden');
        userDisplay.innerText = session.user.email;
    }

    // --- Sign-Up Logic ---
    btnSignup.addEventListener('click', async () => {
        statusMsg.innerText = "Processing...";
        const { data, error } = await supabaseClient.auth.signUp({
            email: emailInput.value,
            password: passInput.value,
        });

        if (error) {
            statusMsg.innerText = "Error: " + error.message;
            statusMsg.style.color = "red";
        } else {
            statusMsg.innerText = "Success! User created.";
            statusMsg.style.color = "green";
        }
    });

    // --- Login Logic ---
    btnLogin.addEventListener('click', async () => {
        statusMsg.innerText = "Logging in...";
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: emailInput.value,
            password: passInput.value,
        });

        if (error) {
            statusMsg.innerText = "Error: " + error.message;
            statusMsg.style.color = "red";
        } else {
            if (rememberMe.checked) localStorage.setItem('hp_user_email', emailInput.value);
            else localStorage.removeItem('hp_user_email');
            location.reload();
        }
    });

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

    // Hardware Test
    document.getElementById('runBenchmark').onclick = () => {
        const start = performance.now();
        for(let i=0; i<5000000; i++) Math.sqrt(i);
        const time = performance.now() - start;
        const ram = parseInt(document.getElementById('ramInput').value) || 0;
        
        const hwLog = document.getElementById('hwLog');
        const p = document.createElement('p');
        p.innerText = `> Latency: ${time.toFixed(2)}ms | RAM: ${ram}GB`;
        hwLog.prepend(p);
        
        document.getElementById('suggestedLevel').innerText = (ram < 6) ? "SUGGESTION: POTATO" : "SUGGESTION: STANDARD";
    };

    // Ignition
    igniteBtn.onclick = () => {
        if (!currentFile) return alert("Select a game!");
        document.getElementById('progressArea').classList.remove('hidden');
        igniteBtn.disabled = true;

        const ratio = parseFloat(document.getElementById('compLevel').value);
        let timeLeft = Math.ceil(5 + (currentFile.size / 1e8));
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
                document.getElementById('oldSize').innerText = (currentFile.size / 1e6).toFixed(2) + " MB";
                document.getElementById('newSize').innerText = ((currentFile.size / 1e6) * (1 - ratio)).toFixed(2) + " MB";
                document.getElementById('percentSaved').innerText = (ratio * 100).toFixed(0) + "%";
                document.getElementById('successModal').classList.remove('hidden');
            }
        }, 1000);
    };

    document.getElementById('closeModal').onclick = () => location.reload();
});
