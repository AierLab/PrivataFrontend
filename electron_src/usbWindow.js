const { app, shell, BrowserWindow, Menu} = require('electron')
const path = require('path')

function createUsbKeyWindow(){
    const mainWindow = new BrowserWindow({
        width:800,
        height:600,
        frame: true,
        transparent: false,
    })
    mainWindow.loadFile('./build/usbKey.html')
    mainWindow.webContents.openDevTools();
}

module.exports = {createUsbKeyWindow}