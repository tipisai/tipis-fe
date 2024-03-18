import {
  DRIVE_FILE_TYPE,
  FILE_CATEGORY,
  GCS_OBJECT_TYPE,
  IILLAFileInfo,
  SORTED_TYPE,
  UPLOAD_FILE_DUPLICATION_HANDLER,
} from "@illa-public/public-types"

export interface IGetFileListRequestData {
  path: string
  page?: number
  limit?: number
  type: DRIVE_FILE_TYPE
  search?: string
  sortedBy?: string
  sortedType?: SORTED_TYPE
  fileCategory?: FILE_CATEGORY
}

export interface IGetFileListResponseData {
  path: string
  currentFolderID: string
  files: IILLAFileInfo[]
  total: number
  pageSize: number
  pageIndex: number
}

export interface IGetUploadFileURLResponse {
  id: string
  name: string
  folderID: string
  type: GCS_OBJECT_TYPE
  resumable: boolean
  url: string
}

export interface IGetUploadFileURLRequest {
  name: string
  type: GCS_OBJECT_TYPE
  contentType: string
  size: number
  folderID: string
  duplicationHandler: UPLOAD_FILE_DUPLICATION_HANDLER
}
