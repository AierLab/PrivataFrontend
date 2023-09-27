import { ReactElement, useCallback, useContext, useRef, useState } from "react"
import styles from "./index.module.css"

import * as Tabs from '@radix-ui/react-tabs'
import * as Dialog from '@radix-ui/react-dialog'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Table from 'components/Table'
import Titlebar from 'components/Titlebar'
import Separator from "components/Separator"

import ThemeContext from "contexts/theme"
import { OpenFileOptions, OpenFileResult } from '@privata/types/open-file-dialog'

import {
    BellIcon,
    Cog8ToothIcon,
    ChatBubbleLeftRightIcon,
    MusicalNoteIcon,
    MagnifyingGlassIcon,
    ChevronDoubleLeftIcon,
    FolderIcon,
    XMarkIcon,
    EllipsisHorizontalIcon,
    ArrowUpTrayIcon
} from "@heroicons/react/24/outline"
import { modulize } from "utils/classNames"
import { humanizeFileSize } from "utils/humanize"
import { motion, Variants } from "framer-motion"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useQueryItem } from "hooks/useQueryItem"
import { FileCard, DocumentIcon } from "components/FileCard/index"

import { mentionables, historyFiles, settingsGroups } from './static-conf'

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

    // file drag handler part
    // see https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    // use ref to prevent frequent re-rendering
    const fileEnterCount = useRef<number>(0)
    const fileDragDropDataElement = useRef<HTMLDivElement | null>(null)
    const addFileDropDataState = () => fileDragDropDataElement.current!.setAttribute('data-filedrop', 'true')
    const removeFileDropDataState = () => fileDragDropDataElement.current!.setAttribute('data-filedrop', 'false')
    const dragEnter = () => {
        fileEnterCount.current += 1
        if (fileEnterCount.current === 1) addFileDropDataState()
    }
    const dragLeave = () => {
        fileEnterCount.current -= 1
        if(fileEnterCount.current === 0) removeFileDropDataState()
    }
    const dragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation() }
    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        removeFileDropDataState()
        fileEnterCount.current = 0
        e.preventDefault()
        e.stopPropagation()

        console.log(e.dataTransfer.files)
    }

    // file select part
    const handleFileSelect = () => {
        const options: OpenFileOptions = {
            multiSelect: true,
            title: '选择需要处理的文件',
            filters: [
                { name: "文档", extensions: ['pdf', 'doc', 'txt'] },
            ]
        }
        window.api.openFile(options).then((result: OpenFileResult) => {
            console.log(result)
        })
    }

    // theme part
    const { theme, setTheme } = useContext(ThemeContext)
    const toggleTheme = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setTheme(theme === 'dark' ? 'light' : 'dark', e.pageX, e.pageY)
    }, [setTheme, theme])

    // tabs and workspaces part
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

                        <div
                            className={styles['section-page-content']}
                            ref={fileDragDropDataElement}
                            onDragEnter={dragEnter}
                            onDragLeave={dragLeave}
                            onDragOver={dragOver}
                            onDrop={handleFileDrop}
                        >

                            { /* workspaces */}
                            {currentWorkspace === 'workspace' && currentTab === 'reports-review' &&
                                <>
                                    <div className={s('workspace-card w-full')}>
                                        <div className={s('workspace-header')}>
                                            <h2> 文件审核 </h2>
                                            <button
                                                className="rounded-full p-2 -m-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition duration-100 data-[open]:bg-neutral-200 dark:data-[open]:bg-neutral-700"
                                                onClick={() => setHistoryFileOpen(!historyFileOpen ? 'true' : null)}
                                                data-open={historyFileOpen}
                                            >
                                                <FolderIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <ScrollArea.Root className="w-full h-0 flex-1 relative">
                                            <div className={s('drag-drop-area')}>
                                                <p> 拖拽文件到此处发送 </p>
                                            </div>
                                            <button className={s('upload-button')} onClick={handleFileSelect}>
                                                <ArrowUpTrayIcon />
                                            </button>
                                            <ScrollArea.Viewport className="h-full px-[5%] lg:px-[15%] 2xl:px-[25%]">
                                                <FileCard
                                                    className={s('filecard')}
                                                    type='review'
                                                    filetype='txt'
                                                    filesize={3.1 * 1024 * 1024}
                                                    filename="dadwadogkjfshgskjfhsdkfjhsddhfskdjfhwop;ireqwolhfnkjdsafhquoerhfkufhbmwafbeugwfiugbwifwefuoiweghwi.txt"
                                                    uploadProgress={0.7}
                                                    done={true}
                                                    mentionables={mentionables}
                                                    mentioned={mentionables}
                                                    overview="你说的对，但是《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予"
                                                    reviewFilename="dfgdfgdf.txt"
                                                    reviewFilesize={1234}
                                                />
                                                <FileCard
                                                    className={s('filecard')}
                                                    type='rating'
                                                    filetype='pdf'
                                                    filesize={0.91 * 1024}
                                                    filename="dadwad.pdf"
                                                    uploadProgress={0.2}
                                                    done={true}
                                                    mentionables={mentionables}
                                                    mentioned={mentionables.slice(0, 3)}
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
                                        <div className={s('workspace-card w-[500px]')}>
                                            <div className={s('workspace-header')}>
                                                <h2> 历史文件 </h2>
                                            </div>
                                            <ScrollArea.Root className="w-full h-0 flex-1">
                                                <div className="px-6 w-full relative flex items-center">
                                                    <input placeholder="搜索" className={s('prefix')} />
                                                    <MagnifyingGlassIcon className="h-6 w-6 absolute left-9" />
                                                </div>
                                                <ScrollArea.Viewport className="h-full px-6 mt-4">
                                                    {historyFiles.map((f) => (
                                                        <div key={`${f.filename}-${f.url}`} className={s('history-file-item')}>
                                                            <div className="flex justify-start items-center flex-1 w-0 space-x-2">
                                                                <DocumentIcon type={f.ext} />
                                                                <div className="flex flex-col items-start flex-1 w-0">
                                                                    <span className="w-full text-ellipsis overflow-hidden"> {f.filename} </span>
                                                                    <span className="text-sm text-neutral-500"> {humanizeFileSize(f.size)} {new Date(f.date).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                            <button className="w-6 h-6 p-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600">
                                                                <EllipsisHorizontalIcon />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </ScrollArea.Viewport>
                                            </ScrollArea.Root>
                                        </div>
                                    }
                                </>
                            }
                            {currentWorkspace === 'file-management' && currentTab === 'reports-review' &&
                                <div className={s('workspace-card w-full')}>
                                    <div className={s('workspace-header')}>
                                        <h2> 文件管理 </h2>
                                    </div>
                                    <div className="w-full h-full flex flex-col px-6 space-y-4">
                                        <div className="w-full h-fit relative flex items-center">
                                            <input placeholder="搜索" className={s('prefix')} />
                                            <MagnifyingGlassIcon className="h-6 w-6 absolute left-3" />
                                        </div>
                                        <Table.Table>
                                            <Table.TableHeader>
                                                <Table.TableRow>
                                                    <Table.TableHead className="w-32rem"> 文件名称 </Table.TableHead>
                                                    <Table.TableHead> 类型 </Table.TableHead>
                                                    <Table.TableHead> 时间 </Table.TableHead>
                                                    <Table.TableHead> { /* 按钮 */ } </Table.TableHead>
                                                </Table.TableRow>
                                            </Table.TableHeader>
                                        </Table.Table>
                                    </div>
                                </div>
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

                                    { settingsGroups.map(g => (
                                        <div role='group' className={s('nav-group')} key={g.title}>
                                            <label role='columnheader'> {g.title}</label>
                                            { g.items.map(i => (
                                                <Tabs.Trigger key={i.id} value={i.id} className={s('nav-item')}>
                                                    <>
                                                        {i.icon}
                                                        <span> {i.title} </span>
                                                    </>
                                                </Tabs.Trigger>
                                            ))}
                                        </div>
                                    ))}

                                </Tabs.List>

                                <div className={s('settings-dialog-content')}>
                                    <div className={s('content-header')}>
                                        <h2> 我的账号 </h2>
                                        <button
                                            className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1 -m-1"
                                            onClick={() => setDialog(null)}
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <Tabs.Content value="app-settings">
                                        <button onClick={toggleTheme}>
                                            切换黑暗模式
                                        </button>
                                    </Tabs.Content>
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
