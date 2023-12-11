import { ValidFileTypeEnum } from "@/components/FileCard";
import { BriefcaseIcon, Cog8ToothIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline"
import { People } from "@privata/types/people"
import { ReactNode } from "react"

interface File {
  filename: string;
  ext: ValidFileTypeEnum;
  size: number; // number of bytes
  date: number;
  chatId: number;
  url: string;
}

// debug: data mock
export const mentionables: People[] = [
    { id: 'dawda', username: 'Alister', avatar: '' },
    { id: 'dadaw', username: 'Alister', avatar: '' },
    { id: 'dgfaw', username: 'Alister', avatar: '' },
    { id: 'dgdfw', username: 'Alister', avatar: '' },
    { id: 'doguw', username: 'Alister', avatar: '' },
    { id: 'gdfad', username: 'Alister', avatar: '' },
    { id: 'jdkfg', username: 'Alister', avatar: '' },
    { id: 'lkjdf', username: 'Alister', avatar: '' },
]

// debug: data mock
export const historyFiles: File[] = [
    { filename: "dawwadawdawdawdlfghjsfgklsdhgdfkjghwjeyriwuef.txt", ext: 'txt', size: 114514, date: 114514, chatId: 1919810, url: '' },
    { filename: "123.pdf", ext: 'pdf', size: 114.514 * 1024, date: 114514, chatId: 1919810, url: '' },
    { filename: "123.doc", ext: 'doc', size: 114514, date: 114514, chatId: 1919810, url: '' },
]

export type SettingId = 'my-account' | 'org-account' | 'member-management' | 'app-settings'
export interface SettingCategory {
    id: SettingId
    title: string
    icon: ReactNode
}
export interface SettingGroup {
    title: string
    items: SettingCategory[]
}

export const settingsGroups: SettingGroup[] = [
    {
        title: '个人账号', items: [
            { id: 'my-account', title: '我的账号', icon: <UserIcon />, },
        ]
    },
    {
        title: '组织账号', items: [
            { id: 'org-account', title: '组织账号', icon: <BriefcaseIcon />, },
            { id: 'member-management', title: '成员管理', icon: <UsersIcon />, },
        ]
    },
    {
        title: '应用设置', items: [
            { id: 'app-settings', title: '应用设置', icon: <Cog8ToothIcon />, },
        ]
    },
]
