import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Select from "@radix-ui/react-select";
import * as Tabs from "@radix-ui/react-tabs";
import Separator from "components/Separator";
import * as Table from "components/Table";
import Titlebar from "components/Titlebar";
import * as path from "path";
import React, {
  useCallback,
  useContext,
  useRef,
} from "react";
import styles from "./index.module.css";

import { ThemeMode } from "@privata/types/theme";
import ThemeContext from "contexts/theme";

import * as outline from "@heroicons/react/24/outline";
import {
  DocumentIcon,
  MotionFileCard,
  TabIDsEnum,
  ValidFileTypeEnum,
} from "components/FileCard/index";
import { Variants, motion, useMotionValue, AnimatePresence, LayoutGroup, useVelocity } from "framer-motion";
import { useQueryItem } from "hooks/useQueryItem";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { classNames, modulize } from "utils/classNames";
import { humanizeFileSize } from "utils/humanize";

import { GetFileReview, GetStudyAboardPlanning } from "@/api/review";
import { AxiosProgressEvent } from "axios";
import { historyFiles, settingsGroups, FileTypeExtMapping } from "./static-conf";
import { useSmoothTransform } from "@/hooks/useSmoothTransform";
import { Tab, Workspace, URLParams, WorkspaceIDs, createHomePageStore, FileCardPropsWithUUID } from "@/viewmodels/home";
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const tabs: Tab[] = [
    {
      id: TabIDsEnum.ReportsReview,
      name: "文件审核",
      icon: <outline.ChatBubbleLeftRightIcon />,
    },
    // { id: "quan-eval", name: "自动评分", icon: <MusicalNoteIcon /> },
    {
      id: TabIDsEnum.StudyAbroadPlanning,
      name: "留学规划",
      icon: <outline.FunnelIcon />,
    },
  ];
  const workspaces: Workspace[] = [
    { affiliate: TabIDsEnum.ReportsReview, id: "workspace", name: "工作区" },
    {
      affiliate: TabIDsEnum.ReportsReview,
      id: "file-management",
      name: "文件管理",
    },
  ];

  const s = modulize(styles);

  const {
    tabID: currentTab = TabIDsEnum.ReportsReview,
    workspaceID: currentWorkspace = "workspace",
  } = useParams() as any as URLParams;

  const state = createHomePageStore();

  const nextUuid = useRef<string>(uuidv4());

  const [query] = useSearchParams();
  const [navCollapsed, setNavCollapsedValue] = useQueryItem("navCollapsed");
  const [historyFileOpen, setHistoryFileOpen] = useQueryItem("historyFileOpen");

  // file drag handler part
  // see https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
  // use ref to prevent frequent re-rendering
  const fileEnterCount = useRef<number>(0);
  const fileDragDropDataElement = useRef<HTMLDivElement | null>(null);

  const fileDragPreviewCardPositionXRaw = useMotionValue(0);
  const fileDragPreviewCardPositionYRaw = useMotionValue(0);

  const fileDragPreviewCardPositionX = useSmoothTransform(fileDragPreviewCardPositionXRaw, { bounce: 0 }, v => v);
  const fileDragPreviewCardPositionY = useSmoothTransform(fileDragPreviewCardPositionYRaw, { bounce: 0 }, v => v);
  const vx = useVelocity(fileDragPreviewCardPositionXRaw)

  const fileDragPreviewCardRotate = useSmoothTransform(vx, { bounce: 0 }, a => a / 50000 * 360);

  const addFileDropDataState = () => {
    fileDragDropDataElement.current!.setAttribute("data-filedrop", "true");
  }
  const removeFileDropDataState = () => {
    fileDragDropDataElement.current!.setAttribute("data-filedrop", "false");
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    fileEnterCount.current += 1;
    if (fileEnterCount.current === 1) {
      const items = e.dataTransfer.items;
      const files: DataTransferItem[] = [];
      for(let i = 0; i < items.length; i++)
        if(items[i].kind === 'file')
          files.push(items[i])

      if(files.length === 0) return;
      state.setFilePreviewInfo({
        fileExt: FileTypeExtMapping[files[0].type],
        fileCount: files.length,
        initialX: e.pageX,
        initialY: e.pageY,
      });

      fileDragPreviewCardPositionXRaw.jump(e.pageX);
      fileDragPreviewCardPositionYRaw.jump(e.pageY);

      addFileDropDataState();
    }
  };
  const handleDragLeave = () => {
    fileEnterCount.current -= 1;
    if (fileEnterCount.current === 0) {
      state.setFilePreviewInfo(null);
      removeFileDropDataState();
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    fileDragPreviewCardPositionXRaw.set(e.pageX);
    fileDragPreviewCardPositionYRaw.set(e.pageY);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    removeFileDropDataState();
    state.setFilePreviewInfo(null);
    fileEnterCount.current = 0;

    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      processFile(files[i]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO 组件还是单选状态
    const files = event.target.files;
    if (!files) return;

    for(let file of files)
    processFile(file)
  };

  // 处理文件拖拽/点击上传后的操作
  const processFile = (file: File) => {
    const ext = path.extname(file.name);
    if (!(ext.slice(1).toUpperCase() in ValidFileTypeEnum)) return;

    let fileProps: FileCardPropsWithUUID = {
      tab: currentTab,
      filetype: ext as ValidFileTypeEnum,
      filename: file.name,
      filesize: file.size,
      uploadProgress: 0,
      done: false,
      mentioned: [],
      mentionables: [],
      uuid: nextUuid.current,
    };
    nextUuid.current = uuidv4();

    // 更新界面显示文件
    state.insertFile(currentTab, fileProps);

    const updateProgress = (p: AxiosProgressEvent) => {
      fileProps.uploadProgress = p.progress || 0;
      state.updateFile(currentTab, fileProps);
    };

    const payload = new FormData();
    payload.append("file", file);
    payload.append("profile_id", state.profileId);
    /*
      {
        lastModified: 1697471307573;
        lastModifiedDate: "Mon Oct 16 2023 23:48:27 GMT+0800 (中国标准时间) {}";
        name: "report1.docx";
        path: "D:\\Desktop\\report1.docx";
        size: 14976;
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        webkitRelativePath: "";
      }
    */
    // console.log(fileProps);

    switch (currentTab) {
      case TabIDsEnum.ReportsReview:
        GetFileReview(payload, updateProgress)
          .then((response) => {
            const matchResult = response.data.match(/(\d+?)\/100/);
            state.updateFile(currentTab, {
              ...fileProps,
              uploadProgress: 1,
              done: true,
              mentioned: [],
              mentionables: [],
              overview: response.data.replace(/\s*评分：\d+\/100/g, ""),
              grade: Number(matchResult ? matchResult[1] : 0),
            });
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case TabIDsEnum.StudyAbroadPlanning:
        GetStudyAboardPlanning(payload)
          .then((response) => {
            state.updateFile(currentTab, {
              ...fileProps,
              uploadProgress: 1,
              done: true,
              mentioned: [],
              mentionables: [],
              overview: JSON.stringify(response.data, undefined, 2),
              grade: 0,
            });
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      default:
        break;
    }

    // TODO
    // createReviewStorage();
  };

  // theme part
  const { theme, setTheme } = useContext(ThemeContext);
  const toggleTheme = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, theme: ThemeMode) => {
      setTheme(theme, e.pageX, e.pageY);
    },
    [setTheme]
  );

  // tabs and workspaces part
  const goto = useNavigate();

  const setTab = (tab: TabIDsEnum) => {
    goto({
      pathname: `/home/${tab}`,
      search: query.toString(),
    });
  };
  const setWorkspace = useCallback(
    (workspace: WorkspaceIDs) => {
      goto({
        pathname: `/home/${currentTab}/${workspace}`,
        search: query.toString(),
      });
    },
    [goto, query, currentTab]
  );
  const setNavCollapsed = (collapsed: boolean) => {
    setNavCollapsedValue(collapsed ? "true" : null);
  };

  const navCollapseVariants: Variants = {
    collapsed: {
      width: "4.25rem",
      transition: { ease: "circOut", duration: 0.2 },
    },
    normal: {
      width: "17.5rem",
      transition: { ease: "circOut", duration: 0.2 },
    },
  };
  const collapseButtonVariants: Variants = {
    collapsed: {
      rotate: "180deg",
      transition: { ease: "circOut", duration: 0.2 },
    },
    normal: { rotate: "0deg", transition: { ease: "circOut", duration: 0.2 } },
  };
  const navListTitleVariants: Variants = {
    collapsed: { opacity: 0, transition: { duration: 0.1 } },
    normal: { opacity: 1, transition: { duration: 0.1 } },
  };
  const navListItemVariants: Variants = {
    collapsed: {
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      transition: { duration: 0.2 },
    },
    normal: {
      paddingLeft: "1rem",
      paddingRight: "1rem",
      transition: { duration: 0.2 },
    },
  };
  const orgNameVariants: Variants = {
    collapsed: { opacity: 0, transition: { duration: 0.2 } },
    normal: { opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <LayoutGroup>
      <div className={s("container")}>
        <main className={s("content-wrapper")}>
          <motion.aside
            className={s("nav")}
            variants={navCollapseVariants}
            initial="normal"
            animate={navCollapsed ? "collapsed" : "normal"}
          >
            <div>
              <div className={s("org-info-wrapper")}>
                <motion.div
                  className={s("org-title-wrapper")}
                  variants={orgNameVariants}
                >
                  <span className={s("org-avatar")}> </span>
                  <h2 className={s("org-name")}> Valmech </h2>
                </motion.div>
                <button
                  className={s("aside-collapse")}
                  onClick={() => setNavCollapsed(!navCollapsed)}
                >
                  <motion.span
                    className="block"
                    variants={collapseButtonVariants}
                  >
                    <outline.ChevronDoubleLeftIcon />
                  </motion.span>
                </button>
              </div>

              <Separator />
              <ul className={s("feature-list nav-list")}>
                {tabs.map((f) => (
                  <li key={f.id} className={s("item")}>
                    <motion.button
                      onClick={() => setTab(f.id)}
                      className={
                        currentTab && currentTab === f.id
                          ? s("selected")
                          : ""
                      }
                      variants={navListItemVariants}
                    >
                      <span className={s("icon")}> {f.icon} </span>
                      <motion.span
                        className={s("title")}
                        variants={navListTitleVariants}
                      >
                        {f.name}
                      </motion.span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            <ul className={s("bottom-nav nav-list")}>
              <Separator margin={0} />
              <li>
                <motion.button
                  onClick={() => state.setDialogTab("notifications")}
                  variants={navListItemVariants}
                >
                  <span className={s("icon")}>
                    <outline.BellIcon />
                  </span>
                  <motion.span
                    className={s("title")}
                    variants={navListTitleVariants}
                  >
                    通知
                  </motion.span>
                </motion.button>
              </li>

              <li>
                <motion.button
                  onClick={() => state.setDialogTab("help")}
                  variants={navListItemVariants}
                >
                  <span className={s("icon")}>
                    <outline.Cog8ToothIcon />
                  </span>
                  <motion.span
                    onClick={() => state.setDialogTab("help")}
                    className={s("title")}
                    variants={navListTitleVariants}
                  >
                    帮助
                  </motion.span>
                </motion.button>
              </li>

              <li>
                <motion.button
                  onClick={() => state.setDialogTab("settings")}
                  variants={navListItemVariants}
                >
                  <span className={s("icon")}>
                    <outline.Cog8ToothIcon />
                  </span>
                  <motion.span
                    onClick={() => state.setDialogTab("settings")}
                    className={s("title")}
                    variants={navListTitleVariants}
                  >
                    设置
                  </motion.span>
                </motion.button>
              </li>
            </ul>
          </motion.aside>
          <div className={s("section-page")}>
            <div className={s("section-page-header")}>
              <Titlebar />
              <div className={s("section-workspaces-list")}>
                {workspaces.map((w) => (
                  <button
                    key={w.id}
                    className={s(currentWorkspace === w.id ? "selected" : "")}
                    onClick={() => setWorkspace(w.id)}
                  >
                    {w.name}
                  </button>
                ))}
                <Separator vertical={true} />
                <button className={s("search-button")}>
                  <outline.MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              </div>
              <button className={s("user-avatar")}>
                <img
                  draggable="false"
                  alt="User Avatar"
                  src="default-avatar.png"
                />
              </button>
            </div>

            <div
              className={s("section-page-content")}
              ref={fileDragDropDataElement}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleFileDrop}
              data-show-filedrop-hint={state[currentTab].length === 0}
            >
              { /* file drag preview card */ }
              <AnimatePresence>
                { state.filePreviewInfo &&
                  <motion.div
                    className="fixed z-50 top-5 left-5"
                    layoutId={"file-drop-card-" + nextUuid.current}
                    style={{
                      x: fileDragPreviewCardPositionX,
                      y: fileDragPreviewCardPositionY,
                      rotate: fileDragPreviewCardRotate,
                    }}
                    initial={{ filter: 'blur(2px)', opacity: 0 }}
                    animate={{ filter: 'blur(0px)', opacity: 1 }}
                    exit={{ filter: 'blur(2px)', opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div aria-hidden className="p-1 rounded-2xl shadow-xl bg-indigo-100 dark:bg-indigo-900">
                      <div className="rounded-xl p-4 bg-white dark:bg-neutral-800 dark:text-white flex flex-row items-center space-x-4">
                        <DocumentIcon type={ state.filePreviewInfo.fileExt } classNames="w-10 h-10"/>
                        <div className="flex flex-col items-start justify-between">
                          <span className=""> 共 <span>{ state.filePreviewInfo.fileCount }</span> 个文件 </span>
                          <span className="text-sm text-neutral-200 dark:text-neutral-600"> 松开鼠标以发送 </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                }
              </AnimatePresence>

              {/* workspaces */}
              {currentWorkspace === "workspace" &&
                currentTab === TabIDsEnum.ReportsReview && (
                  <>
                    <div className={s("workspace-card w-full")}>
                      <div className={s("workspace-header")}>
                        <div className="flex flex-row space-x-4 items-center">
                          <h2> 文件审核 </h2>
                          <Select.Root
                            defaultValue="media"
                            value={state.profileId}
                            onValueChange={state.setProfileId}
                          >
                            <Select.Trigger className={s("select-trigger")}>
                              <Select.Value
                                placeholder="场景"
                                className="text-left"
                              />
                              <Select.Icon className={s("select-icon")}>
                                <outline.ChevronDownIcon />
                              </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className={s("select-content")}>
                                <Select.ScrollUpButton />
                                <Select.Viewport className="p-2">
                                  <SelectItem value="media">媒体</SelectItem>
                                  <SelectItem value="academic">学术</SelectItem>
                                  <SelectItem
                                    disabled={true}
                                    value="consultation"
                                  >
                                    咨询
                                  </SelectItem>
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        </div>
                        <button
                          className="rounded-full p-2 -m-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition duration-100 data-[open]:bg-neutral-200 dark:data-[open]:bg-neutral-700 focus-visible:ring-1 focus-visible:ring-neutral-600"
                          onClick={() =>
                            setHistoryFileOpen(!historyFileOpen ? "true" : null)
                          }
                          data-open={historyFileOpen}
                        >
                          <outline.FolderIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <ScrollArea.Root className="w-full h-0 flex-1 relative">
                        <div className={s("drag-drop-area")}>
                          <p> 拖拽文件到此处发送 </p>
                        </div>
                        <label className={s("upload-button", "cursor-pointer focus-visible:ring focus-visible:ring-indigo-400")}>
                          <input
                            id="reports-review-file-upload"
                            type="file"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                          />
                          <outline.ArrowUpTrayIcon />
                        </label>
                        <ScrollArea.Viewport className="h-full px-[5%] lg:px-[15%] 2xl:px-[25%]">
                          {state[TabIDsEnum.ReportsReview].map(f => (
                            <MotionFileCard
                              layoutId={"file-drop-card-" + f.uuid}
                              key={f.uuid}
                              className={s("filecard")}
                              {...f}
                            />
                          ))}
                        </ScrollArea.Viewport>
                        <ScrollArea.Scrollbar
                          className={s("scrollbar")}
                          orientation="vertical"
                        >
                          <ScrollArea.Thumb className={s("thumb")} />
                        </ScrollArea.Scrollbar>
                      </ScrollArea.Root>
                    </div>
                    {historyFileOpen && (
                      <div className={s("workspace-card w-[500px]")}>
                        <div className={s("workspace-header")}>
                          <h2> 历史文件 </h2>
                        </div>
                        <ScrollArea.Root className="w-full h-0 flex-1">
                          <div className="px-6 w-full relative flex items-center">
                            <input placeholder="搜索" className={s("prefix")} />
                            <outline.MagnifyingGlassIcon className="h-6 w-6 absolute left-9" />
                          </div>
                          <ScrollArea.Viewport className="h-full px-6 mt-4">
                            {historyFiles.map((f) => (
                              <div
                                key={`${f.filename}-${f.url}`}
                                className={s("history-file-item")}
                              >
                                <div className="flex justify-start items-center flex-1 w-0 space-x-2">
                                  <DocumentIcon type={f.ext} />
                                  <div className="flex flex-col items-start flex-1 w-0">
                                    <span className="w-full text-ellipsis overflow-hidden">
                                      {f.filename}
                                    </span>
                                    <span className="text-sm text-neutral-500">
                                      {humanizeFileSize(f.size)}
                                      {new Date(f.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <button className="w-6 h-6 p-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600">
                                  <outline.EllipsisHorizontalIcon />
                                </button>
                              </div>
                            ))}
                          </ScrollArea.Viewport>
                        </ScrollArea.Root>
                      </div>
                    )}
                  </>
                )}
              {currentWorkspace === "workspace" &&
                currentTab === TabIDsEnum.StudyAbroadPlanning && (
                  <>
                    <div className={s("workspace-card w-full")}>
                      <div className={s("workspace-header")}>
                        <div className="flex flex-row space-x-4 items-center">
                          <h2> 留学规划 </h2>
                        </div>
                      </div>
                      <ScrollArea.Root className="w-full h-0 flex-1 relative">
                        <div className={s("drag-drop-area")}>
                          <p> 拖拽文件到此处发送 </p>
                        </div>
                        <label className={s("upload-button cursor-pointer")} >
                          <input
                            id="study-abroad-planning-file-upload"
                            type="file"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                          />
                          <outline.ArrowUpTrayIcon />
                        </label>
                        <ScrollArea.Viewport className="h-full px-[5%] lg:px-[15%] 2xl:px-[25%]">
                          {state[TabIDsEnum.StudyAbroadPlanning].map(f => (
                              <MotionFileCard
                                layoutId={"file-drop-card-" + f.uuid}
                                key={f.uuid}
                                className={s("filecard")}
                                {...f}
                              />
                            )
                          )}
                        </ScrollArea.Viewport>
                        <ScrollArea.Scrollbar
                          className={s("scrollbar")}
                          orientation="vertical"
                        >
                          <ScrollArea.Thumb className={s("thumb")} />
                        </ScrollArea.Scrollbar>
                      </ScrollArea.Root>
                    </div>
                  </>
                )}
              {currentWorkspace === "file-management" && (
                // currentTab === "reports-review" && (
                <div className={s("workspace-card w-full")}>
                  <div className={s("workspace-header")}>
                    <h2> 文件管理 </h2>
                  </div>
                  <div className="w-full h-full flex flex-col px-6 space-y-4">
                    <div className="w-full h-fit relative flex items-center">
                      <input placeholder="搜索" className={s("prefix")} />
                      <outline.MagnifyingGlassIcon className="h-6 w-6 absolute left-3" />
                    </div>
                    <Table.Table>
                      <Table.TableHeader>
                        <Table.TableRow>
                          <Table.TableHead className="w-32rem">
                            文件名称
                          </Table.TableHead>
                          <Table.TableHead> 类型 </Table.TableHead>
                          <Table.TableHead> 时间 </Table.TableHead>
                          <Table.TableHead> {/* 按钮 */} </Table.TableHead>
                        </Table.TableRow>
                      </Table.TableHeader>
                    </Table.Table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* dialogs */}
        {/* settings dialog */}
        <Dialog.Root open={state.dialogTab === "settings"}>
          <Dialog.Portal>
            <Dialog.Overlay id={s("dialog-overlay")} />
            <Dialog.Content
              className={s("dialog-content settings-dialog")}
              onEscapeKeyDown={() => state.setDialogTab(null)}
            >
              <Tabs.Root orientation="vertical" className="h-full w-full flex">
                <Tabs.List className={s("settings-dialog-nav")}>
                  <Dialog.Title className={s("dialog-title")}>
                    设置
                  </Dialog.Title>

                  {settingsGroups.map((g) => (
                    <div role="group" className={s("nav-group")} key={g.title}>
                      <label role="columnheader"> {g.title}</label>
                      {g.items.map((i) => (
                        <Tabs.Trigger
                          key={i.id}
                          value={i.id}
                          className={s("nav-item")}
                        >
                          <>
                            {i.icon}
                            <span> {i.title} </span>
                          </>
                        </Tabs.Trigger>
                      ))}
                    </div>
                  ))}
                </Tabs.List>

                <div className={s("settings-dialog-content")}>
                  <div className={s("content-header")}>
                    <h2> 我的账号 </h2>
                    <button
                      className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1 -m-1"
                      onClick={() => state.setDialogTab(null)}
                    >
                      <outline.XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <Tabs.Content value="app-settings">
                    <span className={s("settings-group-title")}>界面设置</span>
                    <div className={s("settings-item color-scheme")}>
                      <label>颜色主题</label>
                      <div>
                        <button
                          onClick={(e) => toggleTheme(e, "light")}
                          data-state={theme === "light" ? "on" : "off"}
                        >
                          <outline.SunIcon />
                        </button>
                        <button
                          onClick={(e) => toggleTheme(e, "system")}
                          data-state={theme === "system" ? "on" : "off"}
                        >
                          <outline.CloudIcon />
                        </button>
                        <button
                          onClick={(e) => toggleTheme(e, "dark")}
                          data-state={theme === "dark" ? "on" : "off"}
                        >
                          <outline.MoonIcon />
                        </button>
                      </div>
                    </div>
                  </Tabs.Content>
                </div>
              </Tabs.Root>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </LayoutGroup>
  );
};

export default Home;

const SelectItem = React.forwardRef<HTMLDivElement, Select.SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classNames(
          "leading-none rounded-lg flex items-center py-2 px-8 my-1 relative",
          "focus:bg-neutral-100 dark:focus:bg-neutral-900",
          props.disabled ? "text-neutral-400 dark:text-neutral-600" : "",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-2 h-4 w-4 inline-flex items-center justify-center">
          <outline.CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);
