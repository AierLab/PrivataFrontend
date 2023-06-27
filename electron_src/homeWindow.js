const { app, shell, BrowserWindow, Menu} = require('electron')
// const fs = require("fs")
const path = require('path')
const maximizable = true


function createHomeWindow(){
    const mainWindow = new BrowserWindow({
        width:1200,
        height:800,
        show:false,
        frame: false,
        transparent: true,
        webPreferences: {
            devTools: true,
            preload: path.join(__dirname, 'preloadHome.js') 
        }
    })
    // mainWindow.loadFile('./build/usbKey.html')
    mainWindow.loadURL("http://localhost:3000/home")
    mainWindow.on('ready-to-show', () => {
        // 页面加载完成后显示内容
        mainWindow.show();
    })

    global.share.ipcMain.on('get-maximizable-state', (event) => {
      event.returnValue = maximizable;
    });

    global.share.ipcMain.handle("minimize-home-window", async () => {
        // mainWindow.minimize();
        
        // mainWindow.setOpacity(0)
          mainWindow.minimize();
          // mainWindow.setOpacity(1); // Restore window opacity after minimize
        // Wait for the animation to complete (200ms)
      })
    
      global.share.ipcMain.handle("close-home-window", async () => {
        mainWindow.close()      
        app.quit()
        
      })

      global.share.ipcMain.handle("maximize-home-window", async () => {
        if (!mainWindow.isMaximized()){
          mainWindow.maximize()  
        }else{
          mainWindow.unmaximize()
        }
            
        
      })


      global.share.ipcMain.handle("open-user-info", () => {
        mainWindow.loadURL("http://localhost:3000/userInfo")
      })

      mainWindow.webContents.openDevTools({'mode':'detach'})

    };


    module.exports = {createHomeWindow}