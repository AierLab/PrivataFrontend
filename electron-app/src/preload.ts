// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
import { SecurtyKeyVerificationResult } from './daemons/securityKey';

contextBridge.exposeInMainWorld('api', {
    // node: () => process.versions.node,
    // chrome: () => process.versions.chrome,
    // electron: () => process.versions.electron,
    // ping: () => ipcRenderer.invoke('ping'),

    openExternal:     (url: string) => ipcRenderer.invoke("global:open-external", url), //provide an api which let the renderer process communicate with the main process
    minimizeWindow:   () => ipcRenderer.invoke("window:minimize"),
    closeWindow:      () => ipcRenderer.invoke("window:close"),
    toggleMaximize:   () => ipcRenderer.invoke("window:toggle-maximize"),
    userLogin:        () => ipcRenderer.invoke("user:login"),

    navToLoginPage:   () => ipcRenderer.invoke('nav:to-login-page'),
    loginPageReady:   () => ipcRenderer.invoke('ready:login-page'),

    isDebug:          () => ipcRenderer.invoke("dev:is-debug-mode"),
    toggleDevTools:   () => ipcRenderer.invoke("dev:toggle-dev-tools"),
    loadDevExtension: (path: string) => ipcRenderer.invoke("dev:load-extension", path),
  })


ipcRenderer.on('verification_changed', (event, result: SecurtyKeyVerificationResult) => {
  window.dispatchEvent(
    new CustomEvent<SecurtyKeyVerificationResult>('securityKeyVerificationStatusChanged', { detail: result }))
})
// we can also expose variables, not just functions

console.log("ALL API LOADED!")
