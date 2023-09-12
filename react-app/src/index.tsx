import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import LoginForm from 'pages/loginform';
import Home from 'pages/home'

const RootComponent = () => {
    return (
        <div id="app">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </HashRouter>
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
