import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom"
// import { IpcRenderer } from "electron";
import styles from "./settings.module.css"

import { XMarkIcon, MinusIcon, ChatBubbleLeftRightIcon, MusicalNoteIcon, EllipsisVerticalIcon,ArrowLeftIcon} from "@heroicons/react/20/solid"
import { PaintBrushIcon } from "@heroicons/react/24/outline";
import Titlebar from "./Titlebar";


const Settings = () => {
    const navigate = useNavigate()
    const settings = [{id: 'appearance', name:'Appearance', icon: <PaintBrushIcon />}]


    const [show, setShow] = useState(true)
    const [selectedSetting, setSelectedSetting] = useState(null)


    const handleBackClick = () => {
        setShow(false)
        setTimeout(() =>{
            navigate(-1)
        },300)
        
    }


    return (
        <>
            <Titlebar />
            <div className={show? styles['container']: styles['fade-out']}>
                <aside className={styles["settings-list-aside"]}> 
                    <div className={styles['back-container']}>
                        <div className={styles['back']} onClick={handleBackClick}><ArrowLeftIcon />   </div>
                    </div>
                    <div className={styles['list-container']}>
                        <h3 className={styles['application-title']}> Privata </h3>
                        <ul className={styles['settings-list']}>
                            { settings.map(f => (
                                <li key={f.id}>
                                    <button
                                        onClick={() => setSelectedSetting(f)}
                                        className={ selectedSetting && selectedSetting.id === f.id ? styles['selected'] : '' }
                                    >
                                        <span className={styles['setting-icon']}> { f.icon } </span>
                                        <span className={styles['setting-name']}> { f.name } </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                
                </aside>
            </div>

            
        
        </>
    )
}

export default Settings