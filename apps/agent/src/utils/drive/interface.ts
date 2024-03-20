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
  fileOptions: {
    folder: string
    replace: boolean
  },
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
  uploadParams?: IUploadParams
}

export type IUpdateFileUploadInfo = Partial<
  Pick<IFileDetailInfo, "loaded" | "total" | "status" | "uploadParams">
>

export enum GET_SINGED_URL_ERROR_CODE {
  NOT_HAS_ROOT_FOLDER = "NOT_HAS_ROOT_FOLDER",
  UPLOAD_FAILED = "UPLOAD_FAILED",
}
