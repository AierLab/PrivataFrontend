import React, {useState} from "react";
// import { IpcRenderer } from "electron";
import styles from "./home.module.css"

import { XMarkIcon, MinusIcon, ChatBubbleLeftRightIcon, MusicalNoteIcon, PaintBrushIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid"

const Home = () => {    
    const handleMinimizeClick = () =>{
        const appContainer = document.getElementById(styles.app);
        appContainer.classList.add(styles.minimized);
        setTimeout(() =>{
            appContainer.classList.remove(styles.minimized);
            window.api.minimizeWindow();
        },200)
        
    }
    const handleCloseClick = () =>{
        const appContainer = document.getElementById(styles.app);
        appContainer.classList.add(styles.closed);
        setTimeout(() => {
            window.api.closeWindow();
          }, 200); 
        
    }

    const features = [
        { id: 'chat', name: "Chat", icon: <ChatBubbleLeftRightIcon /> },
        { id: 'sing', name: "Sing", icon: <MusicalNoteIcon/> },
        { id: 'dance', name: "Dance", icon: <MusicalNoteIcon/> },
        { id: 'content-creation', name: "Content Creation", icon: <PaintBrushIcon /> },
    ]

    const personals = [
        { id: 'bochhi', name: 'Bocchi', desc: 'Hitori Gotou is a guitar player playing for the Kessoku Band.', avatar: 'https://ih1.redbubble.net/image.4489882707.9846/st,small,507x507-pad,600x600,f8f8f8.jpg' },
        { id: 'kita', name: 'Kita', desc: 'Kita Ikuyo is a singer working for Kessoku Band.', avatar: 'https://avatarfiles.alphacoders.com/343/343115.png' },
        { id: 'nijika', name: 'Nijika', desc: 'Nijika Ijichi is a drummer at Kessoku Band.', avatar: 'https://i.pinimg.com/originals/d7/f3/19/d7f319490dd5b677a85389e5b59cee09.jpg' },
        { id: 'ryo', name: 'Ryo', desc: 'Ryo Yamada is in her second year at Shimokitazawa High School and is the bassist of the band, Kessoku Band.', avatar: 'https://i.pinimg.com/736x/1b/88/92/1b8892d1ee65e258a2ce7804f52c5f9a.jpg' },
    ]

    const [selectedFeature,  setSelectedFeature]  = useState(null)
    const [selectedPersonal, setSelectedPersonal] = useState(personals[0])

    const [personalSelectionShow, setPersonalSelectionShow] = useState(false)

    const handleSelectPersonal = (p) => {
        setPersonalSelectionShow(false)
        setSelectedPersonal(p)
    }
    
    return(
        <>    
            <div className={styles['window-interactions']}>
                <div className={styles['minimize']} onClick={handleMinimizeClick}>
                    <MinusIcon className={styles['window-interact-icon']}/>
                </div>
                <div className={styles['close']} onClick={handleCloseClick}>
                    <XMarkIcon className={styles['window-interact-icon']}/>
                </div>
            </div>
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
                        <div className={styles['left']}>
                            <img src="/default-avatar.png" />
                            <div className={styles['user-desc']}>
                                <span className={styles['user-desc-name']}> 十九 </span>
                                <span className={styles['user-desc-email']}> cat@example.com </span>
                            </div>
                        </div>
                        <EllipsisVerticalIcon className={styles['menu-icon']} />
                    </div>
                </aside>
                <div className={styles['section-page']}>
                    <div className={styles['section-page-header']}>
                        <span> { selectedFeature && selectedFeature.name } </span>
                        <div>
                            <button className={styles['personal-dropdown']} onClick={() => setPersonalSelectionShow(true)}>
                                <img src={selectedPersonal.avatar} />
                            </button>
                            <div className={styles['personal-info']}>
                                <div className={styles['personal-name']}> { selectedPersonal.name } </div>
                                <div className={styles['personal-hint']}> Personal </div>
                                <p className={styles['personal-description']}>
                                    { selectedPersonal.desc }
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles['section-page-content']}>
                        TODO
                    </div>
                </div>
            </main>

            { /* ---- personal selection overlay ---- */ }
            <div
                className={`${styles['personal-selection-container']} ${personalSelectionShow ? styles['personal-selection-show'] : ''}`}
                onClick={() => setPersonalSelectionShow(false)}
            >
                <h2 className={styles['personal-selection-title']}> Select personal </h2>
                <div className={styles['personal-list']}>
                    { personals.map(p => (
                        <div key={p.id}
                            className={`${styles['personal-item']} ${p.id == selectedPersonal.id ? styles['personal-item-selected'] : ""}`}
                            onClick={() => handleSelectPersonal(p)}
                        >
                            <img src={p.avatar} className={styles['personal-item-avatar']} />
                            <p className={styles['personal-item-name']}>{ p.name }</p>
                        </div>
                    ))}
                </div>
            </div>
            { /* ---- end ---- */ }
        </>
    )
}

export default Home;
