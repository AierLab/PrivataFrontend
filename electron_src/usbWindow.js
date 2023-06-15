const { app, shell, BrowserWindow, Menu, ipcMain} = require('electron')
const fs = require("fs")
const path = require('path')
const {usb} = require("usb");
const drivelist = require("drivelist")
const {createHomeWindow} = require("./homeWindow.js")
const maximizable = true


function createUsbKeyWindow(){
    const mainWindow = new BrowserWindow({
        width:1200,
        height:800,
        show:false,
        frame: false,
        transparent: true,
        webPreferences: {
            devTools: true,
            preload: path.join(__dirname, 'preloadUsb.js') 
        }
    })

    // mainWindow.loadFile('./build/usbKey.html')
    mainWindow.loadURL("http://localhost:3000/usbKey.html")
    mainWindow.on('ready-to-show', () => {
        // 页面加载完成后显示内容
        mainWindow.show();
        var verificaitionResult = findUsbKey(mainWindow)
        
        if (verificaitionResult==="verified"){
            // Go to Homepage
        }else{
            setTimeout(() => {
                usb.on("attach", async function(device){
                    console.log("usbconnecnted")
                    try {
                        verificaitionResult = findUsbKey(mainWindow)
                        if (verificaitionResult==="verified"){
                            // Go to Homepage
                        }
                    } catch (error) {
                    console.error(error);
                    }
                })
            
                usb.on("detach", async function(device){
                    setTimeout(() => {
                        console.log("USB Detatched!");
                        mainWindow.webContents.send("usbDetached")
                    }, 100)
                    
                })
            },2000)

            
        }
        
    });

    global.share.ipcMain.on('get-maximizable-state', (event) => {
        event.returnValue = maximizable;
      });

    global.share.ipcMain.handle("successfully-verified", ()=>{
        mainWindow.close();
        createHomeWindow();
    })

    global.share.ipcMain.handle("minimize-USBwindow", async () => {
        mainWindow.minimize();
        // mainWindow.setOpacity(1); // Restore window opacity after minimize
        // Wait for the animation to complete (200ms)
    })
    
    global.share.ipcMain.handle("close-USBwindow", async () => {
        mainWindow.close()      
        app.quit()
    
    })

    global.share.ipcMain.handle("maximize-USBwindow", async () => {
        if (!mainWindow.isMaximized()){
          mainWindow.maximize()  
        }else{
          mainWindow.unmaximize()
        }
            
        
      })
    hasUsbDrive = false

    /**
     * phase i
     * scan current drives -> no usb connected -> x
     * scan current drives -> has usb connecetd -> no usb disks -> x
     * scan current drives -> has usb connecetd -> usb disks -> no key -> x
     * scan curren drives -> has usb connected -> usb disks -> has key -> pass
     * 
     * 
     * phase ii
     * No usb -> detect usb -> no usb connected -> x
     * No usb -> detect usb -> usb connected -> no usb disk -> x
     * No usb -> detect usb -> usb connected -> usb disk -> scan disk -> no key -> x
     * No usb -> detect usb -> usb connected -> usb disk -> scan disk -> has key -> pass
     */
    
    // mainWindow.webContents.openDevTools();
}

async function findUsbKey(window){
    try {
        const drives = await drivelist.list();
    
        const usbDrives = drives.filter((drive) => drive.isUSB);
    
        if (usbDrives.length === 1) {
            console.log('Detected USB drives:');
            var usbDrive = usbDrives[0]
            keyPath = scanUsbDrive(usbDrive.mountpoints[0].path)
            // keyPath.then((value) => {
            //     console.log(value)
            // })
            console.log(keyPath)
            if (keyPath!=null && keyPath.endsWith(".prakey")){
                
                window.webContents.send("usbDiskDetected", "detected")
                if (verifyKey(keyPath)){
                    console.log("Verified!!")
                    window.webContents.send("identityVerified", "verified")
                    return "verified"
                }
                window.webContents.send("identityIncorrect", "unverified")
                return "unverified"
            }
            window.webContents.send("noKey", "nokey")
            return "noKey"
        }

        if (usbDrives.length > 1) {
            window.webContents.send("chooseUsbDisk", "choose");
            return "noKey"
        } else {
            console.log('No USB drives detected.');
            return "noKey"
        }
    } catch (error) {
        console.error(error);
        return "noKey"
    
    }
}

function scanUsbDrive(drivePath){
    const fileFormat = '.prakey';
    files = fs.readdirSync (drivePath);

    const filepaths = files.filter((file) => file.endsWith(fileFormat)).map((file) => path.join(drivePath, file));
      
        

    return filepaths[0] || null;

}

async function retrieveValue(promiseobj){
    try {
        const result = await promiseobj;
        // Handle the resolved value
        return result;
      } catch (error) {
        // Handle any errors that occurred during the promise execution
        console.error(error);
      }
}

function verifyKey(keyPath){
    // To do the Verification
    return true;
}


module.exports = {createUsbKeyWindow}
