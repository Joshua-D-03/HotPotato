const SB_URL = "https://adsevhtaaqerrumdjqdz.supabase.co";
const SB_KEY = "sb_publishable_VpehK1TR2_aEOt-XgwtKhg_dHx8NAmI";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const potato = document.getElementById('potato');
    const sidebar = document.getElementById('sidebar');
    const pcField = document.getElementById('pcType');
    const historyGrid = document.getElementById('historyGrid');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const percentText = document.getElementById('percentText');

    let currentUser = null; // Track logged in status

    // Hardware Assessment
    pcField.value = "RTX 3060 | i7-11700K";

    // Sidebar
    document.getElementById('toggleSidebar').onclick = function() {
        const closed = sidebar.classList.toggle('closed');
        this.innerText = closed ? "▶" : "◀";
    };

    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => {
            const page = item.dataset.page;
            document.querySelectorAll('.content-page').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}Page`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        };
    });

    // Login Simulation Logic
    document.getElementById('openLogin').onclick = () => {
        currentUser = { name: "PotatoUser" }; // Simulate login
        document.getElementById('loggedOutNav').classList.add('hidden');
        document.getElementById('loggedInNav').classList.remove('hidden');
        document.getElementById('userDisplay').innerText = currentUser.name;
    };

    document.getElementById('signOutBtn').onclick = () => {
        currentUser = null;
        document.getElementById('loggedInNav').classList.add('hidden');
        document.getElementById('loggedOutNav').classList.remove('hidden');
    };

    // Vault logic
    let vaultItems = JSON.parse(localStorage.getItem('hp_vault')) || [];
    function renderVault() {
        historyGrid.innerHTML = '';
        for(let i=0; i<12; i++) {
            const div = document.createElement('div');
            div.className = 'blank-square';
            if(vaultItems[i]) {
                div.classList.add('filled');
                div.style.backgroundImage = `url('${vaultItems[i].img}')`;
                div.innerHTML = `<button class="delete-vault" onclick="deleteVaultItem(${i})">×</button>`;
            }
            historyGrid.appendChild(div);
        }
    }
    window.deleteVaultItem = (index) => {
        vaultItems.splice(index, 1);
        localStorage.setItem('hp_vault', JSON.stringify(vaultItems));
        renderVault();
    };
    renderVault();

    // Community Discussions
    let discussions = [
        { id: 1, title: "Best settings for Elden Ring on 8GB RAM?", author: "TarnishedOne", replies: 14, content: "Has anyone tried Extreme compression on the latest patch?" },
        { id: 2, title: "RTX 4090 Efficiency Test", author: "FrameChaser", replies: 3, content: "The tool handles 4K textures surprisingly well." }
    ];

    function renderDiscussions(filter = "") {
        const body = document.getElementById('discussionBody');
        body.innerHTML = '';
        discussions.filter(d => d.title.toLowerCase().includes(filter.toLowerCase())).forEach(d => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="nexus-blue" onclick="openThread(${d.id})">${d.title}</span></td>
                <td>General</td>
                <td>${d.author}</td>
                <td>${d.replies}</td>
            `;
            body.appendChild(tr);
        });
    }

    window.openThread = (id) => {
        const thread = discussions.find(d => d.id === id);
        const modal = document.getElementById('discussionModal');
        document.getElementById('threadContent').innerHTML = `
            <div class="thread-header"><h2>${thread.title}</h2><small>Posted by ${thread.author}</small></div>
            <div class="thread-op">${thread.content}</div>
        `;

        // Check login to show reply box
        if(currentUser) {
            document.getElementById('replySection').classList.remove('hidden');
            document.getElementById('loginToReplyMsg').classList.add('hidden');
        } else {
            document.getElementById('replySection').classList.add('hidden');
            document.getElementById('loginToReplyMsg').classList.remove('hidden');
        }

        modal.classList.remove('hidden');
    };

    document.getElementById('newPostBtn').onclick = () => {
        if(!currentUser) {
            alert("Please Log In to start a new discussion.");
            return;
        }
        const title = prompt("Enter Discussion Title:");
        if(title) {
            discussions.unshift({ id: Date.now(), title, author: currentUser.name, replies: 0, content: "New discussion started." });
            renderDiscussions();
        }
    };

    document.getElementById('closeThread').onclick = () => document.getElementById('discussionModal').classList.add('hidden');
    document.getElementById('discussionSearch').oninput = (e) => renderDiscussions(e.target.value);
    renderDiscussions();

    // Ignition Logic
    document.getElementById('igniteBtn').onclick = () => {
        const file = fileInput.files[0];
        if(!file) return alert("Drop a game file first.");

        const ramValue = parseInt(document.getElementById('storageInput').value) || 16;
        const pcValue = pcField.value.toLowerCase();
        let speedBoost = (ramValue > 16) ? 1.5 : 1;
        if(pcValue.includes("rtx") || pcValue.includes("40")) speedBoost += 0.5;

        progressContainer.classList.remove('hidden');
        potato.classList.replace('blue-aura', 'compressing-red');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += (Math.random() * 10) * speedBoost;
            if(progress >= 100) {
                progress = 100;
                clearInterval(interval);
                finish(file);
            }
            progressBar.style.width = `${progress}%`;
            percentText.innerText = `${Math.floor(progress)}%`;
        }, 200);
    };

    function finish(file) {
        const level = parseFloat(document.getElementById('compLevel').value);
        const oldSize = (file.size / (1024*1024)).toFixed(2);
        const newSize = (oldSize * (1 - level)).toFixed(2);

        potato.classList.replace('compressing-red', 'blue-aura');
        progressContainer.classList.add('hidden');

        if(vaultItems.length < 12) {
            vaultItems.push({ name: file.name, img: `https://picsum.photos/seed/${file.name}/200/300` });
            localStorage.setItem('hp_vault', JSON.stringify(vaultItems));
            renderVault();
        }

        alert(`COMPRESSION COMPLETE\nEfficiency: ${Math.floor(level*100)}%\nOriginal: ${oldSize}MB\nPOTATO: ${newSize}MB`);
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = `HP_OPTIMIZED_${file.name}`;
        link.click();
    }

    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => { if(e.target.files[0]) document.getElementById('fileLabel').innerHTML = `<strong>${e.target.files[0].name}</strong><br>READY FOR POTATO-TECH`; };
    document.getElementById('openSignup').onclick = () => document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('closeModal').onclick = () => document.getElementById('authModal').classList.add('hidden');
});
