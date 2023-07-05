import React, {useState, useRef} from "react";
import styles from "./loginform.module.css"
import { getLoginResponse } from "../utils/request";
import { useNavigate } from "react-router-dom";
import Titlebar from "./Titlebar";
import { BeakerIcon } from "@heroicons/react/24/solid";

const LoginForm = () => {
    const usernameInput = useRef<HTMLInputElement>(null)
    const passwordInput = useRef<HTMLInputElement>(null)

    const goto = useNavigate()

    const handleLoginClick = () => {
        const username = usernameInput.current!.value
        const password = passwordInput.current!.value
        if (getLoginResponse(username, password)){
            window.api.userLogin()
            goto('/home')
        }else{
            console.log("ahh, you have to enter usernames and password")
        }
    }

    // const handleLinkClick = (event) => {
    //     event.preventDefault();
    //     const url = event.target.href;
    //     window.api.openExternal(url); // Use the api preloaded by the preload.js
    //
    // }; //Check whether the url is clicked. If so, open an external browser (system's default browser) to enter the website 

    return(
        <>
            <div className={styles["login-page-container"]}>
                <div className={styles['content-wrapper']}>
                    <Titlebar colorScheme="light"/>
                    <div id={styles['logo']}>
                        <BeakerIcon height="2rem" width="2rem"/>
                        <span>LOGO</span>
                    </div>
                    <section className={styles['login-section']}>
                        <h2 className={styles['login-title']}>Log in to secure your data</h2>
                        <div>
                            <input id="username-input" ref={usernameInput} type="text" placeholder=" " required/>
                            <label htmlFor="username-input">User Name</label>
                        </div>
                        <div>
                            <input id="password" ref={passwordInput} type="password" placeholder=" " required/>
                            <label htmlFor="password-input">Password</label>
                        </div>
                        <p>
                            <a>Sign up</a> for new user
                        </p>
                        <button className={styles['signin-btn']} onClick={handleLoginClick}> Sign in </button>
                        <a className={styles['forgot-password']}> Forgot Password </a>
                    </section>
                    <section className={styles['right-section']}>
                        <svg height="600" width="600" className={styles["abstract-art"]}>
                            <circle r="150" cx="200" cy="200" fill="#eeeeee77"></circle>
                            <circle r="150" cx="400" cy="200" fill="#eeeeee77"></circle>
                            <circle r="150" cx="300" cy="350" fill="#eeeeee77"></circle>
                        </svg>
                    </section>
                </div>
            </div>
            { /*
            <div className={loginStyles.content}>
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
            */ }
        </>
    )


}

export default LoginForm
