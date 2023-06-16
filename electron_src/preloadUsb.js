const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    // node: () => process.versions.node,
    // chrome: () => process.versions.chrome,
    // electron: () => process.versions.electron,
    // ping: () => ipcRenderer.invoke('ping'),   
    // openExternal: (url) => ipcRenderer.invoke("open-external", url), //provide an api which let the renderer process communicate with the main process
    minimizeWindow: () => ipcRenderer.invoke("minimize-USBwindow"),
    closeWindow: () =>ipcRenderer.invoke("close-USBwindow"),
    success: () => ipcRenderer.invoke("successfully-verified"),
    maximizeWindow: () => ipcRenderer.invoke("maximize-USBwindow"),
    // onDetectUsb: (process) => ipcRenderer.on("usbDiskDetected", process)
    
    // loginSuccess: () => ipcRenderer.invoke("login-success")
    // we can also expose variables, not just functions
  })


ipcRenderer.on('usbDiskDetected', (event, diskInfo) => {
    const eventPayload = {type: 'usbDiskDetected', diskInfo};
    window.dispatchEvent(new CustomEvent('electronEvent', {detail:eventPayload}))
})

ipcRenderer.on('identityVerified', (event, info) => {
    const eventPayload = {type: 'identityVerified', info};
    window.dispatchEvent(new CustomEvent('electronEvent', {detail:eventPayload}))
})

ipcRenderer.on('identityIncorrect', (event, info) => {
    const eventPayload = {type: 'identityIncorrect', info};
    window.dispatchEvent(new CustomEvent('electronEvent', {detail:eventPayload}))
})

ipcRenderer.on('noKey', (event, info) => {
    const eventPayload = {type: 'noKey', info};
    window.dispatchEvent(new CustomEvent('electronEvent', {detail:eventPayload}))
})

ipcRenderer.on('chooseUsbDisk', (event, info) => {
    const eventPayload = {type: 'chooseUsbDisk', info};
    window.dispatchEvent(new CustomEvent('electronEvent', {detail:eventPayload}))
})

ipcRenderer.on('usbDetached', (event, info) => {
    const eventPayload = {type: 'usbDetached', info};
    window.dispatchEvent(new CustomEvent('electronEvent', {detail:eventPayload}))
})

