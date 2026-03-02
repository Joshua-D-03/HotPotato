// 1. Connection Details
const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc2V2aHRhYXFlcnJ1bWRqcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgwOTQsImV4cCI6MjA4Nzc4NDA5NH0.0OLKUChzRf9Hm0GxvH8cJ9USTiUmOdDkEAiIKlYqB7s";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    // --- UI Controls ---
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const authModal = document.getElementById('authModal');
    const authTitle = document.getElementById('authTitle');
    const authSubmit = document.getElementById('authSubmit');
    const statusMsg = document.getElementById('status-msg');
    let currentAuthMode = 'login';

    // Sidebar Toggling
    closeSidebar.onclick = () => { sidebar.classList.add('closed'); openSidebarBtn.classList.remove('hidden'); };
    openSidebarBtn.onclick = () => { sidebar.classList.remove('closed'); openSidebarBtn.classList.add('hidden'); };

    // --- Auth Management ---
    window.openAuth = (mode) => {
        currentAuthMode = mode;
        authTitle.innerText = mode === 'login' ? 'LOG IN' : 'SIGN UP';
        statusMsg.innerText = "";
        authModal.classList.remove('hidden');
    };
    window.closeAuth = () => authModal.classList.add('hidden');

    // Guest Sign-In
    document.getElementById('guestBtn').onclick = async () => {
        const { data, error } = await supabaseClient.auth.signInAnonymously();
        if (error) console.error("Guest failed:", error.message);
        else location.reload();
    };

    authSubmit.onclick = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        statusMsg.innerText = "Processing...";

        const { error } = (currentAuthMode === 'login') 
            ? await supabaseClient.auth.signInWithPassword({ email, password })
            : await supabaseClient.auth.signUp({ email, password });

        if (error) { statusMsg.innerText = "Error: " + error.message; statusMsg.style.color = "red"; }
        else { location.reload(); }
    };

    // Session Verification
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        document.getElementById('loggedOutNav').classList.add('hidden');
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('userDisplay').innerText = session.user.is_anonymous ? "GUEST MODE" : session.user.email;
    }

    document.getElementById('signOutBtn').onclick = async () => { await supabaseClient.auth.signOut(); location.reload(); };

    // --- Core Engine Logic ---
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const igniteBtn = document.getElementById('igniteBtn');
    const potato = document.getElementById('potato');
    let currentFile = null;

    ['dragover', 'drop'].forEach(e => window.addEventListener(e, ev => ev.preventDefault()));
    dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files.length) {
            currentFile = e.dataTransfer.files[0];
            document.getElementById('fileLabel').innerHTML = `<strong>TARGET:</strong> ${currentFile.name}`;
        }
    });

    document.getElementById('runBenchmark').onclick = () => {
        const start = performance.now();
        for(let i=0; i<5000000; i++) Math.sqrt(i);
        const time = performance.now() - start;
        const ram = parseInt(document.getElementById('ramInput').value) || 0;
        
        const hwLog = document.getElementById('hwLog');
        const p = document.createElement('p');
        p.innerText = `> Latency: ${time.toFixed(2)}ms | RAM: ${ram}GB`;
        hwLog.prepend(p);
        document.getElementById('suggestedLevel').innerText = (ram < 8) ? "SUGGESTION: POTATO" : "SUGGESTION: STANDARD";
    };

    igniteBtn.onclick = () => {
        if (!currentFile) return alert("Select a game!");
        document.getElementById('progressArea').classList.remove('hidden');
        igniteBtn.disabled = true;

        const ratio = parseFloat(document.getElementById('compLevel').value);
        let timeLeft = 5;
        const total = timeLeft;
        const interval = setInterval(() => {
            timeLeft--;
            const progress = ((total - timeLeft) / total) * 100;
            document.getElementById('progressFill').style.width = progress + "%";
            document.getElementById('timeLeft').innerText = `Est: ${timeLeft}s`;
            if (progress > 80) potato.classList.add('overdrive');

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
