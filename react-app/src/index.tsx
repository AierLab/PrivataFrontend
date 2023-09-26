import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './index.css';

import Login from 'pages/login';
import Home from 'pages/home'
import { useEffect, useState } from 'react';
import ThemeContext from 'contexts/theme'
import { ThemeMode } from '@privata/types/theme';

const Index = () => {
    const goto = useNavigate();

    useEffect(() => {
        // TODO: if not login
        if (true) goto('/login')
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
    const [theme, setTheme] = useState<ThemeMode>('system')

    const changeTheme = (theme: ThemeMode, cursorX?: number, cursorY?: number) => {
        const change = () => {
            setTheme(theme)
            window.api.setTheme(theme)
        }

        if (document.startViewTransition) {
            const transition = document.startViewTransition(change)
            if(cursorX && cursorY) {
                const html = document.querySelector('html')!
                if(theme !== 'system') html.setAttribute('data-mask-animation', 'true')

                const pageWidth = html.clientWidth
                const pageHeight = html.clientHeight
                const circleRadius = Math.hypot(Math.max(cursorX, pageWidth - cursorX), Math.max(cursorY, pageHeight - cursorY))

                transition.ready.then(() => {
                    document.documentElement.animate(
                        {
                            clipPath: [
                                `circle(0 at ${cursorX}px ${cursorY}px)`,
                                `circle(${circleRadius}px at ${cursorX}px ${cursorY}px)`,
                            ],
                        },
                        {
                            duration: 500,
                            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                            pseudoElement: "::view-transition-new(root)",
                        },
                    )
                })
                transition.finished.then(() => {
                    document.querySelector('html')!.removeAttribute('data-mask-animation')
                })
            }
        } else {
            change()
        }
    }

    return (
        <div id="app">
            <ThemeContext.Provider value={{ theme: theme, setTheme: changeTheme }}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/home/:tab?/:workspace?" element={<Home />} />
                    </Routes>
                </HashRouter>
            </ThemeContext.Provider>
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
