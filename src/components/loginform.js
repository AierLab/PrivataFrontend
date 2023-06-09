import React, {useState} from "react";
import "./loginform.css"
import { getLoginResponse } from "../utils/request";


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [popupStyle, showPopup] = useState("hide");

    const handleLoginClick = (event) => {
        event.preventDefault();
        if (getLoginResponse(username, password)){
            window.api.loginSuccess()
        }else{
            showPopup("login-popup")
            setTimeout(() =>showPopup("hide"),3000)
        }
    }
    
    // console.log(__dirname)
    const handleLinkClick = (event) => {
        event.preventDefault();
        const url = event.target.href;
        window.api.openExternal(url); // Use the api preloaded by the preload.js
        
    }; //Check whether the url is clicked. If so, open an external browser (system's default browser) to enter the website 

    const handleMinimizeClick = () =>{
        const appContainer = document.getElementById('app');
        appContainer.classList.add('minimized');
        setTimeout(() =>{
            appContainer.classList.remove('minimized');
            window.api.minimizeWindow();
        },200)
        
    }
    const handleCloseClick = () =>{
        const appContainer = document.getElementById('app');
        appContainer.classList.add('closed');
        setTimeout(() => {
            window.api.closeWindow();
          }, 200); 
        
    }


    return(
            <div className="cover">     
                <div className ="buttons">
                    <div id="minimize" onClick={handleMinimizeClick}>
                        <span>-</span>
                    </div>
                    <div id="close" onClick={handleCloseClick}>
                        <span>&times;</span>
                    </div>
                </div>       
                <h1>Login</h1>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <div className="login-btn" onClick={handleLoginClick}>Login</div>
                <p className="signup-text"> Not a user yet?  <a className="signup-url" href="https://google.com" onClick={handleLinkClick}> Sign up</a> for now!</p>
                <p className="text">Or login using</p>

                <div className="alt-login">
                    <div className="facebook"></div>
                    <div className="google"></div>
                </div>

                <div className={popupStyle}>
                    <h3 className="failed-text1">Login Failed</h3>
                    <p className="failed-text2">Username or password incorrect</p>
                </div>
        </div>
        
        
    )

    
}

export default LoginForm