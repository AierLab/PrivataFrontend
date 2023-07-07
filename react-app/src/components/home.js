import React, {useState, useEffect} from "react";
// import { IpcRenderer } from "electron";
import styles from "./home.module.css"
import { useNavigate } from "react-router-dom";
import { ChatBubbleLeftRightIcon, MusicalNoteIcon, PaintBrushIcon, EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { PersonaContext } from "../contexts/persona";
import Chat from "./features/chat";

import Titlebar from './Titlebar'

const Home = () => {    
    const goTo = useNavigate()
    const features = [
        { id: 'chat', name: "Chat", icon: <ChatBubbleLeftRightIcon />, element: <Chat /> },
        { id: 'sing', name: "Sing", icon: <MusicalNoteIcon/> },
        { id: 'dance', name: "Dance", icon: <MusicalNoteIcon/> },
        { id: 'content-creation', name: "Content Creation", icon: <PaintBrushIcon /> },
    ]

    const personas = [
        { id: 'bochhi', name: 'Bocchi', desc: 'Hitori Gotou is a guitar player playing for the Kessoku Band.', avatar: 'https://ih1.redbubble.net/image.4489882707.9846/st,small,507x507-pad,600x600,f8f8f8.jpg' },
        { id: 'kita', name: 'Kita', desc: 'Kita Ikuyo is a singer working for Kessoku Band.', avatar: 'https://avatarfiles.alphacoders.com/343/343115.png' },
        { id: 'nijika', name: 'Nijika', desc: 'Nijika Ijichi is a drummer at Kessoku Band.', avatar: 'https://i.pinimg.com/originals/d7/f3/19/d7f319490dd5b677a85389e5b59cee09.jpg' },
        { id: 'ryo', name: 'Ryo', desc: 'Ryo Yamada is in her second year at Shimokitazawa High School and is the bassist of the band, Kessoku Band.', avatar: 'https://i.pinimg.com/736x/1b/88/92/1b8892d1ee65e258a2ce7804f52c5f9a.jpg' },
    ]

    const [selectedFeature,  setSelectedFeature]  = useState(null)
    const [selectedPersona, setSelectedPersona] = useState(personas[0])

    const [isContextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });



    const [personaSelectionShow, setpersonaSelectionShow] = useState(false)

    const handleSelectpersona = (p) => {
        setpersonaSelectionShow(false)
        setSelectedPersona(p)
    }

    const handleContextMenu = (event) => {
        if (isContextMenuOpen===false){
            setContextMenuOpen(true);
            var element = document.getElementById(styles['menu-icon'])
            
            setContextMenuPosition({ x: element.getBoundingClientRect().left, y: element.getBoundingClientRect().bottom });
        }
      };

    
    const handleMenuOptionClick1 = () => {
        setContextMenuOpen(false);
        goTo('/userInfo');
    // Handle the selected option logic here
    };
    const handleMenuOptionClick2 = () => {
        setContextMenuOpen(false);
        goTo('/settings')
        // Handle the selected option logic here
        };

    
    // const handleMouseLeaveMenu = () =>{
    //     console.log("the button is ",leaveMenuButton)
    //     console.log("the menu is ", leaveMenu)
    //     setTimeout(()=>{
    //         if (!leaveMenu && !leaveMenuButton){
                
    //             setContextMenuOpen(false);
    //         }
            
    //     },500)
        
    // }

    // useEffect(()=>handleMouseLeaveMenu,[leaveMenu,leaveMenuButton])

    



    
        
    

    return(
        <>
        <Titlebar />
            
            <PersonaContext.Provider value={{ persona: selectedPersona }}>
                
                <main className={styles['container']}>
                   
                    <aside className={styles['feature-list-aside']}>
                        <div>
                            <h3 className={styles['application-title']}> Privata </h3>
                            <ul className={styles['feature-list']}>
                                { features.map(f => (
                                    <li key={f.id}>
                                        <button
                                            onClick={() => setSelectedFeature(f)}
                                            className={ selectedFeature && selectedFeature.id === f.id ? styles['selected'] : '' }
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
                            <EllipsisVerticalIcon id={styles['menu-icon']} className={styles['menu-icon']} onMouseOver={() => handleContextMenu()} />
                        </div>
                    </aside>
                    <div className={styles['section-page']}>
                        <div className={styles['section-page-header']}>
                            
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

                {isContextMenuOpen && (
                    <ul
                        className={styles["context-menu"]}
                        style={{ left: contextMenuPosition.x-30, top: contextMenuPosition.y-90, zIndex: 8000}}
                        onMouseLeave={()=>setContextMenuOpen(false)}
                        // onMouseOver={()=>handleMouseOverMenu()}
                    >
                        <li onClick={()=>handleMenuOptionClick1()}>View Information</li>
                        <li onClick={handleMenuOptionClick2}>Settings</li>
                    </ul>
                )}

                { /* ---- persona selection overlay ---- */ }
                <div
                    className={`${styles['persona-selection-container']} ${personaSelectionShow ? styles['persona-selection-show'] : ''}`}
                    onClick={() => setpersonaSelectionShow(false)}
                >
                    <h2 className={styles['persona-selection-title']}> Select Persona </h2>
                    <div className={styles['persona-list']}>
                        { personas.map(p => (
                            <div key={p.id}
                                className={`${styles['persona-item']} ${p.id === selectedPersona.id ? styles['persona-item-selected'] : ""}`}
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
