import React, {useState} from "react";
import {useNavigate} from "react-router-dom"
// import { IpcRenderer } from "electron";
import styles from "./userInfo.module.css"

import { XMarkIcon, MinusIcon, ChatBubbleLeftRightIcon, MusicalNoteIcon, PaintBrushIcon, EllipsisVerticalIcon,ArrowLeftIcon} from "@heroicons/react/20/solid"


const UserInfo = () => {
    const navigate = useNavigate()
    const [isEditMode, setEditMode] = useState(false)
    const [usernameInput, setUsernameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [bdayInput, setBDayInput] = useState('')

    const [username, setUsername] = useState('十九')
    const [email, setEmail] = useState('cat@example.com')
    const [bday, setBDay] = useState('1111.11.11')

    
    const handleEditClick = () => {
        setEditMode(true)
    }

    const handleFinishClick = () => {
        setUsername(usernameInput)
        setEmail(emailInput)
        setBDay(bdayInput)
        setEditMode(false);
    }

    return(
        <>
            {/* ---- user info overlay ----*/}
            <div 
                className={styles['user-info-container']} > 
                <div className={styles['profile-photo-wrap']}>
                    <img src="/default-avatar.png" />
                    <h1>{username}</h1>
                </div>    
                <div className={styles["text-info-wrap"]}>
                    <div className={styles['info']}> 
                        <span>Username: </span> 
                        <span>E-mail Address:</span>
                        <span>Birthday:</span>
                    </div>
                    <div className={isEditMode ?  styles['no-display']: styles['details'] }>
                        <span>{username}</span>
                        <span>{email}</span>
                        <span>{bday}</span>
                    </div> 
                    <div className={isEditMode ? styles['input-details'] : styles['no-display']}>
                        <input type="text" placeholder="Username" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}/>
                        <input type="text" placeholder="Email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
                        <input type="text" placeholder="date" value={bdayInput} onChange={(e) => setBDayInput(e.target.value)}/>
                    </div> 
                </div>
                
                
            </div>
            {/* ---- end ---- */}

            <div className={styles['back-container']}>
                <div className={styles['back']} onClick={()=>navigate(-1)}><ArrowLeftIcon />   </div>
            </div>

            <div className={isEditMode? styles['no-display']:styles['button']} onClick={handleEditClick}><div>Edit</div></div>
            <div className={isEditMode? styles['button'] : styles['no-display']} onClick={handleFinishClick}><div>Finish</div></div>
                
                     
        </>
    )
}

export default UserInfo