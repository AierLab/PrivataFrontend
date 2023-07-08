import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import UsbVerification from './components/usbVerification';
import Home from './components/home'
import reportWebVitals from './reportWebVitals';
import LoginForm from './components/loginform';
import { SecurityKeyContext } from './contexts/securityKey';

import { useState } from 'react';
import { ManifestVersions } from './types/enums';

import SecurityAlertOverlay from './components/SecurityKeyAlertOverlay';

const RootComponent = () => {
    const [verificationResult, setVerificationResult] = useState<SecurityKeyVerificationContext>(
        { status: 'unverified', manifest: { version: ManifestVersions.v1 } }
    )

    window.addEventListener('securityKeyVerificationStatusChanged', (e: any) => {
        const result: SecurityKeyVerificationContext = e.detail
        setVerificationResult(result)
    })

    return (
        <div className="container" id="app">
            <SecurityKeyContext.Provider value={verificationResult}>
                <SecurityAlertOverlay>
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<LoginForm />} />
                            <Route path="/usbKey.html" element={<UsbVerification />} />
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
