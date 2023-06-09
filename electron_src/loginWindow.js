const { app, shell, BrowserWindow, Menu} = require('electron')
const path = require('path')
const {createUsbKeyWindow} = require("./usbWindow.js")

function createLoginWindow () {
    // Create the browser window.
    Menu.setApplicationMenu(null)
    const mainWindow = new BrowserWindow({
      width: 540,
      height: 620,
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
      // mainWindow.minimize();
      
      // mainWindow.setOpacity(0)
        mainWindow.minimize();
        // mainWindow.setOpacity(1); // Restore window opacity after minimize
      // Wait for the animation to complete (200ms)
    })
  
    global.share.ipcMain.handle("close-window", async () => {
      mainWindow.close()      
      app.quit()
      
    })

    global.share.ipcMain.handle("login-success", async () => {
      mainWindow.close();
      await createUsbKeyWindow();
    } )
  
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

module.exports = {createLoginWindow}