const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendCompress: (data) => ipcRenderer.send('compress-game', data),
    onCompressResult: (callback) => ipcRenderer.on('compression-result', (event, ...args) => callback(...args)),
    selectFolder: () => ipcRenderer.invoke('dialog:openFolder')
});
