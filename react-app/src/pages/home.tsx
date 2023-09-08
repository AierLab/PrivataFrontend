import { ReactElement, useState, useContext } from "react";
import { extractColorsFromSrc } from "extract-colors";
import styles from "./home.module.css"

import Chat from "./features/chat";
import { SecurityKeyContext } from "contexts/securityKey";

import Titlebar from 'components/Titlebar'
import { Persona } from "types/persona";
import { PersonaContext } from "contexts/persona"

import { SecurityKeyManifestV1 } from '@privata/types/security-key'
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid"
import Separator from "components/Separator"
import { BellIcon, Cog8ToothIcon, ChatBubbleLeftRightIcon, MusicalNoteIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { modulize } from "utils/classNames";

import { motion, Variants } from "framer-motion"

interface Feature {
    id: string,
    name: string,
    icon: ReactElement,
    element?: ReactElement,
};

const Home = () => {
    const features: Feature[] = [
        { id: 'reports-review', name: "Reports Review", icon: <ChatBubbleLeftRightIcon />, element: <Chat /> },
        { id: 'quan-eval', name: "Quantitative Evaluation", icon: <MusicalNoteIcon /> },
        { id: 'design-plans', name: "Design Plans", icon: <MusicalNoteIcon /> },
    ]

    const s = modulize(styles)

    const verificationResult = useContext(SecurityKeyContext)

    const personas = verificationResult.status === "verified" ? (verificationResult.manifest as SecurityKeyManifestV1).personas : [{ uuid: "", name: "", desc: "", avatar: "default-avatar.png", features: [], compatibility: "" }]

    const [currentTab, setCurrentTab] = useState<string | null>(null)
    const [selectedPersona, setSelectedPersona] = useState(personas[0])
    const [personaSelectionShow, setpersonaSelectionShow] = useState<boolean>(false)
    const [themeColor, setThemeColor] = useState('white')
    const [scndThemeColor, setScndThemeColor] = useState('#39c5bb')

    const [navCollapsed, setNavCollapsed] = useState(false)

    const handleSelectpersona = (p: Persona) => {
        setpersonaSelectionShow(false)
        setSelectedPersona(p)
        extractColorsFromSrc(p.avatar).then((value: any[]) => {
            setThemeColor(value[value.length - 1].hex)
            setScndThemeColor(value[value.length - 4].hex)
        })
    }

    const navCollapseVariants: Variants = {
        collapsed: { width: '4.25rem', transition: { ease: 'circOut' }},
        normal: { width: '17.5rem', transition: { ease: 'circOut' }}
    }
    const collapseButtonVariants: Variants = {
        collapsed: { rotate: '180deg', transition: { ease: 'circOut' }},
        normal: { rotate: '0deg', transition: { ease: 'circOut' }}
    }
    const navListTitleVariants: Variants = {
        collapsed: { opacity: 0 },
        normal: { opacity: 1 },
    }
    const navListItemVariants: Variants = {
        collapsed: { paddingLeft: '0.5rem', paddingRight: '0.5rem' },
        normal: { paddingLeft: '1rem', paddingRight: '1rem' },
    }
    const orgNameVariants: Variants = {
        collapsed: { opacity: 0 },
        normal: { opacity: 1 },
    }

    return (
        <>
            <PersonaContext.Provider value={{ persona: selectedPersona }}>
                <div className={styles['container']}>
                    <main className={styles['content-wrapper']} >
                        <motion.aside
                            className={s('nav')}
                            /* style={{ backgroundColor: themeColor }} */
                            variants={navCollapseVariants}
                            initial='collapsed'
                            animate={navCollapsed ? 'collapsed' : 'normal'}
                        >
                            <div>
                                <div className={styles['org-name-wrapper']}>
                                    <motion.div
                                        className={styles['org-title-wrapper']}
                                        variants={orgNameVariants}
                                    >
                                        <span className={styles['org-avatar']}>  </span>
                                        <h2 className={styles['org-name']}> Valmech </h2>
                                    </motion.div>
                                    <button className={s('aside-collapse')} onClick={() => setNavCollapsed(c => !c)}>
                                        <motion.span className="block" variants={collapseButtonVariants}>
                                            <ChevronDoubleLeftIcon />
                                        </motion.span>
                                    </button>
                                </div>

                                <Separator />
                                <ul className={s('feature-list nav-list')}>
                                    {features.map(f => (
                                        <li key={f.id} className={styles['item']}>
                                            <motion.button
                                                onClick={() => setCurrentTab(f.id)}
                                                className={currentTab && currentTab === f.id ? styles['selected'] : ''}
                                                style={currentTab && currentTab === f.id ? { backgroundColor: scndThemeColor } : {}}
                                                variants={navListItemVariants}
                                            >
                                                <span className={styles['icon']}> {f.icon} </span>
                                                <motion.span
                                                    className={styles['title']}
                                                    variants={navListTitleVariants}
                                                    transition={{ duration: 0.1 }}
                                                >
                                                    {f.name}
                                                </motion.span>
                                            </motion.button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <ul className={s('bottom-nav nav-list')}>
                                <Separator margin={0} />
                                <li>
                                    <motion.button
                                        className={s(currentTab === 'notifications' ? 'selected' : '')}
                                        onClick={() => setCurrentTab('notifications')}
                                        variants={navListItemVariants}
                                    >
                                        <span className={styles['icon']}>
                                            <BellIcon />
                                        </span>
                                        <motion.span
                                            className={s('title')}
                                            variants={navListTitleVariants}
                                        >
                                            Notifications
                                        </motion.span>
                                    </motion.button>
                                </li>


                                <li>
                                    <motion.button
                                        className={s(currentTab === 'help-and-services' ? 'selected' : '')}
                                        onClick={() => setCurrentTab('help-and-services')}
                                        variants={navListItemVariants}
                                    >
                                        <span className={styles['icon']}>
                                            <Cog8ToothIcon />
                                        </span>
                                        <motion.span
                                            className={s('title')}
                                            variants={navListTitleVariants}
                                        >
                                            Help & Services
                                        </motion.span>
                                    </motion.button>
                                </li>

                                <li>
                                    <motion.button
                                        className={s(currentTab === 'settings' ? 'selected' : '')}
                                        onClick={() => setCurrentTab('settings')}
                                        variants={navListItemVariants}
                                    >
                                        <span className={styles['icon']}>
                                            <Cog8ToothIcon />
                                        </span>
                                        <motion.span
                                            className={s('title')}
                                            variants={navListTitleVariants}
                                        >
                                            Settings
                                        </motion.span>
                                    </motion.button>
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
                        </motion.aside>
                        <div className={styles['section-page']}>
                            { /* <div className={styles['background-image']} style={{ backgroundImage: `url(${selectedPersona.avatar})` }}></div> */}
                            <div className={styles['section-page-header']} /* style={{ backgroundColor: themeColor + 80 }} */>
                                <Titlebar />
                                <div className={s('section-tab-list')}>
                                    { /* use https://www.radix-ui.com/primitives/docs/components/tabs instead */ }
                                    <button>
                                        Workspace
                                    </button>
                                    <button>
                                        Documents
                                    </button>
                                    <button>
                                        Dashboard
                                    </button>
                                    <Separator vertical={true}/>
                                    <MagnifyingGlassIcon className='h-6 w-6'/>

                                </div>
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
            </PersonaContext.Provider>
        </>
    )
}

export default Home;
