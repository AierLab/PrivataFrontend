import React, { ReactElement, useState, useContext } from "react";
import { extractColorsFromSrc } from "extract-colors";
import styles from "./home.module.css"

import { ChatBubbleLeftRightIcon, MusicalNoteIcon, PaintBrushIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import Chat from "./features/chat";
import { SecurityKeyContext } from "contexts/securityKey";

import Titlebar from 'components/Titlebar'
import { Persona } from "types/persona";
import { PersonaContext } from "contexts/persona";

import { SecurityKeyManifestV1 } from '@privata/types/security-key'
import { ChevronDoubleLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";

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

    const verificationResult = useContext(SecurityKeyContext)

    const personas = verificationResult.status === "verified" ? (verificationResult.manifest as SecurityKeyManifestV1).personas : [{ uuid: "", name: "", desc: "", avatar: "default-avatar.png", features: [], compatibility: "" }]

    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
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
                        <aside className={styles['feature-list-aside']} style={{ backgroundColor: themeColor }}>
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

                                <div className={styles['aside-devider']}></div>
                                <ul className={styles['feature-list']}>
                                    {features.map(f => (
                                        <li key={f.id}>
                                            <button
                                                onClick={() => setSelectedFeature(f)}
                                                className={selectedFeature && selectedFeature.id === f.id ? styles['selected'] : ''}
                                                style={selectedFeature && selectedFeature.id === f.id ? { backgroundColor: scndThemeColor } : {}}
                                            >
                                                <span className={styles['feature-icon']}> {f.icon} </span>
                                                <span className={styles['feature-name']}> {f.name} </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
                        </aside>
                        <div className={styles['section-page']}>
                            <div className={styles['background-image']} style={{ backgroundImage: `url(${selectedPersona.avatar})` }}></div>
                            <div className={styles['section-page-header']} style={{ backgroundColor: themeColor + 80 }}>
                                <span> {selectedFeature && selectedFeature.name} </span>
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
                                {selectedFeature && selectedFeature.element ? selectedFeature.element : "TODO"}
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
