document.addEventListener('DOMContentLoaded', () => {
    let isLoggedIn = false;

    const potato = document.getElementById('potato');
    const statusText = document.getElementById('statusText');
    const historyGrid = document.getElementById('historyGrid');
    const fileInput = document.getElementById('fileInput');
    const storageInput = document.getElementById('storageInput');
    const benchBar = document.getElementById('benchmarkBar');
    const benchBarContainer = document.getElementById('benchmarkBarContainer');

    // Transparent Input behavior
    storageInput.addEventListener('focus', function() {
        if(this.value === "500") this.value = "";
    });
    storageInput.addEventListener('blur', function() {
        if(this.value === "") this.value = "500";
    });

    // Navigation and Permissions
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.getAttribute('data-page');
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Check visibility for community posting
            updateCommunityAccess();
        };
    });

    function updateCommunityAccess() {
        if (isLoggedIn) {
            document.getElementById('postContainer').classList.remove('hidden');
            document.getElementById('loginReminder').classList.add('hidden');
        } else {
            document.getElementById('postContainer').classList.add('hidden');
            document.getElementById('loginReminder').classList.remove('hidden');
        }
    }

    // Auth Simulation (Login/Sign Up)
    window.openAuth = (mode) => {
        isLoggedIn = true;
        document.getElementById('loggedOutNav').classList.add('hidden');
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('userDisplay').innerText = "USER_771";
        updateCommunityAccess();
        alert(`Successfully ${mode === 'login' ? 'logged in' : 'signed up'}!`);
    };

    document.getElementById('signOutBtn').onclick = () => location.reload();

    // Ignite Logic
    document.getElementById('igniteBtn').onclick = () => {
        if (!fileInput.files[0]) return alert("Select a game file first.");
        
        potato.classList.add('compressing-active');
        statusText.innerText = "COMPRESSING...";
        benchBarContainer.classList.remove('hidden');

        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            benchBar.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                finalize();
            }
        }, 50);
    };

    function finalize() {
        setTimeout(() => {
            potato.classList.remove('compressing-active');
            benchBarContainer.classList.add('hidden');
            statusText.innerText = "";

            const entry = document.createElement('div');
            entry.className = 'dashed-square';
            const seed = Math.floor(Math.random() * 5000);
            entry.innerHTML = `<div style="width:100%; height:100%; background:url('https://picsum.photos/seed/${seed}/400/400'); background-size:cover;"></div>`;
            historyGrid.prepend(entry);
            benchBar.style.width = "0%";
        }, 500);
    }

    // Community Posting Logic
    document.getElementById('postBtn').onclick = () => {
        const title = document.getElementById('newThreadTitle').value;
        if (!title) return;
        
        const newThread = document.createElement('div');
        newThread.className = 'thread-row';
        newThread.innerHTML = `<span class="thread-title">${title}</span><span class="thread-date">JUST NOW</span>`;
        document.getElementById('forumFeed').prepend(newThread);
        document.getElementById('newThreadTitle').value = "";
    };

    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        if(e.target.files[0]) document.getElementById('fileLabel').innerText = e.target.files[0].name;
    };
});
