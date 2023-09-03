import React, { ReactElement, useState, useContext } from "react";
import { extractColorsFromSrc } from "extract-colors";
import styles from "./home.module.css"

import { ChatBubbleLeftRightIcon, MusicalNoteIcon, PaintBrushIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import Chat from "./features/chat";
import { SecurityKeyContext } from "contexts/securityKey";

import Titlebar from 'components/Titlebar'
import { Persona } from "types/persona";
import { PersonaContext } from "contexts/persona"

import { SecurityKeyManifestV1 } from '@privata/types/security-key'
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid"
import Separator from "components/Separator"
import { BellIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import { modulize } from "utils/classNames";

interface Feature {
    id: string,
    name: string,
    icon: ReactElement,
    element?: ReactElement,
};

const Home = () => {
    const features: Feature[] = [
        { id: 'reports-review', name: "Reports Review", icon: <ChatBubbleLeftRightIcon />, element: <Chat /> },
        { id: 'quan-eval',      name: "Quantitative Evaluation", icon: <MusicalNoteIcon /> },
        { id: 'design-plans',   name: "Design Plans", icon: <MusicalNoteIcon /> },
    ]

    const s = modulize(styles)

    const verificationResult = useContext(SecurityKeyContext)

    const personas = verificationResult.status === "verified" ? (verificationResult.manifest as SecurityKeyManifestV1).personas : [{ uuid: "", name: "", desc: "", avatar: "default-avatar.png", features: [], compatibility: "" }]

    const [currentTab, setCurrentTab] = useState<string | null>(null)
    const [selectedPersona, setSelectedPersona] = useState(personas[0])
    const [personaSelectionShow, setpersonaSelectionShow] = useState<boolean>(false)
    const [themeColor, setThemeColor] = useState('white')
    const [scndThemeColor, setScndThemeColor] = useState('#39c5bb')

    const handleSelectpersona = (p: Persona) => {
        setpersonaSelectionShow(false)
        setSelectedPersona(p)
        extractColorsFromSrc(p.avatar).then((value: any[]) => {
            setThemeColor(value[value.length - 1].hex)
            setScndThemeColor(value[value.length - 4].hex)
        })
    }

    return (
        <>
            <PersonaContext.Provider value={{ persona: selectedPersona }}>
                <div className={styles['container']}>
                    <main className={styles['content-wrapper']} >
                        <aside className={styles['nav-aside']} style={{ backgroundColor: themeColor }}>
                            <div>
                                <div className={styles['org-name-wrapper']}>
                                    <div className={styles['org-title-wrapper']}>
                                        <span className={styles['org-avatar']}>  </span>
                                        <h2 className={styles['org-name']}> Valmech </h2>
                                    </div>
                                    <button className={styles['aside-collapse']}>
                                        <ChevronDoubleLeftIcon/>
                                    </button>
                                </div>

                                <Separator/>
                                <ul className={s('feature-list nav-list')}>
                                    {features.map(f => (
                                        <li key={f.id} className={styles['item']}>
                                            <button
                                                onClick={() => setCurrentTab(f.id)}
                                                className={currentTab && currentTab === f.id ? styles['selected'] : ''}
                                                style={currentTab && currentTab === f.id ? { backgroundColor: scndThemeColor } : {}}
                                            >
                                                <span className={styles['icon']}> {f.icon} </span>
                                                <span className={styles['title']}> {f.name} </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <ul className={s('bottom-nav nav-list')}>
                                <Separator margin={0}/>
                                <li>
                                    <button
                                        className={s(currentTab === 'notifications' ? 'selected' : '')}
                                        onClick={() => setCurrentTab('notifications')}
                                    >
                                        <span className={styles['icon']}>
                                            <BellIcon />
                                        </span>
                                        <span className={styles['title']}>
                                            Notifications
                                        </span>
                                    </button>
                                </li>


                                <li>
                                    <button
                                        className={s(currentTab === 'help-and-services' ? 'selected' : '')}
                                        onClick={() => setCurrentTab('help-and-services')}
                                    >
                                        <span className={styles['icon']}>
                                            <Cog8ToothIcon />
                                        </span>
                                        <span className={styles['title']}>
                                            Help & Services
                                        </span>
                                    </button>
                                </li>

                                <li>
                                    <button
                                        className={s(currentTab === 'settings' ? 'selected' : '')}
                                        onClick={() => setCurrentTab('settings')}
                                    >
                                        <span className={styles['icon']}>
                                            <Cog8ToothIcon />
                                        </span>
                                        <span className={styles['title']}>
                                            Settings
                                        </span>
                                    </button>
                                </li>
                            </ul>
                            { /*
                            <div className={styles['user-info']}>
                                <div className={styles['left']}>
                                    <img alt="User avatar" src="default-avatar.png" />
                                    <div className={styles['user-desc']}>
                                        <span className={styles['user-desc-name']}> 十九 </span>
                                        <span className={styles['user-desc-email']}> cat@example.com </span>
                                    </div>
                                </div>
                                <EllipsisVerticalIcon className={styles['menu-icon']} />
                            </div>
                            */ }
                        </aside>
                        <div className={styles['section-page']}>
                            <div className={styles['background-image']} style={{ backgroundImage: `url(${selectedPersona.avatar})` }}></div>
                            <div className={styles['section-page-header']} style={{ backgroundColor: themeColor + 80 }}>
                                <span> {currentTab && currentTab} </span>
                                <div>
                                    <button className={styles['persona-dropdown']} onClick={() => setpersonaSelectionShow(true)}>
                                        <img alt="Persona avatar" src={selectedPersona.avatar} />
                                    </button>
                                    <div className={styles['persona-info']}>
                                        <div className={styles['persona-name']}> {selectedPersona.name} </div>
                                        <div className={styles['persona-hint']}> persona </div>
                                        <p className={styles['persona-description']}>
                                            {selectedPersona.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles['section-page-content']}>
                                {"TODO"}
                            </div>
                        </div>
                    </main>

                    { /* ---- persona selection overlay ---- */}
                    <div>
                        <div
                            className={`${styles['persona-selection-container']} ${personaSelectionShow ? styles['persona-selection-show'] : ''}`}
                            onClick={() => setpersonaSelectionShow(false)}
                        >
                            <h2 className={styles['persona-selection-title']}> Select Persona </h2>
                            <div className={styles['persona-list']}>
                                {personas.map((p: any) => (
                                    <div key={p.uuid}
                                        className={`${styles['persona-item']} ${p.uuid === selectedPersona.uuid ? styles['persona-item-selected'] : ""}`}
                                        onClick={() => handleSelectpersona(p)}
                                    >
                                        <img alt="Persona avatar" src={p.avatar} className={styles['persona-item-avatar']} />
                                        <p className={styles['persona-item-name']}>{p.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    { /* ---- end ---- */}

                </div>
                <Titlebar />
            </PersonaContext.Provider>
        </>
    )
}

export default Home;
