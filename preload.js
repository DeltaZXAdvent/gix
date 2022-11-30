const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('gix', (cmd, ...args) => ipcRenderer.invoke('gix', cmd, ...args));
