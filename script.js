const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc2V2aHRhYXFlcnJ1bWRqcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDgwOTQsImV4cCI6MjA4Nzc4NDA5NH0.0OLKUChzRf9Hm0GxvH8cJ9USTiUmOdDkEAiIKlYqB7s";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const potato = document.getElementById('potato');
    const navItems = document.querySelectorAll('.nav-item');
    let userSession = null;

    // --- Auth State ---
    const updateAuth = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        userSession = session;
        const gates = document.querySelectorAll('.auth-gate');
        const forumWrap = document.getElementById('forumInputArea');

        if (session) {
            document.getElementById('loggedOutNav').classList.add('hidden');
            document.getElementById('loggedInNav').classList.remove('hidden');
            document.getElementById('userDisplay').innerText = (session.user.email || "GUEST").toUpperCase();
            gates.forEach(g => g.classList.add('hidden'));
            forumWrap.classList.remove('restricted');
            document.getElementById('forumMessage').disabled = false;
            document.getElementById('sendBtn').disabled = false;
        } else {
            document.getElementById('loggedOutNav').classList.remove('hidden');
            document.getElementById('loggedInNav').classList.add('hidden');
            gates.forEach(g => g.classList.remove('hidden'));
            forumWrap.classList.add('restricted');
            document.getElementById('forumMessage').disabled = true;
            document.getElementById('sendBtn').disabled = true;
        }
    };
    await updateAuth();

    // --- Sidebar & Navigation ---
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

    // --- Forum Logic ---
    const sendMsg = () => {
        const inp = document.getElementById('forumMessage');
        const feed = document.getElementById('forumFeed');
        if (!inp.value.trim() || !userSession) return;
        
        const msg = document.createElement('div');
        msg.className = 'post';
        msg.innerHTML = `<strong>${userSession.user.email.split('@')[0]}:</strong> ${inp.value}`;
        feed.appendChild(msg);
        feed.scrollTop = feed.scrollHeight;
        inp.value = "";
    };
    document.getElementById('sendBtn').onclick = sendMsg;

    // --- Ignite Logic ---
    document.getElementById('igniteBtn').onclick = () => {
        potato.classList.add('compressing-potato');
        setTimeout(() => {
            potato.classList.remove('compressing-potato');
            alert("Optimization Ignite Complete!");
        }, 3000);
    };

    // --- Auth Actions ---
    window.openAuth = () => document.getElementById('authModal').classList.remove('hidden');
    window.closeAuth = () => document.getElementById('authModal').classList.add('hidden');
    document.getElementById('signOutBtn').onclick = async () => { await supabaseClient.auth.signOut(); location.reload(); };
    document.getElementById('guestBtn').onclick = async () => { await supabaseClient.auth.signInAnonymously(); location.reload(); };
});
