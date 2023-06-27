const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    // node: () => process.versions.node,
    // chrome: () => process.versions.chrome,
    // electron: () => process.versions.electron,
    // ping: () => ipcRenderer.invoke('ping'),   
    minimizeWindow: () => ipcRenderer.invoke("minimize-home-window"),
    closeWindow: () =>ipcRenderer.invoke("close-home-window"),
    maximizeWindow: () => ipcRenderer.invoke("maximize-home-window"),
    openUserInfo: () => ipcRenderer.invoke("open-user-info")
    // we can also expose variables, not just functions
  })

console.log("ALL API LOADED!")