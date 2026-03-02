const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc2V2aHRhYXFlcnJ1bWRqcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgwOTQsImV4cCI6MjA4Nzc4NDA5NH0.0OLKUChzRf9Hm0GxvH8cJ9USTiUmOdDkEAiIKlYqB7s";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const potato = document.getElementById('potato');
    const navItems = document.querySelectorAll('.nav-item');
    let userSession = null;

    // --- Auth Management ---
    const updateUI = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        userSession = session;
        const gates = document.querySelectorAll('.auth-gate');
        const forumInput = document.getElementById('forumInputArea');

        if (session) {
            document.getElementById('loggedOutNav').classList.add('hidden');
            document.getElementById('loggedInNav').classList.remove('hidden');
            const name = session.user.user_metadata.username || session.user.email.split('@')[0];
            document.getElementById('userDisplay').innerText = name.toUpperCase();
            
            // Unlock page interactions
            gates.forEach(g => g.classList.add('hidden'));
            forumInput.classList.remove('disabled-content');
        } else {
            document.getElementById('loggedOutNav').classList.remove('hidden');
            document.getElementById('loggedInNav').classList.add('hidden');
            
            // Lock page interactions
            gates.forEach(g => g.classList.remove('hidden'));
            forumInput.classList.add('disabled-content');
        }
    };
    await updateUI();

    // --- Community Discussion Search ---
    document.getElementById('forumSearch').oninput = (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.thread-row').forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(term) ? 'flex' : 'none';
        });
    };

    // --- File Drag & Drop Engine ---
    const dz = document.getElementById('dropZone');
    const fInp = document.getElementById('fileInput');
    
    dz.onclick = () => fInp.click();
    fInp.onchange = (e) => {
        if (e.target.files[0]) {
            document.getElementById('fileLabel').innerHTML = `<strong>CHAMBER READY:</strong><br>${e.target.files[0].name}`;
            dz.style.borderColor = "var(--cyan)";
        }
    };

    document.getElementById('igniteBtn').onclick = () => {
        if (!fInp.files[0]) return alert("Please drop a game folder into the chamber!");
        potato.classList.add('compressing-potato');
        setTimeout(() => {
            potato.classList.remove('compressing-potato');
            alert("IGNITION SUCCESSFUL: Optimization complete.");
        }, 3000);
    };

    // --- Sidebar Navigation (Always Visible) ---
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

    // --- Auth Actions ---
    window.openAuth = (m) => {
        document.getElementById('authTitle').innerText = m === 'signup' ? 'SIGN UP' : 'LOG IN';
        document.getElementById('usernameField').classList.toggle('hidden', m !== 'signup');
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
                options: { data: { username } } 
            });
            if (error) alert(error.message); else alert("Check your email for verification!");
        } else {
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
            if (error) alert(error.message); else location.reload();
        }
    };

    document.getElementById('signOutBtn').onclick = async () => { await supabaseClient.auth.signOut(); location.reload(); };
    document.getElementById('guestBtn').onclick = async () => { await supabaseClient.auth.signInAnonymously(); location.reload(); };
});
