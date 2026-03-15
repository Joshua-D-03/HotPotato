const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Bridge for secure communication
            contextIsolation: true,
            nodeIntegration: false      
        }
    });
    win.loadFile('index.html');
}

// 1. Handle the Folder Selection Dialog
ipcMain.handle('dialog:openFolder', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return result.filePaths[0]; // Returns the path to script.js
});

// 2. Handle the Compression Command
ipcMain.on('compress-game', (event, data) => {
    // We point directly to the exe we just created
    const exePath = path.join(__dirname, 'core.exe');
    
    // We run the exe directly instead of calling 'python'
    const runCommand = `"${exePath}" "${data.folderPath}" "${data.mode}"`;
    
    console.log("Hot Potato Engine Ignited:", runCommand);

    exec(runCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Engine Error: ${error.message}`);
            event.reply('compression-result', { status: 'error', message: error.message });
        } else {
            console.log(`Engine Output: ${stdout}`);
            event.reply('compression-result', { status: 'success', message: 'Optimization Complete!' });
        }
    });
});
});

// Start the app
app.whenReady().then(createWindow);

// Standard Electron behavior for closing windows
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


