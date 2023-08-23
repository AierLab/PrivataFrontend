import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { SecurityKeyContext } from 'contexts/securityKey';
import { ManifestVersion } from '@privata/types/security-key';
import { SecurityKeyVerificationContext } from 'types/security-key';
import './index.css';

import SecurityAlertOverlay from 'components/SecurityKeyAlertOverlay';
import LoginForm from 'pages/loginform';
import Home from 'pages/home'

const RootComponent = () => {
    const [verificationResult, setVerificationResult] = useState<SecurityKeyVerificationContext>(
        { status: 'unverified', manifest: { version: ManifestVersion.v1 } }
    )

    window.addEventListener('securityKeyVerificationStatusChanged', (e: any) => {
        const result: SecurityKeyVerificationContext = e.detail
        // if (result.status==="verified"){
        //     window.api.startLocalModel()
        // }else{
        //     window.api.killLocalModel()
        // }
        setVerificationResult(result)
    })

    return (
        <div className="container" id="app">
            <SecurityKeyContext.Provider value={verificationResult}>
                <SecurityAlertOverlay>
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<LoginForm />} />
                            <Route path="/home" element={<Home />} />
                        </Routes>
                    </HashRouter>
                </SecurityAlertOverlay>
            </SecurityKeyContext.Provider>
        </div >
    )
};

/**
 * React Router used here for creating multiple HTML pages
 */
createRoot(document.getElementById('root') as HTMLElement).render(<RootComponent />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// modeline
// vim: set sw=4 ts=4 expandtab:
