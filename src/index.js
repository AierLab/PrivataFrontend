import React from 'react';
import { useEffect, useState } from 'react';
import { createRoot }from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './index.css';
import App from './App';
import UsbVerification from './components/usbVerification';
import Home from './components/home'
import reportWebVitals from './reportWebVitals';
import { MinusIcon, StopIcon, XMarkIcon } from '@heroicons/react/24/outline';
// const { ipcRenderer } = window.require('electron');


function updateDynamicWidth(newWidth) {
    console.log(newWidth)
    document.documentElement.style.setProperty('--dynamic-width', newWidth);
}
function updateDynamicHeight(newHeight) {
    document.documentElement.style.setProperty('--dynamic-height', newHeight);
}

// const maximizable = useMaximizable()

const handleMinimizeClick = () =>{
    const appContainer = document.getElementById("app");
    appContainer.classList.add("minimized");
    setTimeout(() =>{
        appContainer.classList.remove("minimized");
        window.api.minimizeWindow();
    },200)

}
const handleCloseClick = () =>{
    const appContainer = document.getElementById("app");
    appContainer.classList.add("closed");
    setTimeout(() => {
        window.api.closeWindow();
    }, 200); 
}
var newWidth;
var newHeight;
const handleMaximizeClick = () =>{
    const appContainer = document.getElementById("app");
    const id = document.getElementsByClassName("loginCover")
    if (id.length==0){
        if (!appContainer.classList.contains("maximized")){
            // appContainer.remove("unmaximized")
            appContainer.classList.add("maximized");
            setTimeout(() => {
                window.api.maximizeWindow();
                // appContainer.classList.remove("maximized");
            },150); 
            newWidth = window.innerWidth.toString() + 'px';
            newHeight = window.innerHeight.toString() + 'px';
        }else{
            appContainer.classList.remove("maximized")
            appContainer.classList.add("unmaximized")
            updateDynamicHeight(newHeight)
            updateDynamicWidth(newWidth)
            setTimeout(() => {
                window.api.maximizeWindow();
                // appContainer.remove("unmaximized")
                appContainer.classList.remove("unmaximized");
            },70); 
        }
    }

}




/**
 * React Router used here for creating multiple HTML pages
 */
createRoot(document.getElementById('root')).render(
    <div className="container" id="app">    
        <div className={window.innerWidth < 600 ? "loginCover" : "cover"}>
            <div className ="buttons">
                <div id="minimize" onClick={handleMinimizeClick}>
                    <MinusIcon />
                </div>
                <div id="maximize" onClick={handleMaximizeClick}>
                    <StopIcon />
                </div>


                <div id="close" onClick={handleCloseClick}>
                    <XMarkIcon />
                </div>

            </div>


            <Router>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/usbKey.html" element={<UsbVerification />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </Router>
        </div>
    </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// modeline
// vim: set sw=4 ts=4 expandtab:
