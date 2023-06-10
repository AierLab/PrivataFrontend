import React, {useState} from "react";
import loginStyles from "./loginform.module.css"
import { getLoginResponse } from "../utils/request";


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [popupStyle, showPopup] = useState(loginStyles.hide);

    const handleLoginClick = (event) => {
        event.preventDefault();
        if (getLoginResponse(username, password)){
            const appContainer = document.getElementById(loginStyles.app);
            appContainer.classList.add(loginStyles.close);
            setTimeout(() => {
                window.api.loginSuccess()
            }, 200)
            
        }else{
            showPopup(loginStyles.loginPopup)
            setTimeout(() =>{
                
                setTimeout(() =>{
                    showPopup(loginStyles.hide);
                },300)
                showPopup(loginStyles.hide2);
            },4000)
            

        }
    }
    
    // console.log(__dirname)
    const handleLinkClick = (event) => {
        event.preventDefault();
        const url = event.target.href;
        window.api.openExternal(url); // Use the api preloaded by the preload.js
        
    }; //Check whether the url is clicked. If so, open an external browser (system's default browser) to enter the website 

    const handleMinimizeClick = () =>{
        const appContainer = document.getElementById(loginStyles.app);
        appContainer.classList.add(loginStyles.minimized);
        // console.log(appContainer.classList)
        setTimeout(() =>{
            appContainer.classList.remove(loginStyles.minimized);
            window.api.minimizeWindow();
        },500)
        
    }
    const handleCloseClick = () =>{
        const appContainer = document.getElementById(loginStyles.app);
        appContainer.classList.add(loginStyles.close);
        setTimeout(() => {
            window.api.closeWindow();
          }, 200); 
        
    }


    return(
            <div className={loginStyles.cover}>     
                <div className ={loginStyles.buttons}>
                    <div id={loginStyles.minimize} onClick={handleMinimizeClick}>
                        <span>-</span>
                    </div>
                    <div id={loginStyles.close} onClick={handleCloseClick}>
                        <span>&times;</span>
                    </div>
                </div>       
                <h1>Login</h1>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <div className={loginStyles.loginBtn} onClick={handleLoginClick}>Login</div>
                <p className={loginStyles.signupText}> Not a user yet?  <a className={loginStyles.signupUrl} href="https://google.com" onClick={handleLinkClick}> Sign up</a> for now!</p>
                <p className={loginStyles.text}>Or login using</p>

                <div className={loginStyles.altLogin}>
                    <div className={loginStyles.facebook}></div>
                    <div className={loginStyles.google}></div>
                </div>

                <div className={popupStyle}>
                    <h3 className={loginStyles.failedText1}>Login Failed</h3>
                    <p className={loginStyles.failedText2}>Username or password incorrect</p>
                </div>
        </div>
        
        
    )

    
}

export default LoginForm