const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc2V2aHRhYXFlcnJ1bWRqcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgwOTQsImV4cCI6MjA4Nzc4NDA5NH0.0OLKUChzRf9Hm0GxvH8cJ9USTiUmOdDkEAiIKlYqB7s";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const potato = document.getElementById('potato');
    const navItems = document.querySelectorAll('.nav-item');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    let userSession = null;

    // --- 1. USER AUTH & INTERACTION LOCKING ---
    const checkUserStatus = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        userSession = session;
        
        const gates = document.querySelectorAll('.auth-gate');
        const forumInput = document.getElementById('forumInputArea');

        if (session) {
            document.getElementById('loggedOutNav').classList.add('hidden');
            document.getElementById('loggedInNav').classList.remove('hidden');
            
            // Get Username from metadata
            const name = session.user.user_metadata.username || session.user.email.split('@')[0];
            document.getElementById('userDisplay').innerText = name.toUpperCase();
            
            // Unlock Content
            gates.forEach(g => g.classList.add('hidden'));
            forumInput.classList.remove('disabled-content');
        } else {
            document.getElementById('loggedOutNav').classList.remove('hidden');
            document.getElementById('loggedInNav').classList.add('hidden');
            
            // Keep Content Locked
            gates.forEach(g => g.classList.remove('hidden'));
            forumInput.classList.add('disabled-content');
        }
    };
    await checkUserStatus();

    // --- 2. THE CORE: DRAG, DROP & BROWSE ---
    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if (e.target.files[0]) {
            document.getElementById('fileLabel').innerHTML = `<strong>CHAMBER LOADED:</strong><br>${e.target.files[0].name}`;
            dropZone.style.borderColor = "var(--cyan)";
            dropZone.style.background = "rgba(0, 242, 255, 0.05)";
        }
    };

    // --- 3. DYNAMIC NAVIGATION ---
    toggleBtn.onclick = () => {
        const closed = sidebar.classList.toggle('closed');
        toggleBtn.innerText = closed ? "▶" : "◀";
    };

    navItems.forEach(item => {
        item.onclick = () => {
            const pageId = item.getAttribute('data-page');
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${pageId}Page`).classList.remove('hidden');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // --- 4. IGNITE ANIMATION ---
    document.getElementById('igniteBtn').onclick = () => {
        if (!fileInput.files[0]) return alert("Please load a game into the chamber first!");
        
        potato.classList.add('compressing-potato');
        setTimeout(() => {
            potato.classList.remove('compressing-potato');
            alert("IGNITE SUCCESSFUL: Game optimized. Check History for logs.");
        }, 3000);
    };

    // --- 5. AUTH MODAL & USERNAME LOGIC ---
    window.openAuth = (mode) => {
        document.getElementById('authTitle').innerText = mode === 'signup' ? 'JOIN THE KITCHEN' : 'MEMBER LOGIN';
        document.getElementById('usernameField').classList.toggle('hidden', mode !== 'signup');
        document.getElementById('authModal').classList.remove('hidden');
    };
    window.closeAuth = () => document.getElementById('authModal').classList.add('hidden');

    document.getElementById('authSubmit').onclick = async () => {
        const email = document.getElementById('authEmail').value;
        const pass = document.getElementById('authPass').value;
        const username = document.getElementById('authUsername').value;
        const isSignUp = !document.getElementById('usernameField').classList.contains('hidden');

        if (isSignUp) {
            const { error } = await supabaseClient.auth.signUp({ 
                email, 
                password: pass, 
                options: { data: { username: username } } 
            });
            if (error) alert(error.message);
            else alert("Check your email for the verification link!");
        } else {
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
            if (error) alert(error.message);
            else location.reload();
        }
    };

    document.getElementById('signOutBtn').onclick = async () => { await supabaseClient.auth.signOut(); location.reload(); };
    document.getElementById('guestBtn').onclick = async () => { await supabaseClient.auth.signInAnonymously(); location.reload(); };
});
