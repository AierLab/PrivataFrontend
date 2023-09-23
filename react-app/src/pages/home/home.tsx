import { ReactElement, useCallback, useState } from "react"
import styles from "./home.module.css"

import * as Tabs from '@radix-ui/react-tabs'
import * as Dialog from '@radix-ui/react-dialog'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import Titlebar from 'components/Titlebar'
import Separator from "components/Separator"

import {
    BellIcon,
    Cog8ToothIcon,
    ChatBubbleLeftRightIcon,
    MusicalNoteIcon,
    MagnifyingGlassIcon,
    ChevronDoubleLeftIcon,
    FolderIcon,
    UserIcon,
    BriefcaseIcon,
    UsersIcon,
    XMarkIcon
} from "@heroicons/react/24/outline"
import { modulize } from "utils/classNames"
import { motion, Variants } from "framer-motion"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useQueryItem } from "utils/useQueryItem"
import FileCard from "components/FileCard/index"

type TabIDs = 'reports-review' | 'quan-eval'
type DialogIDs = 'notifications' | 'help' | 'settings' | 'search' | null
type WorkspaceIDs = 'workspace' | 'file-management'
interface Feature {
    id: TabIDs,
    name: string,
    icon: ReactElement,
    element?: ReactElement,
}

interface Workspace {
    affiniate: TabIDs
    id: WorkspaceIDs
    name: string
}

interface URLParams {
    tab: TabIDs,
    workspace: WorkspaceIDs
}

