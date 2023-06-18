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

        // 先上监听 + 查询一遍 (就不用上定时器查询了)
        usb.on("attach", async function (device) {
          console.log("USB Connecnted!");
          checkIfExistSecureUSB(mainWindow)
        });

        usb.on("detach", async function (device) {
          setTimeout(() => {
            console.log("USB Detatched!");
            mainWindow.webContents.send("usbDetached");
          }, 100);
        });

        checkIfExistSecureUSB(mainWindow);

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

function checkIfExistSecureUSB(windows) {
    let verificaitionResult = findUsbKey(windows);

    if (verificaitionResult === "verified") {
      console.log("Key verified");
      // Go to Homepage
    } else if (verificaitionResult === "noKey") {
      console.log("No key found");
    }
}

async function findUsbKey(window){
    try {
        const drives = await drivelist.list();
        const usbDrives = drives.filter((drive) => drive.isUSB);

        if (usbDrives.length > 0) {
          // 此处改为都扫一遍, secure-usb大概率只有一个, 若有外接硬盘做选择有些多余 (后面可以再改为选择/多选)
          // 遍历所有usb-storage device
          for (let index = 0; index < usbDrives.length; index++) {
            // 遍历单个设备的所有盘符
            usbDrives[index].mountpoints.forEach((element) => {
              let keyPath = scanUsbDrive(element.path);
              if (keyPath != null) {
                console.log("Find the key at: " + keyPath);
                window.webContents.send("usbDiskDetected", "detected");
                if (verifyKey(keyPath)) {
                  console.log("Verified!!");
                  window.webContents.send("identityVerified", "verified");
                  return "verified";
                }
                window.webContents.send("identityIncorrect", "unverified");
                return "unverified";
              }
            });
          }
        } else {
          console.log("No USB drives detected.");
          window.webContents.send("noKey", "nokey");
          return "noKey";
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
