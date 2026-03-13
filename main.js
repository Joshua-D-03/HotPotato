const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Point to your bridge
            contextIsolation: true, // Keep this true for security
            nodeIntegration: false      
        }
    });
    win.loadFile('index.html');
}

// Handle folder selection dialog
ipcMain.handle('dialog:openFolder', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return result.filePaths[0];
});

// Handle compression process execution
ipcMain.on('compress-game', (event, data) => {
    // Run your Python script from Node
    // Note: Ensure core.py is in the same directory as main.js
    exec(`python core.py "${data.folderPath}" ${data.mode}`, (err, stdout, stderr) => {
        if (err) {
            event.reply('compression-result', { status: 'error', message: err.message });
        } else {
            event.reply('compression-result', { status: 'success', message: 'Compression complete!' });
        }
    });
});

app.whenReady().then(createWindow);
}
