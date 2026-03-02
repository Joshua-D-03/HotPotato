// 1. Connection Details
const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc2V2aHRhYXFlcnJ1bWRqcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgwOTQsImV4cCI6MjA4Nzc4NDA5NH0.0OLKUChzRf9Hm0GxvH8cJ9USTiUmOdDkEAiIKlYqB7s";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const openSidebarBtn = document.getElementById('openSidebar');
    const authModal = document.getElementById('authModal');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const igniteBtn = document.getElementById('igniteBtn');
    let currentFile = null;

    // Sidebar Controls
    closeSidebar.onclick = () => { sidebar.classList.add('closed'); openSidebarBtn.classList.remove('hidden'); };
    openSidebarBtn.onclick = () => { sidebar.classList.remove('closed'); openSidebarBtn.classList.add('hidden'); };

    // --- FILE SELECTION SYSTEM ---
    dropZone.onclick = () => fileInput.click();
    
    fileInput.onchange = (e) => {
        if (e.target.files.length > 0) processFileSelection(e.target.files[0]);
    };

    dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('dragover'); };
    dropZone.ondragleave = () => dropZone.classList.remove('dragover');
    dropZone.ondrop = (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) processFileSelection(e.dataTransfer.files[0]);
    };

    function processFileSelection(file) {
        currentFile = file;
        document.getElementById('fileLabel').innerHTML = `<strong>TARGET LOADED:</strong><br>${file.name}`;
    }

    // --- AUTHENTICATION ---
    window.openAuth = (mode) => {
        document.getElementById('authTitle').innerText = mode === 'login' ? 'LOG IN' : 'SIGN UP';
        authModal.classList.remove('hidden');
    };
    window.closeAuth = () => authModal.classList.add('hidden');

    document.getElementById('guestBtn').onclick = async () => {
        const { error } = await supabaseClient.auth.signInAnonymously();
        if (error) console.error("Guest error:", error.message);
        else location.reload();
    };

    document.getElementById('authSubmit').onclick = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const mode = document.getElementById('authTitle').innerText;
        
        const { error } = mode === 'LOG IN' 
            ? await supabaseClient.auth.signInWithPassword({ email, password })
            : await supabaseClient.auth.signUp({ email, password });

        if (error) alert(error.message);
        else location.reload();
    };

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        document.getElementById('loggedOutNav').classList.add('hidden');
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('userDisplay').innerText = session.user.is_anonymous ? "GUEST" : session.user.email;
    }

    document.getElementById('signOutBtn').onclick = async () => { await supabaseClient.auth.signOut(); location.reload(); };

    // --- COMPRESSION ENGINE ---
    igniteBtn.onclick = () => {
        if (!currentFile) return alert("Select a file first!");
        document.getElementById('progressArea').classList.remove('hidden');
        igniteBtn.disabled = true;

        const ratio = parseFloat(document.getElementById('compLevel').value);
        let timeLeft = 5;
        const total = timeLeft;

        const interval = setInterval(() => {
            timeLeft--;
            const progress = ((total - timeLeft) / total) * 100;
            document.getElementById('progressFill').style.width = progress + "%";
            if (progress > 80) document.getElementById('potato').classList.add('overdrive');

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
