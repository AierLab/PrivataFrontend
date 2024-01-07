import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";

// const API_ENDPOINT = "http://localhost:8000";
const API_ENDPOINT = "http://aidvisor.valmech.net";
const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    "X-API-Key": "secret_api_key",
  },
});

export const GetOpenAIConnectionTest = async () => {
  return await api.post("/api/test/conn/");
};

export interface GetFileReviewResponse {
  data: string;
}

export const GetFileReview = async (
  payload: FormData,
  onProgressUpdate: (p: AxiosProgressEvent) => void
) => {
  const config: AxiosRequestConfig = {
    onUploadProgress: onProgressUpdate,
  };
  // return await api.post('/api/file/review', payload, config)
  return await api.post("/api/tabs/reports-review/", payload, config);
};

interface GetStudyAboardPlanningResponse {
  data: {
    冲刺院校1: {
      学校名称: string;
      推荐专业: string;
      推荐原因: string;
    };
    冲刺院校2: {
      学校名称: string;
      推荐专业: string;
      推荐原因: string;
    };
    适中院校1: {
      学校名称: string;
      推荐专业: string;
      推荐原因: string;
    };
    适中院校2: {
      学校名称: string;
      推荐专业: string;
      推荐原因: string;
    };
    保底院校1: {
      学校名称: string;
      推荐专业: string;
      推荐原因: string;
    };
    保底院校2: {
      学校名称: string;
      推荐专业: string;
      推荐原因: string;
    };
  };
}

export const GetStudyAboardPlanning = async (
  payload: FormData
): Promise<GetStudyAboardPlanningResponse> => {
  return await api.post("/api/tabs/study-aboard-planning/", payload);
};
