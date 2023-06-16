const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    // node: () => process.versions.node,
    // chrome: () => process.versions.chrome,
    // electron: () => process.versions.electron,
    // ping: () => ipcRenderer.invoke('ping'),   
    openExternal: (url) => ipcRenderer.invoke("open-external", url), //provide an api which let the renderer process communicate with the main process
    minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
    closeWindow: () =>ipcRenderer.invoke("close-window"),
    loginSuccess: () => ipcRenderer.invoke("login-success"),
    maximizeWindow: () => ipcRenderer.invoke("maximize-window")
    
    // we can also expose variables, not just functions
  })

console.log("ALL API LOADED!")