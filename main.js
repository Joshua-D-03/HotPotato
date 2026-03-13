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
const { ipcMain, dialog } = require('electron');

ipcMain.handle('dialog:openFolder', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return result.filePaths[0];
});
