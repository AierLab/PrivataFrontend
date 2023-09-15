import { ReactElement, useState } from "react";
import styles from "./home.module.css"

import Chat from "pages/features/chat";

import Titlebar from 'components/Titlebar'
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
        { id: 'reports-review', name: "文件审核", icon: <ChatBubbleLeftRightIcon />, element: <Chat /> },
        { id: 'quan-eval', name: "自动评分", icon: <MusicalNoteIcon /> },
    ]

    const s = modulize(styles)

    const [currentTab, setCurrentTab] = useState<string | null>(null)
    const [navCollapsed, setNavCollapsed] = useState(false)

    const navCollapseVariants: Variants = {
        collapsed: { width: '4.25rem', transition: { ease: 'circOut', duration: 0.2 }},
        normal: { width: '17.5rem', transition: { ease: 'circOut', duration: 0.2 }}
    }
    const collapseButtonVariants: Variants = {
        collapsed: { rotate: '180deg', transition: { ease: 'circOut', duration: 0.2 }},
        normal: { rotate: '0deg', transition: { ease: 'circOut', duration: 0.2 }}
    }
    const navListTitleVariants: Variants = {
        collapsed: { opacity: 0, transition: { duration: 0.1 } },
        normal: { opacity: 1, transition: { duration: 0.1 } },
    }
    const navListItemVariants: Variants = {
        collapsed: { paddingLeft: '0.5rem', paddingRight: '0.5rem', transition: { duration: 0.2 } },
        normal: { paddingLeft: '1rem', paddingRight: '1rem', transition: { duration: 0.2 } },
    }
    const orgNameVariants: Variants = {
        collapsed: { opacity: 0, transition: { duration: 0.2 } },
        normal: { opacity: 1, transition: { duration: 0.2 } },
    }

    return (
        <>
            <div className={styles['container']}>
                <main className={styles['content-wrapper']} >
                    <motion.aside
                        className={s('nav')}
                        variants={navCollapseVariants}
                        initial='normal'
                        animate={navCollapsed ? 'collapsed' : 'normal'}
                    >
                        <div>
                            <div className={styles['org-info-wrapper']}>
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
                                            variants={navListItemVariants}
                                        >
                                            <span className={styles['icon']}> {f.icon} </span>
                                            <motion.span
                                                className={styles['title']}
                                                variants={navListTitleVariants}
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
                                        通知
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
                                        帮助
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
                                        设置
                                    </motion.span>
                                </motion.button>
                            </li>
                        </ul>
                    </motion.aside>
                    <div className={styles['section-page']}>
                        <div className={styles['section-page-header']}>
                            <Titlebar />
                            <div className={s('section-tab-list')}>
                                { /* use https://www.radix-ui.com/primitives/docs/components/tabs instead */ }
                                <button>
                                    工作区
                                </button>
                                <button>
                                    文件管理
                                </button>
                                <Separator vertical={true}/>
                                <MagnifyingGlassIcon className='h-6 w-6'/>

                            </div>
                            <button className={styles['user-avatar']}>
                                <img draggable="false" alt="User Avatar" src="default-avatar.png"/>
                            </button>
                        </div>
                        <div className={styles['section-page-content']}>
                            {"TODO"}
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default Home;
