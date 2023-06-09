const { app, shell, BrowserWindow, Menu} = require('electron')
const path = require('path')
const {usb} = require("usb");
const drivelist = require("drivelist")


function createUsbKeyWindow(){
    const mainWindow = new BrowserWindow({
        width:800,
        height:600,
        frame: true,
        transparent: false,
    })
    // mainWindow.loadFile('./build/usbKey.html')
    mainWindow.loadURL("http://localhost:3000/usbKey.html")

    usb.on("attach", async function(device){
        console.log("usbconnecnted")
        try {
            const drives = await drivelist.list();
        
            const usbDrives = drives.filter((drive) => drive.isUSB);
        
            if (usbDrives.length > 0) {
                console.log('Detected USB drives:');
                usbDrives.forEach((usbDrive) => {
                    console.log('Drive Letter:', usbDrive.mountpoints[0].path);
                    console.log('Description:', usbDrive.description);
                    console.log('--------------------------------');
                });
            } else {
                console.log('No USB drives detected.');
            }
        } catch (error) {
        console.error(error);
        }
    })

    usb.on("detach", async function(device){
        setTimeout(() => {
            console.log(device);
        }, 100)
        
    })
    mainWindow.webContents.openDevTools();
}




module.exports = {createUsbKeyWindow}