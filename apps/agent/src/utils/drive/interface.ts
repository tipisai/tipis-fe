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
export interface FileDetailInfos {
  loaded: number
  total: number
  status: FILE_ITEM_DETAIL_STATUS_IN_UI
  fileName: string
  contentType: string
  queryID: string
  abortController?: AbortController
  uploadParams?: IUploadParams
}
export interface IUploadDetailStore {
  fileDetailInfos: FileDetailInfos[]
  listeners: (() => void)[]
  subscribe: (onStoreChange: () => void) => () => void
  addFileDetailInfo: (fileDetailInfo: FileDetailInfos) => void
  updateFileDetailInfo: (
    queryID: string,
    fileDetailInfo: Partial<{
      loaded: number
      total: number
      status: FILE_ITEM_DETAIL_STATUS_IN_UI
      uploadParams: IUploadParams
    }>,
  ) => void
  deleteFileDetailInfo: (queryID: string) => void
  retryUpload: (
    queryID: string,
    uploadFileToDrive: (
      queryID: string,
      needUploadFile: File,
      fileOptions: {
        folder: string
        replace: boolean
      },
      abortSignal: AbortSignal,
    ) => void,
  ) => void
  getSnapshot: () => FileDetailInfos[]
}

export enum GET_SINGED_URL_ERROR_CODE {
  NOT_HAS_ROOT_FOLDER = "NOT_HAS_ROOT_FOLDER",
  UPLOAD_FAILED = "UPLOAD_FAILED",
}
