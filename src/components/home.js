import React, {useState} from "react";
// import { IpcRenderer } from "electron";
import styles from "./home.module.css"

import { XMarkIcon, MinusIcon, ChatBubbleLeftRightIcon, MusicalNoteIcon, PaintBrushIcon } from "@heroicons/react/20/solid"

const Home = () => {    
    

    const features = [
        { id: 'chat', name: "Chat", icon: <ChatBubbleLeftRightIcon /> },
        { id: 'sing', name: "Sing", icon: <MusicalNoteIcon/> },
        { id: 'dance', name: "Dance", icon: <MusicalNoteIcon/> },
        { id: 'content-creation', name: "Content Creation", icon: <PaintBrushIcon /> },
    ]

    const [selectedFeature, setSelectedFeature] = useState(null)
    
    return(
        <>    
           <main className={styles['container']}>
                <aside className={styles['feature-list-aside']}>
                    <div>
                        <h3 className={styles['application-title']}> Privata </h3>
                        <ul className={styles['feature-list']}>
                            { features.map(f => (
                                <li key={f.id}>
                                    <button
                                        onClick={() => setSelectedFeature(f)}
                                        className={ selectedFeature && selectedFeature.id == f.id ? styles['selected'] : '' }
                                    >
                                        <span className={styles['feature-icon']}> { f.icon } </span>
                                        <span className={styles['feature-name']}> { f.name } </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles['user-info']}>
                        <img src="/default-avatar.png" />
                        <div className={styles['user-desc']}>
                            <span className={styles['user-desc-name']}> 十九 </span>
                            <span className={styles['user-desc-email']}> cat@example.com </span>
                        </div>
                    </div>
                </aside>
                <div className={styles['section-page']}>
                    <div className={styles['section-page-header']}>
                        <span> { selectedFeature && selectedFeature.name } </span>
                        <div>
                            <button className={styles['personal-dropdown']}>
                                <img src='https://i.pinimg.com/originals/d2/2a/9a/d22a9a0c9427b807a3333ae9098d0717.jpg'/>
                            </button>
                            <div className={styles['personal-info']}>
                                <div className={styles['personal-name']}> Bocchi </div>
                                <div className={styles['personal-hint']}> Personal </div>
                                <p className={styles['personal-description']}>
                                    Hitori Gotou is a guitar player playing for the Kessoku Band.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles['section-page-content']}>
                        TODO
                    </div>
                </div>
            </main>
        </>
    )
}

export default Home;