const Home = () => {
    const features: Feature[] = [
        { id: 'reports-review', name: "文件审核", icon: <ChatBubbleLeftRightIcon /> },
        { id: 'quan-eval', name: "自动评分", icon: <MusicalNoteIcon /> },
    ]
    const workspaces: Workspace[] = [
        { affiniate: 'reports-review', id: 'workspace', name: '工作区' },
        { affiniate: 'reports-review', id: 'file-management', name: '文件管理' },
    ]

    const s = modulize(styles)

    let { tab: currentTab, workspace: currentWorkspace } = useParams() as any as URLParams
    if (!currentTab) currentTab = 'reports-review'
    if (!currentWorkspace) currentWorkspace = 'workspace'

    const [query] = useSearchParams()
    const [dialog, setDialog] = useState<DialogIDs>(null)
    const [navCollapsed, setNavCollapsedValue] = useQueryItem('navCollapsed')
    const [historyFileOpen, setHistoryFileOpen] = useQueryItem('historyFileOpen')

    const goto = useNavigate()

    const setTab = (tab: TabIDs) => {
        goto({ pathname: `/home/${tab}`, search: query.toString() })
    }
    const setWorkspace = useCallback((workspace: WorkspaceIDs) => {
        goto({ pathname: `/home/${currentTab}/${workspace}`, search: query.toString() })
    }, [goto, query, currentTab])
    const setNavCollapsed = (collapsed: boolean) => {
        setNavCollapsedValue(collapsed ? 'true' : null)
    }

    const navCollapseVariants: Variants = {
        collapsed: { width: '4.25rem', transition: { ease: 'circOut', duration: 0.2 } },
        normal: { width: '17.5rem', transition: { ease: 'circOut', duration: 0.2 } }
    }
    const collapseButtonVariants: Variants = {
        collapsed: { rotate: '180deg', transition: { ease: 'circOut', duration: 0.2 } },
        normal: { rotate: '0deg', transition: { ease: 'circOut', duration: 0.2 } }
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
                                <button className={s('aside-collapse')} onClick={() => setNavCollapsed(!navCollapsed)}>
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
                                            onClick={() => setTab(f.id)}
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
                                    onClick={() => setDialog('notifications')}
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
                                    onClick={() => setDialog('help')}
                                    variants={navListItemVariants}
                                >
                                    <span className={styles['icon']}>
                                        <Cog8ToothIcon />
                                    </span>
                                    <motion.span
                                        onClick={() => setDialog('help')}
                                        className={s('title')}
                                        variants={navListTitleVariants}
                                    >
                                        帮助
                                    </motion.span>
                                </motion.button>
                            </li>

                            <li>
                                <motion.button
                                    onClick={() => setDialog('settings')}
                                    variants={navListItemVariants}
                                >
                                    <span className={styles['icon']}>
                                        <Cog8ToothIcon />
                                    </span>
                                    <motion.span
                                        onClick={() => setDialog('settings')}
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
                            <div className={s('section-workspaces-list')}>
                                {workspaces.map((w) =>
                                    <button
                                        key={w.id}
                                        className={s(currentWorkspace === w.id ? 'selected' : '')}
                                        onClick={() => setWorkspace(w.id)}
                                    >
                                        {w.name}
                                    </button>
                                )}
                                <Separator vertical={true} />
                                <button className={s('search-button')}>
                                    <MagnifyingGlassIcon className='h-6 w-6' />
                                </button>
                            </div>
                            <button className={styles['user-avatar']}>
                                <img draggable="false" alt="User Avatar" src="default-avatar.png" />
                            </button>
                        </div>

                        <div className={styles['section-page-content']}>

                            { /* workspaces */}
                            {currentWorkspace === 'workspace' && currentTab === 'reports-review' &&
                                <>
                                    <div className={s('workspace-card w-full')}>
                                        <div className={s('workspace-header')}>
                                            <h2> 文件审核 </h2>
                                            <button
                                                className="rounded-full p-2 -m-2 hover:bg-neutral-200 transition duration-100 data-[open]:bg-neutral-200"
                                                onClick={() => setHistoryFileOpen(!historyFileOpen ? 'true' : null)}
                                                data-open={historyFileOpen}
                                            >
                                                <FolderIcon className="h-5 w-5" />
                                            </button>

                                        </div>
                                        <ScrollArea.Root className="w-full h-0 flex-1">
                                            <ScrollArea.Viewport className="h-full px-[5%] lg:px-[15%] 2xl:px-[25%]">
                                                <FileCard
                                                    className={s('filecard')}
                                                    type='review'
                                                    filetype='txt'
                                                    filesize={3.1 * 1024 * 1024}
                                                    filename="dadwad.txt"
                                                    uploadProgress={0.7}
                                                    done={true}
                                                    mentionables={[
                                                        { id: 'dawda', username: 'Alister', avatar: '' },
                                                        { id: 'dadaw', username: 'Alister', avatar: '' },
                                                        { id: 'dgfaw', username: 'Alister', avatar: '' },
                                                        { id: 'dgdfw', username: 'Alister', avatar: '' },
                                                        { id: 'doguw', username: 'Alister', avatar: '' },
                                                        { id: 'gdfad', username: 'Alister', avatar: '' },
                                                        { id: 'jdkfg', username: 'Alister', avatar: '' },
                                                        { id: 'lkjdf', username: 'Alister', avatar: '' },
                                                    ]}
                                                    mentioned={[
                                                        { id: 'dawda', username: 'Alister', avatar: '' },
                                                        { id: 'dadaw', username: 'Alister', avatar: '' },
                                                        { id: 'dgfaw', username: 'Alister', avatar: '' },
                                                        { id: 'dgdfw', username: 'Alister', avatar: '' },
                                                        { id: 'doguw', username: 'Alister', avatar: '' },
                                                        { id: 'gdfad', username: 'Alister', avatar: '' },
                                                        { id: 'jdkfg', username: 'Alister', avatar: '' },
                                                        { id: 'lkjdf', username: 'Alister', avatar: '' },
                                                    ]}
                                                    overview="你说的对，但是《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予"
                                                    reviewFilename="dfgdfgdf.txt"
                                                    reviewFilesize={1234}
                                                />
                                                <FileCard
                                                    className={s('filecard')}
                                                    type='rating'
                                                    filetype='txt'
                                                    filesize={3.1 * 1024 * 1024}
                                                    filename="dadwad.txt"
                                                    uploadProgress={0.7}
                                                    done={true}
                                                    mentionables={[
                                                        { id: 'dawda', username: 'Alister', avatar: '' },
                                                        { id: 'dadaw', username: 'Alister', avatar: '' },
                                                        { id: 'dgfaw', username: 'Alister', avatar: '' },
                                                        { id: 'dgdfw', username: 'Alister', avatar: '' },
                                                        { id: 'doguw', username: 'Alister', avatar: '' },
                                                        { id: 'gdfad', username: 'Alister', avatar: '' },
                                                        { id: 'jdkfg', username: 'Alister', avatar: '' },
                                                        { id: 'lkjdf', username: 'Alister', avatar: '' },
                                                    ]}
                                                    mentioned={[
                                                        { id: 'dawda', username: 'Alister', avatar: '' },
                                                        { id: 'dadaw', username: 'Alister', avatar: '' },
                                                        { id: 'dgfaw', username: 'Alister', avatar: '' },
                                                    ]}
                                                    grade={80}
                                                    overview="你说的对，但是《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予"
                                                />
                                            </ScrollArea.Viewport>
                                            <ScrollArea.Scrollbar className={s('scrollbar')} orientation="vertical">
                                                <ScrollArea.Thumb className={s('thumb')} />
                                            </ScrollArea.Scrollbar>
                                        </ScrollArea.Root>
                                    </div>
                                    {historyFileOpen &&
                                        <div className={s('workspace-card w-[400px]')}>
                                            <div className={s('workspace-header')}>
                                                <h2> 历史文件 </h2>
                                            </div>
                                            <ScrollArea.Root className="w-full h-0 flex-1">
                                                <div className="px-6 w-full relative flex items-center">
                                                    <input placeholder="搜索" className={s('prefix')} />
                                                    <MagnifyingGlassIcon className="h-6 w-6 absolute left-9" />
                                                </div>
                                                <ScrollArea.Viewport className="h-full px-6 mt-4">
                                                    TODO
                                                </ScrollArea.Viewport>
                                            </ScrollArea.Root>
                                        </div>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </main>

                { /* dialogs */}
                { /* settings dialog */}
                <Dialog.Root open={dialog === 'settings'}>
                    <Dialog.Portal>
                        <Dialog.Overlay id={s('dialog-overlay')} />
                        <Dialog.Content className={s('dialog-content settings-dialog')}>
                            <Tabs.Root orientation="vertical" className="h-full w-full flex">
                                <Tabs.List className={s('settings-dialog-nav')}>
                                    <Dialog.Title className={s('dialog-title')}> 设置 </Dialog.Title>
                                    <div role='group' className={s('nav-group')}>
                                        <label role='columnheader'> 个人账号 </label>
                                        <Tabs.Trigger value='my-account' className={s('nav-item')}>
                                            <UserIcon className={s('nav-icon')} />
                                            <span> 我的账号 </span>
                                        </Tabs.Trigger>
                                    </div>
                                    <div role='group' className={s('nav-group')}>
                                        <label role='columnheader'> 组织账号 </label>
                                        <Tabs.Trigger value='org-account' className={s('nav-item')}>
                                            <BriefcaseIcon className={s('nav-icon')} />
                                            <span> 组织账号 </span>
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value='member-management' className={s('nav-item')}>
                                            <UsersIcon className={s('nav-icon')} />
                                            <span> 成员管理 </span>
                                        </Tabs.Trigger>
                                    </div>
                                </Tabs.List>

                                <div className={s('settings-dialog-content')}>
                                    <div className={s('content-header')}>
                                        <h2> 我的账号 </h2>
                                        <button
                                            className="rounded-full hover:bg-neutral-100 p-1 -m-1"
                                            onClick={() => setDialog(null)}
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </Tabs.Root>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </>
    )
}

export default Home
