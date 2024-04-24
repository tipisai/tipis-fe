export enum FILE_ITEM_DETAIL_STATUS_IN_UI {
  PROCESSING = "processing",
  SUCCESS = "success",
  ERROR = "error",
  WAITING = "waiting",
}

export interface IUploadParams {
  fileData: File
  folder: string
  replace: boolean
}

export type IListener = () => void

export type IUploadToDrive = (
  queryID: string,
  needUploadFile: File,
  contentType: string,
  abortSignal: AbortSignal,
) => void

export interface IFileDetailInfo {
  loaded: number
  total: number
  status: FILE_ITEM_DETAIL_STATUS_IN_UI
  fileName: string
  contentType: string
  queryID: string
  abortController?: AbortController
  needUploadFile?: File
}

export type IUpdateFileUploadInfo = Partial<
  Pick<IFileDetailInfo, "status" | "loaded">
>
