const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc2V2aHRhYXFlcnJ1bWRqcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgwOTQsImV4cCI6MjA4Nzc4NDA5NH0.0OLKUChzRf9Hm0GxvH8cJ9USTiUmOdDkEAiIKlYqB7s";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const navItems = document.querySelectorAll('.nav-item');

    // Authentication UI Logic
    const updateUI = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const loggedOut = document.getElementById('loggedOutNav');
        const loggedIn = document.getElementById('loggedInNav');
        if (session) {
            loggedOut.classList.add('hidden');
            loggedIn.classList.remove('hidden');
            document.getElementById('userDisplay').innerText = (session.user.user_metadata.username || "USER").toUpperCase();
        } else {
            loggedOut.classList.remove('hidden');
            loggedIn.classList.add('hidden');
        }
    };
    await updateUI();

    // Sidebar Navigation
    toggleBtn.onclick = () => {
        const isClosed = sidebar.classList.toggle('closed');
        toggleBtn.innerText = isClosed ? "▶" : "◀";
    };

    navItems.forEach(item => {
        item.onclick = () => {
            const id = item.getAttribute('data-page');
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${id}Page`).classList.remove('hidden');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // Auth Actions
    window.openAuth = (type) => {
        document.getElementById('authTitle').innerText = type === 'signup' ? 'SIGN UP' : 'LOG IN';
        document.getElementById('usernameField').classList.toggle('hidden', type !== 'signup');
        document.getElementById('authModal').classList.remove('hidden');
    };
    window.closeAuth = () => document.getElementById('authModal').classList.add('hidden');

    document.getElementById('authSubmit').onclick = async () => {
        const email = document.getElementById('authEmail').value;
        const pass = document.getElementById('authPass').value;
        const username = document.getElementById('authUsername').value;
        const isSignUp = !document.getElementById('usernameField').classList.contains('hidden');
        if (isSignUp) {
            await supabaseClient.auth.signUp({ email, password: pass, options: { data: { username } } });
            alert("Success! Check email for verification.");
        } else {
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
            if (error) alert(error.message); else location.reload();
        }
    };

    document.getElementById('signOutBtn').onclick = async () => { await supabaseClient.auth.signOut(); location.reload(); };
    document.getElementById('guestBtn').onclick = async () => { await supabaseClient.auth.signInAnonymously(); location.reload(); };

    // Compression Feature
    document.getElementById('igniteBtn').onclick = () => {
        const fileInp = document.getElementById('fileInput');
        if (!fileInp.files[0]) return alert("Please load a game into the chamber first.");
        
        const potato = document.getElementById('potato');
        const level = document.getElementById('compLevel').value;
        
        // Visual Compression Effect
        potato.style.filter = "drop-shadow(0 0 60px #ff0000) sepia(100%)";
        setTimeout(() => {
            potato.style.filter = "drop-shadow(0 0 20px var(--cyan))";
            alert(`COMPRESSION COMPLETE: Reduced by ${(level * 100)}%.`);
            // Here you would trigger actual file processing or a mock download
        }, 3000);
    };

    document.getElementById('dropZone').onclick = () => document.getElementById('fileInput').click();
});
