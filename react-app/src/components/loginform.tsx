import React, { useState, useRef, useContext } from "react";
import styles from "./loginform.module.css"
import { getLoginResponse } from "../utils/request";
import { useNavigate } from "react-router-dom";
import Titlebar from "./Titlebar";
import { ArrowPathIcon, BeakerIcon, ExclamationCircleIcon, MagnifyingGlassCircleIcon, NoSymbolIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { SecurityKeyContext } from "../contexts/securityKey";

interface VerificationHint {
    icon: any,
    text: string,
    textColor: string,
    backgroundColor: string,
};

const verificationHints: Record<SecurityKeyVerificationStatus, VerificationHint> = {
    'unverified': {
        icon: <MagnifyingGlassCircleIcon />,
        text: 'Unverified',
        textColor: '#000',
        backgroundColor: '#fff',
    },
    'verifing': {
        icon: <ArrowPathIcon />,
        text: 'Verifing',
        textColor: '#000',
        backgroundColor: '#eee',
    },
    'verified': {
        icon: <ShieldCheckIcon />,
        text: 'Verified',
        textColor: '#fff',
        backgroundColor: '#15803d',
    },
    'noKey': {
        icon: <NoSymbolIcon />,
        text: 'No Privata Security Key™ found',
        textColor: '#000',
        backgroundColor: '#fff',
    },
    'error': {
        icon: <ExclamationCircleIcon />,
        text: "Error occurred",
        textColor: '#fff',
        backgroundColor: '#b91c1c',
    }
};

const LoginForm = () => {
    const usernameInput = useRef<HTMLInputElement>(null)
    const passwordInput = useRef<HTMLInputElement>(null)

    const verificationResult = useContext(SecurityKeyContext)
    const currentStatus = verificationHints[verificationResult.status]

    const goto = useNavigate()

    const handleLoginClick = () => {
        const username = usernameInput.current!.value
        const password = passwordInput.current!.value
        if (verificationResult.status !== 'verified') {
            alert("please plug in security key")
            return
        }
        if (getLoginResponse(username, password)) {
            window.api.userLogin()
            goto('/home')
        } else {
            alert("please enter username & password")
            return
        }
    }

    // const handleLinkClick = (event) => {
    //     event.preventDefault();
    //     const url = event.target.href;
    //     window.api.openExternal(url); // Use the api preloaded by the preload.js
    //
    // }; //Check whether the url is clicked. If so, open an external browser (system's default browser) to enter the website 

    return (
        <>
            <div className={styles["login-page-container"]}>
                <div className={styles['content-wrapper']}>
                    <Titlebar colorScheme="light" />
                    <div id={styles['logo']}>
                        <BeakerIcon height="2rem" width="2rem" />
                        <span>LOGO</span>
                    </div>
                    <section className={styles['login-section']}>
                        <h2 className={styles['login-title']}>Log in to secure your data</h2>
                        <div>
                            <input id="username-input" ref={usernameInput} type="text" placeholder=" " required />
                            <label htmlFor="username-input">User Name</label>
                        </div>
                        <div>
                            <input id="password" ref={passwordInput} type="password" placeholder=" " required />
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
                        <AnimatePresence>
                            <motion.div
                                key={verificationResult.status}
                                className={styles['security-key-status']}
                                style={{ color: currentStatus.textColor, background: currentStatus.backgroundColor }}
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, type: 'spring', damping: 15, stiffness: 300 }}
                            >
                                <span className={styles['security-key-status-icon']}>{currentStatus.icon}</span>
                                <span>{currentStatus.text}</span>
                            </motion.div>
                        </AnimatePresence>
                    </section>
                </div>
            </div>
        </>
    )
}

export default LoginForm
