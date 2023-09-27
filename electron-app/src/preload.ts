// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
import { ThemeMode } from '@privata/types/theme'
import { OpenFileOptions } from '@privata/types/open-file-dialog'

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
    startLocalModel:  () => ipcRenderer.invoke("local-model:start"),
    killLocalModel:   () => ipcRenderer.invoke("local-model:terminate"),

    navToLoginPage:   () => ipcRenderer.invoke('nav:to-login-page'),
    loginPageReady:   () => ipcRenderer.invoke('ready:login-page'),

    isDebug:          () => ipcRenderer.invoke("dev:is-debug-mode"),
    toggleDevTools:   () => ipcRenderer.invoke("dev:toggle-dev-tools"),
    loadDevExtension: (path: string) => ipcRenderer.invoke("dev:load-extension", path),

    readClipboard:    () => ipcRenderer.invoke('sys:read-clipboard'),
    setClipboard:     (text: string) => ipcRenderer.invoke('sys:set-clipboard', text),

    setTheme:         (theme: ThemeMode) => ipcRenderer.invoke('app:set-theme', theme),
    openFile:         (options: OpenFileOptions) => ipcRenderer.invoke("sys:open-file", options),
    readFile:         (path: string) => ipcRenderer.invoke("sys:read-file", path),
})

