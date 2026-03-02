const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc2V2aHRhYXFlcnJ1bWRqcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgwOTQsImV4cCI6MjA4Nzc4NDA5NH0.0OLKUChzRf9Hm0GxvH8cJ9USTiUmOdDkEAiIKlYqB7s";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = document.getElementById('sidebar');
    const potato = document.getElementById('potato');
    const compLevel = document.getElementById('compLevel');
    const warningBox = document.getElementById('warningBox');
    const recommendedText = document.getElementById('recommendedText');
    let currentFile = null;

    // Sidebar Toggling
    document.getElementById('closeSidebar').onclick = () => { sidebar.classList.add('closed'); document.getElementById('openSidebar').classList.remove('hidden'); };
    document.getElementById('openSidebar').onclick = () => { sidebar.classList.remove('closed'); document.getElementById('openSidebar').classList.add('hidden'); };

    // File Selection
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if (e.target.files[0]) {
            currentFile = e.target.files[0];
            document.getElementById('fileLabel').innerHTML = `<strong>TARGET LOADED:</strong><br>${currentFile.name}`;
            updateRecommendation();
        }
    };

    // Optimization Logic & Warning
    compLevel.onchange = () => {
        warningBox.classList.toggle('hidden', parseFloat(compLevel.value) < 0.75);
        updateRecommendation();
    };

    function updateRecommendation() {
        const pc = document.getElementById('pcType').value;
        const focus = document.getElementById('optFocus').value;
        if (!pc) { recommendedText.innerText = "Enter PC Type Above"; return; }
        recommendedText.innerText = `REC: ${focus.toUpperCase()} for ${pc}`;
    }

    // Compression Ignition
    document.getElementById('igniteBtn').onclick = () => {
        if (!currentFile || !document.getElementById('pcType').value) {
            return alert("Please select a game and enter your Computer Type!");
        }

        document.getElementById('progressArea').classList.remove('hidden');
        potato.classList.add('compressing-potato'); // Electrify & Turn Red
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            document.getElementById('progressFill').style.width = progress + "%";
            if (progress >= 100) {
                clearInterval(interval);
                finalizeCompression();
            }
        }, 30);
    };

    function formatComparison(bytes) {
        const mb = (bytes / (1024 * 1024)).toFixed(2);
        const gb = (bytes / (1024 * 1024 * 1024)).toFixed(2);
        return `${mb} MB (${gb} GB)`;
    }

    function finalizeCompression() {
        const ratio = parseFloat(compLevel.value);
        const newSize = currentFile.size * (1 - ratio);

        document.getElementById('oldSize').innerText = formatComparison(currentFile.size);
        document.getElementById('newSize').innerText = formatComparison(newSize);
        document.getElementById('percentSaved').innerText = (ratio * 100).toFixed(0) + "%";
        
        potato.classList.remove('compressing-potato');
        document.getElementById('successModal').classList.remove('hidden');
    }

    // Auth Actions
    window.openAuth = (mode) => {
        document.getElementById('authTitle').innerText = mode === 'login' ? 'LOG IN' : 'SIGN UP';
        document.getElementById('authModal').classList.remove('hidden');
    };
    window.closeAuth = () => document.getElementById('authModal').classList.add('hidden');

    document.getElementById('guestBtn').onclick = async () => { await supabaseClient.auth.signInAnonymously(); location.reload(); };
    document.getElementById('signOutBtn').onclick = async () => { await supabaseClient.auth.signOut(); location.reload(); };

    // Session UI Sync
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        document.getElementById('loggedOutNav').classList.add('hidden');
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('userDisplay').innerText = session.user.is_anonymous ? "GUEST" : session.user.email;
    }

    document.getElementById('closeModal').onclick = () => location.reload();
});
