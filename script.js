const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc2V2aHRhYXFlcnJ1bWRqcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgwOTQsImV4cCI6MjA4Nzc4NDA5NH0.0OLKUChzRf9Hm0GxvH8cJ9USTiUmOdDkEAiIKlYqB7s";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const navItems = document.querySelectorAll('.nav-item');

    // --- AUTH UI UPDATES ---
    const updateUI = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const loggedOut = document.getElementById('loggedOutNav');
        const loggedIn = document.getElementById('loggedInNav');
        const gates = document.querySelectorAll('.auth-gate');
        const forumInput = document.getElementById('forumInputArea');

        if (session) {
            loggedOut.classList.add('hidden');
            loggedIn.classList.remove('hidden');
            document.getElementById('userDisplay').innerText = (session.user.user_metadata.username || "USER").toUpperCase();
            gates.forEach(g => g.classList.add('hidden'));
            if(forumInput) forumInput.style.opacity = "1";
        } else {
            loggedOut.classList.remove('hidden');
            loggedIn.classList.add('hidden');
            gates.forEach(g => g.classList.remove('hidden'));
            if(forumInput) forumInput.style.opacity = "0.5";
        }
    };
    await updateUI();

    // --- SIDEBAR TOGGLE ---
    toggleBtn.onclick = () => {
        const isClosed = sidebar.classList.toggle('closed');
        toggleBtn.innerText = isClosed ? "▶" : "◀";
    };

    // --- NAVIGATION ---
    navItems.forEach(item => {
        item.onclick = () => {
            const id = item.getAttribute('data-page');
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${id}Page`).classList.remove('hidden');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // --- AUTH FUNCTIONS ---
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
            const { error } = await supabaseClient.auth.signUp({ email, password: pass, options: { data: { username } } });
            if (error) alert(error.message); else alert("Check email for verification!");
        } else {
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
            if (error) alert(error.message); else location.reload();
        }
    };

    document.getElementById('signOutBtn').onclick = async () => { await supabaseClient.auth.signOut(); location.reload(); };
    document.getElementById('guestBtn').onclick = async () => { await supabaseClient.auth.signInAnonymously(); location.reload(); };

    // --- COMPRESSOR ANIMATION ---
    document.getElementById('igniteBtn').onclick = () => {
        const potato = document.getElementById('potato');
        potato.style.filter = "drop-shadow(0 0 50px #ff0000) sepia(100%)";
        setTimeout(() => {
            potato.style.filter = "drop-shadow(0 0 15px var(--cyan))";
            alert("Compression Successful!");
        }, 2000);
    };
});
