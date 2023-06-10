import React, {useState} from "react";
// import { IpcRenderer } from "electron";
import usbStyles from "./usbVerification.module.css"

const UsbVerification = () => {    
    const [popupStyle1, showPopup1] = useState(usbStyles.usbPopup1)
    const [popupStyle2, showPopup2] = useState(usbStyles.hide);
    const [popupSuccess, showSuccess] = useState(usbStyles.hide);
    const [popupFailure, showFailure] = useState(usbStyles.hide);

    const handleMinimizeClick = () =>{
        const appContainer = document.getElementById(usbStyles.app);
        appContainer.classList.add(usbStyles.minimized);
        setTimeout(() =>{
            appContainer.classList.remove(usbStyles.minimized);
            window.api.minimizeWindow();
        },200)
        
    }
    const handleCloseClick = () =>{
        const appContainer = document.getElementById(usbStyles.app);
        appContainer.classList.add(usbStyles.closed);
        setTimeout(() => {
            window.api.closeWindow();
          }, 200); 
        
    }
    
    var state = "start"
    window.addEventListener('electronEvent', (event) => {
        const {type, diskInfo} = event.detail;

        // if (type === "usbDiskDetected"){
        //     setTimeout(() => {
        //         showPopup2(usbStyles.usbPopup2)
        //     })
        //     showPopup1(usbStyles.hide)


            
        // }

        switch (state) {
            case "start":
                if (type === "usbDiskDetected"){
                    setTimeout(() => {
                        showPopup2(usbStyles.usbPopup2)
                    })
                    showPopup1(usbStyles.hide)
                state = "usbDiskDetected";
                }
                break;
            
            case "usbDiskDetected":
                if (type === "usbDetached"){
                    setTimeout(() => {
                        showPopup1(usbStyles.usbPopup1)
                    },1000)
                    showPopup2(usbStyles.hide)
                    state = "usbDetached"
                }
                else if (type === "identityVerified"){
                    setTimeout(() => {
                        // showPopup1(usbStyles.hide)
                        setTimeout(() => {
                            // showPopup1(usbStyles.hide)
                            showSuccess(usbStyles.usbPopup1)
        
                        },1000)
                        showPopup2(usbStyles.hide)
    
                    },3000)
                     
                    state = "identityVerified"
                }else if (type === "identityIncorrect"){
                    setTimeout(() => {
                        // showPopup1(usbStyles.hide)
                        setTimeout(() => {
                            // showPopup1(usbStyles.hide)
                            showFailure(usbStyles.usbPopup1)
        
                        },1000)
                        showPopup2(usbStyles.hide)
    
                    },3000)

                    state = "start"
                }
                break;
            case "usbDetached":
                if (type === "usbDiskDetected"){
                    setTimeout(() => {
                        showPopup2(usbStyles.usbPopup2)
                    })
                    showPopup1(usbStyles.hide)
                state = "usbDiskDetected";
                }
                break;
            default:
                break;
            }


                
            // case "identityVerified":
            //     setTimeout(() => {
            //         showPopup1(usbStyles.hide)
            //         showSuccess(usbStyles.usbPopup1)

            //     },1000)
            //     showPopup2(usbStyles.hide) 
                
            //     break
    })
    
    
    return(
        <div className={usbStyles.container} id={usbStyles.app}>    
            <div className={usbStyles.cover}>
                <div className ={usbStyles.buttons}>
                    <div id={usbStyles.minimize} onClick={handleMinimizeClick}>
                        <span>-</span>
                    </div>
                    <div id={usbStyles.close} onClick={handleCloseClick}>
                        <span>&times;</span>
                    </div>
                    
                </div>  
                <div className={popupStyle1}><h1 className={usbStyles.text1}>Insert your Security USB Key</h1></div> 

                <div className={popupStyle2}><h1 className={usbStyles.text2}>USB Key Found. Verifying Your Identity...</h1></div>  
                <div className={popupSuccess}><h1 className={usbStyles.text3}>Identity Verified, Enjoy Your Journey with our AI </h1></div>  
                <div className={popupFailure}><h1 className={usbStyles.text4}>Wrong Credentials, Please Ensure You have Inserted the correct key </h1></div>  
                
                
            </div>
            
        </div>
    )
}

export default UsbVerification;