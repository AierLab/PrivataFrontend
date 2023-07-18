import React, {ReactElement, useState, useContext, useEffect} from "react";
import extractColors, { extractColorsFromImageData, extractColorsFromSrc } from "extract-colors";
import styles from "./home.module.css"

import { ChatBubbleLeftRightIcon, MusicalNoteIcon, PaintBrushIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import Chat from "./features/chat";
import { SecurityKeyContext } from "contexts/securityKey";

import Titlebar from 'components/Titlebar'
import { Persona, PersonaContextType } from "../@types/persona";
import { PersonaContext } from "contexts/persona";

interface Feature {
    id: string,
    name: string,
    icon: ReactElement,
    element?: ReactElement,
};

const Home = () => {    
    const features: Feature[] = [
        { id: 'chat', name: "Chat", icon: <ChatBubbleLeftRightIcon />, element: <Chat /> },
        { id: 'sing', name: "Sing", icon: <MusicalNoteIcon/> },
        { id: 'dance', name: "Dance", icon: <MusicalNoteIcon/> },
        { id: 'content-creation', name: "Content Creation", icon: <PaintBrushIcon /> },
    ]

    const verificationResult = useContext(SecurityKeyContext)
    if (verificationResult.status==="noKey"){
        
    }

    const personas = verificationResult.status==="verified"?(verificationResult.manifest as SecurityKeyManifestV1).personas:[{uuid:"", name:"", desc:"", avatar:"default-avatar.png",features:[],compatibility:""}]
    // const personas: Persona[] = [
    //     { id: 'bochhi', name: 'Bocchi', desc: 'Hitori Gotou is a guitar player playing for the Kessoku Band.', avatar: 'https://ih1.redbubble.net/image.4489882707.9846/st,small,507x507-pad,600x600,f8f8f8.jpg' },
    //     { id: 'kita', name: 'Kita', desc: 'Kita Ikuyo is a singer working for Kessoku Band.', avatar: 'https://avatarfiles.alphacoders.com/343/343115.png' },
    //     { id: 'nijika', name: 'Nijika', desc: 'Nijika Ijichi is a drummer at Kessoku Band.', avatar: 'https://i.pinimg.com/originals/d7/f3/19/d7f319490dd5b677a85389e5b59cee09.jpg' },
    //     { id: 'ryo', name: 'Ryo', desc: 'Ryo Yamada is in her second year at Shimokitazawa High School and is the bassist of the band, Kessoku Band.', avatar: 'https://i.pinimg.com/736x/1b/88/92/1b8892d1ee65e258a2ce7804f52c5f9a.jpg' },
    // ]

    const [selectedFeature,      setSelectedFeature]      = useState<Feature | null>(null)
    const [selectedPersona,      setSelectedPersona]      = useState(personas[0])
    const [personaSelectionShow, setpersonaSelectionShow] = useState<boolean>(false)
    const [themeColor, setThemeColor] = useState('white')
    const [scndThemeColor, setScndThemeColor] = useState('#39c5bb')

    const handleSelectpersona = (p:Persona) => {
        setpersonaSelectionShow(false)
        setSelectedPersona(p)
        extractColorsFromSrc(p.avatar).then((value) => {
            console.log(value)
            setThemeColor(value[value.length-1].hex)
            setScndThemeColor(value[value.length-4].hex)
        })
    }



    return(
        <>
            <PersonaContext.Provider value={{ persona: selectedPersona }}>
                <main className={styles['container']} >
                    <aside className={styles['feature-list-aside']}style={{backgroundColor:themeColor}}>
                        <div>
                            <h3 className={styles['application-title']}> Privata </h3>
                            <ul className={styles['feature-list']}>
                                { features.map(f => (
                                    <li key={f.id}>
                                        <button
                                            onClick={() => setSelectedFeature(f)}
                                            className={ selectedFeature && selectedFeature.id === f.id ? styles['selected'] : '' }
                                            style={selectedFeature && selectedFeature.id === f.id ? {backgroundColor: scndThemeColor }:{}}
                                        >
                                            <span className={styles['feature-icon']}> { f.icon } </span>
                                            <span className={styles['feature-name']}> { f.name } </span>
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
                        <div className={styles['background-image']} style={{backgroundImage: `url(${selectedPersona.avatar})`}}></div>
                        <div className={styles['section-page-header']} style={{backgroundColor:themeColor+80}}>
                            <Titlebar />
                            <span> { selectedFeature && selectedFeature.name } </span>
                            <div>
                                <button className={styles['persona-dropdown']} onClick={() => setpersonaSelectionShow(true)}>
                                    <img alt="Persona avatar" src={selectedPersona.avatar} />
                                </button>
                                <div className={styles['persona-info']}>
                                    <div className={styles['persona-name']}> { selectedPersona.name } </div>
                                    <div className={styles['persona-hint']}> persona </div>
                                    <p className={styles['persona-description']}>
                                        { selectedPersona.desc }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles['section-page-content']}>
                            { selectedFeature && selectedFeature.element ? selectedFeature.element : "TODO" }
                        </div>
                    </div>
                </main>

                { /* ---- persona selection overlay ---- */ }
                <div
                    className={`${styles['persona-selection-container']} ${personaSelectionShow ? styles['persona-selection-show'] : ''}`}
                    onClick={() => setpersonaSelectionShow(false)}
                >
                    <h2 className={styles['persona-selection-title']}> Select Persona </h2>
                    <div className={styles['persona-list']}>
                        { personas.map(p => (
                            <div key={p.uuid}
                                className={`${styles['persona-item']} ${p.uuid === selectedPersona.uuid ? styles['persona-item-selected'] : ""}`}
                                onClick={() => handleSelectpersona(p)}
                            >
                                <img alt="Persona avatar" src={p.avatar} className={styles['persona-item-avatar']} />
                                <p className={styles['persona-item-name']}>{ p.name }</p>
                            </div>
                        ))}
                    </div>
                </div>
                { /* ---- end ---- */ }
            </PersonaContext.Provider>
        </>
    )
}

export default Home;
