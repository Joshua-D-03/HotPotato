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
    // Construct the command to run core.py
    // It passes the Folder Path and the Mode (Intensity) as arguments
    const exePath = path.join(__dirname, 'core.exe');
const pythonCommand = `"${exePath}" "${data.folderPath}" "${data.mode}"`;
    
    console.log("Executing:", pythonCommand);

    exec(pythonCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution Error: ${error.message}`);
            // Send the error back to the website UI
            event.reply('compression-result', { 
                status: 'error', 
                message: error.message 
            });
        } else {
            console.log(`Python Output: ${stdout}`);
            // Send the success message back to the website UI
            event.reply('compression-result', { 
                status: 'success', 
                message: 'Full Game Compressed!' 
            });
        }
    });
});

// Start the app
app.whenReady().then(createWindow);

// Standard Electron behavior for closing windows
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


