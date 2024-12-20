import { shell, app, BrowserWindow, dialog, ipcMain, session, clipboard, nativeTheme } from 'electron';
import { ThemeMode } from '@privata/types/theme'
import { OpenFileOptions } from '@privata/types/open-file-dialog'
import * as fs from 'fs'
import path from 'path'
import * as os from 'os'
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const debug = !app.isPackaged

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1300,
    height: 850,
    minWidth: 850,
    minHeight: 640,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  const toLoginPage = () => {
    if (!debug) {
      // mainWindow.loadFile(MAIN_WINDOW_WEBPACK_ENTRY);
      mainWindow.loadFile('index.html')
    } else {
      mainWindow.loadURL('http://localhost:3001/')
      session.defaultSession.loadExtension(path.join(__dirname, '../../react-dev-tools'))
    }
  }

  toLoginPage()
  if (debug) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  ipcMain.handle('dev:is-debug-mode',      async () => debug)
  ipcMain.handle('dev:toggle-dev-tools',   async () => { mainWindow.webContents.openDevTools({ mode: 'detach' }) })
  ipcMain.handle('dev:load-extension',     async (event, path) => await session.defaultSession.loadExtension(path))

  ipcMain.handle('sys:read-clipboard',     () => clipboard.readText())
  ipcMain.handle('sys:set-clipboard',      (event, text: string) => clipboard.writeText(text))

  ipcMain.handle('nav:to-login-page',      toLoginPage)

  ipcMain.handle('app:set-theme',          (event, theme: ThemeMode) => nativeTheme.themeSource = theme)

  ipcMain.handle('global:open-external',   async (event, url) => { await shell.openExternal(url) })
  ipcMain.handle("window:minimize",        async () => { mainWindow.minimize() })
  ipcMain.handle("window:toggle-maximize", async () => { mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize() })
  ipcMain.handle("window:close",           async () => {
    mainWindow.close()
    app.quit()
  })

  ipcMain.handle("user:login", async () => {
    console.log("Congratulations! You have successfully logged in.")
  })

  ipcMain.handle("sys:open-file", (event, options?: OpenFileOptions) => {
    const properties = ['openFile']
    if (options.multiSelect) properties.push('multiSelections')

    return dialog.showOpenDialog(mainWindow, {
      properties: properties as never,
      message: options.message,
      title: options.title,
      filters: options.filters
    })
  })

  ipcMain.handle("sys:read-file", (event, pathname: string) => {
    if(!fs.existsSync(pathname)) return null
    const filename = path.basename(pathname)
    return { buffer: fs.readFileSync(pathname), filename }
  })

  ipcMain.handle('sys:get-os', () => {
    return os.platform()
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
