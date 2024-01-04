const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  sendFilePath: (filePath) => ipcRenderer.send('droppedFilePath', filePath),
  resultFilePath: (callback) => ipcRenderer.on('isTar', (_event, value) => callback(value)),
  checkDir: (dir) => ipcRenderer.send('imageListDir', dir),
  onAlertError: (callback) => ipcRenderer.on('showAlert', (_event, value) => callback(value)),
  onAlertSuccess: (callback) => ipcRenderer.on('success', (_event, value) => callback(value))
})