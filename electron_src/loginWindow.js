const { app, shell, BrowserWindow, Menu} = require('electron')
const path = require('path')
const {createUsbKeyWindow} = require("./usbWindow.js")
const maximizable = true
function createLoginWindow () {
    // Create the browser window.
    Menu.setApplicationMenu(null)
    const mainWindow = new BrowserWindow({
      width: 540,
      height: 680,
      maximizable:false,
      resizable: false,
      frame: false,
      transparent: true,
      webPreferences: {
        preload: path.join(__dirname, 'preloadLogin.js')
      }
    })
  
    // and load the index.html of the app.
    console.log(__dirname)
    // mainWindow.loadFile('./build/index.html')
    mainWindow.loadURL("http://localhost:3000")
    // mainWindow.loadFile("index1.html")
    // keep waiting and listeninf to the request of opening links in an external browser
    global.share.ipcMain.handle('open-external', async (event, url) => {
      await shell.openExternal(url);
    })
  
    global.share.ipcMain.handle("minimize-window", async () => {
        mainWindow.minimize();
    })
  
    global.share.ipcMain.handle("close-window", async () => {
      mainWindow.close()      
      app.quit()
      
    })

    global.share.ipcMain.handle("maximize-window", async () => {
          
      
    })

    // global.share.ipcMain.handle("login-success", async () => {
    //   mainWindow.close();
    //   await createUsbKeyWindow();
    // } )
  
    // Open the DevTools.
    mainWindow.webContents.openDevTools({'mode':'detach'})
    return mainWindow;
}

module.exports = {createLoginWindow}