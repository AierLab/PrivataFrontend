import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './index.css';

import Login from 'pages/login/login';
import Home from 'pages/home/home'
import { useEffect } from 'react';

const Index = () => {
    const goto = useNavigate();

    useEffect(() => {
        // TODO: if not login
        if(true) goto('/login')
        else goto('/home')

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="w-full h-full flex flex-col justify-center items-center space-y-4">
            <svg className="animate-spin h-6 w-6 text-neutral-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span> 正在加载 </span>
        </div>
    )
};

const RootComponent = () => {
    return (
        <div id="app">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
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
