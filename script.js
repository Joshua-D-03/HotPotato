document.addEventListener('DOMContentLoaded', () => {
    const gameInput = document.getElementById('gameInput');
    const igniteBtn = document.getElementById('igniteBtn');
    const slider = document.getElementById('strengthSlider');
    const modeLabel = document.getElementById('strengthMode');
    const warn = document.getElementById('readabilityWarn');
    
    let uploadedFile = null;

    // 1. Handle File Selection
    gameInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadedFile = e.target.files[0];
            document.getElementById('fileNameDisplay').innerText = `Selected: ${uploadedFile.name}`;
        }
    });

    // 2. Strength Slider Logic
    slider.addEventListener('input', (e) => {
        const val = e.target.value;
        modeLabel.innerText = val < 35 ? "Performance" : val > 65 ? "Quality" : "Balanced";
        val < 25 ? warn.classList.remove('hidden') : warn.classList.add('hidden');
    });

    // 3. Simulated Compression & Download
    igniteBtn.addEventListener('click', () => {
        if (!uploadedFile) {
            alert("Please select a game file first.");
            return;
        }

        igniteBtn.disabled = true;
        document.getElementById('progressArea').classList.remove('hidden');
        document.getElementById('downloadArea').classList.add('hidden');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) progress = 100;
            
            document.getElementById('barFill').style.width = progress + "%";
            
            if (progress < 40) document.getElementById('statusText').innerText = "Scrubbing textures...";
            else if (progress < 80) document.getElementById('statusText').innerText = "Downscaling audio...";
            else document.getElementById('statusText').innerText = "Finalizing build...";

            if (progress === 100) {
                clearInterval(interval);
                showDownloadLink();
            }
        }, 500);
    });

    function showDownloadLink() {
        document.getElementById('progressArea').classList.add('hidden');
        document.getElementById('downloadArea').classList.remove('hidden');
        igniteBtn.disabled = false;

        // Display fake optimization stats
        const savings = Math.floor(Math.random() * 40) + 20; // 20-60%
        const originalSizeMB = uploadedFile.size / (1024 * 1024);
        const optimizedSizeMB = originalSizeMB * (1 - savings/100);

        document.getElementById('savingsVal').innerText = `${savings}%`;
        document.getElementById('newSizeVal').innerText = `${optimizedSizeMB.toFixed(2)} MB`;

        // The Download Mechanism
        document.getElementById('downloadBtn').onclick = () => {
            const url = URL.createObjectURL(uploadedFile);
            const a = document.createElement('a');
            a.href = url;
            a.download = `optimized_${uploadedFile.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert("Your optimized game file has been returned to you!");
        };
    }
});
