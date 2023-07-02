// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    // node: () => process.versions.node,
    // chrome: () => process.versions.chrome,
    // electron: () => process.versions.electron,
    // ping: () => ipcRenderer.invoke('ping'),

    openExternal:   (url: string) => ipcRenderer.invoke("global:open-external", url), //provide an api which let the renderer process communicate with the main process
    minimizeWindow: () => ipcRenderer.invoke("window:minimize"),
    closeWindow:    () => ipcRenderer.invoke("window:close"),
    toggleMaximize: () => ipcRenderer.invoke("window:toggle-maximize"),
    userLogin:      () => ipcRenderer.invoke("user:login"),

    isDebug:        () => ipcRenderer.invoke("dev:is-debug-mode"),
    toggleDevTools: () => ipcRenderer.invoke("dev:toggle-dev-tools"),
    // we can also expose variables, not just functions
  })

console.log("ALL API LOADED!")
