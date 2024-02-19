import { create } from 'zustand'
import {
  FileCardProps,
  TabIDsEnum,
  ValidFileTypeEnum,
} from "components/FileCard/index";
import { ReactElement } from 'react';

export type DialogIDs = "notifications" | "help" | "settings" | "search" | null;
export type WorkspaceIDs = "workspace" | "file-management";
export type ProfileIDs = "media" | "academic";

export interface Tab {
  id: TabIDsEnum;
  name: string;
  icon: ReactElement;
  element?: ReactElement;
}

export interface Workspace {
  affiliate: TabIDsEnum;
  id: WorkspaceIDs;
  name: string;
}

export interface URLParams {
  tabID: TabIDsEnum;
  workspaceID: WorkspaceIDs;
}

export interface FilePreviewInfo {
  fileExt: ValidFileTypeEnum,
  fileCount: number,
  initialX: number,
  initialY: number,
}

export type FileCardPropsWithUUID = FileCardProps & {
  uuid: string
};

type Files = {
  [K in TabIDsEnum]: FileCardPropsWithUUID[];
};

type HomePageStore = Files & {
  dialogTab: DialogIDs | null,
  profileId: ProfileIDs,
  filePreviewInfo: FilePreviewInfo | null,

  insertFile(tab: TabIDsEnum, file: FileCardPropsWithUUID): void,
  updateFile(tab: TabIDsEnum, file: FileCardPropsWithUUID): void,
  setDialogTab(tab: DialogIDs | null): void,
  setProfileId(id: ProfileIDs): void,
  setFilePreviewInfo(info: FilePreviewInfo | null): void,
}

export const createHomePageStore = create<HomePageStore>((set) => ({
  [TabIDsEnum.ReportsReview]: [],
  [TabIDsEnum.StudyAbroadPlanning]: [],
  dialogTab: null,
  profileId: 'media',
  filePreviewInfo: null,

  insertFile(tab, file) {
    set((state) => ({
      [tab]: [ file, ...state[tab] ],
    }));
  },

  updateFile(tab, file) {
    set(state => {
      let i = state[tab].findIndex(f => f.uuid === file.uuid)
      if(i === -1) return {}
      state[tab][i] = file
      
      return { [tab]: state[tab] }
    })
  },

  setProfileId(id) {
    set({ profileId: id })
  },

  setDialogTab(tab) {
    set({ dialogTab: tab })
  },
  
  setFilePreviewInfo(info) {
    set({ filePreviewInfo: info })
  },
}))

