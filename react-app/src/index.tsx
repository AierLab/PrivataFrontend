import { createRoot }from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import UsbVerification from './components/usbVerification';
import Home from './components/home'
import reportWebVitals from './reportWebVitals';
import LoginForm from './components/loginform';

/**
 * React Router used here for creating multiple HTML pages
 */
createRoot(document.getElementById('root') as HTMLElement).render(
    <div className="container" id="app">    
        <HashRouter>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/usbKey.html" element={<UsbVerification />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </HashRouter>
    </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// modeline
// vim: set sw=4 ts=4 expandtab:
