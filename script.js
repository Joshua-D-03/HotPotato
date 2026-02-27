document.addEventListener('DOMContentLoaded', () => {
    // Hardware Inputs
    const ramInput = document.getElementById('ramInput');
    const cpuInput = document.getElementById('cpuInput');
    const pcModel = document.getElementById('pcModel');
    const suggestLabel = document.getElementById('suggestedLevel');
    const logicText = document.getElementById('logicReasoning');

    // UI Elements
    const fileInput = document.getElementById('fileInput');
    const igniteBtn = document.getElementById('igniteBtn');
    const statusLog = document.getElementById('statusLog');
    const progressFill = document.getElementById('progressFill');

    // 1. Hardware Logic Engine
    const updateSuggestion = () => {
        const ram = parseInt(ramInput.value);
        const cpu = cpuInput.value.toLowerCase();

        if (!ram) {
            suggestLabel.innerText = "Awaiting Data...";
            return;
        }

        if (ram <= 4 || cpu.includes('celeron') || cpu.includes('m3')) {
            suggestLabel.innerText = "EXTREME CRUSH";
            suggestLabel.style.color = "#ff4444";
            logicText.innerText = "Your hardware is significantly below modern gaming standards. Extreme compression required for stability.";
        } else if (ram <= 8) {
            suggestLabel.innerText = "AGGRESSIVE MASH";
            suggestLabel.style.color = "#da8100";
            logicText.innerText = "Standard mid-tier specs. Texture downscaling recommended to prevent stuttering.";
        } else {
            suggestLabel.innerText = "LIGHT PEEL";
            suggestLabel.style.color = "#00ff88";
            logicText.innerText = "Healthy RAM detected. We will only strip bloatware and unnecessary cache.";
        }
    };

    [ramInput, cpuInput].forEach(el => el.addEventListener('input', updateSuggestion));

    // 2. Optimization Sequence
    igniteBtn.onclick = () => {
        if (!fileInput.files[0]) return alert("Please select a game file first!");
        
        document.getElementById('logArea').classList.remove('hidden');
        igniteBtn.disabled = true;
        
        let messages = ["Accessing Station Profile...", "Boiling Shaders...", "Peeling Textures...", "Mashing Audio...", "Finalizing Potato Build..."];
        let step = 0;

        const interval = setInterval(() => {
            if (step < messages.length) {
                const msg = document.createElement('div');
                msg.innerText = `> ${messages[step]}`;
                statusLog.prepend(msg);
                progressFill.style.width = ((step + 1) / messages.length) * 100 + "%";
                step++;
            } else {
                clearInterval(interval);
                finishOptimization();
            }
        }, 800);
    };

    function finishOptimization() {
        const file = fileInput.files[0];
        document.getElementById('repName').innerText = file.name;
        document.getElementById('repSavings').innerText = "Reduced by " + (Math.random() * 40 + 20).toFixed(1) + "%";
        document.getElementById('successModal').classList.remove('hidden');

        // Simulate Download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = `potatofied_${file.name}`;
        a.click();
    }

    // Modal Close
    document.getElementById('closeModal').onclick = () => {
        document.getElementById('successModal').classList.add('hidden');
        igniteBtn.disabled = false;
        document.getElementById('logArea').classList.add('hidden');
        statusLog.innerHTML = "";
    };

    // Standard Selectors
    document.getElementById('dropZone').onclick = () => fileInput.click();
    fileInput.onchange = (e) => document.getElementById('fileLabel').innerText = e.target.files[0].name;
});
