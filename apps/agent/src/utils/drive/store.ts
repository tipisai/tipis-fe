import {
  FILE_ITEM_DETAIL_STATUS_IN_UI,
  IFileDetailInfo,
  IListener,
  IUpdateFileUploadInfo,
  IUploadToDrive,
} from "./interface"

export class UploadFileStore {
  fileDetailInfos: IFileDetailInfo[]
  listeners: IListener[]

  constructor() {
    this.fileDetailInfos = []
    this.listeners = []
  }

  subscribe(listener: IListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  addFileDetailInfo(fileDetailInfo: IFileDetailInfo) {
    this.fileDetailInfos = [...this.fileDetailInfos, fileDetailInfo]
    this.listeners.forEach((listener) => listener())
  }

  updateFileDetailInfo(queryID: string, fileDetailInfo: IUpdateFileUploadInfo) {
    const index = this.fileDetailInfos.findIndex(
      (item) => item.queryID === queryID,
    )
    if (index !== -1) {
      this.fileDetailInfos[index] = {
        ...this.fileDetailInfos[index],
        ...fileDetailInfo,
      }
      this.fileDetailInfos = [...this.fileDetailInfos]
      this.listeners.forEach((listener) => listener())
    }
  }

  deleteFileDetailInfo(queryID: string) {
    const index = this.fileDetailInfos.findIndex(
      (item) => item.queryID === queryID,
    )
    if (index !== -1) {
      const needDelFile = this.fileDetailInfos[index]
      if (
        needDelFile.status === FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING ||
        needDelFile.status === FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING
      ) {
        needDelFile.abortController?.abort()
      }
      this.fileDetailInfos.splice(index, 1)
    }
    this.listeners.forEach((listener) => listener())
  }

  mulDeleteFileDetailInfo(queryIDs: string[]) {
    for (let queryID of queryIDs) {
      this.deleteFileDetailInfo(queryID)
    }
    this.listeners.forEach((listener) => listener())
  }

  retryUpload(queryID: string, uploadFileToDrive: IUploadToDrive) {
    const uploadInfo = this.fileDetailInfos.find(
      (item) => item.queryID === queryID,
    )
    if (uploadInfo && uploadInfo.needUploadFile) {
      uploadFileToDrive(
        queryID,
        uploadInfo.needUploadFile,
        uploadInfo.abortController?.signal!,
      )
      this.listeners.forEach((listener) => listener())
    }
  }

  getSnapshot() {
    return this.fileDetailInfos
  }

  getFileInfo(nameOrId: string) {
    return this.fileDetailInfos.find(
      (item) => item.fileName === nameOrId || item.queryID === nameOrId,
    )
  }

  clearStore() {
    if (
      this.fileDetailInfos.some(
        (item) =>
          item.status === FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING ||
          item.status === FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
      )
    ) {
      for (let { queryID, status } of this.fileDetailInfos) {
        if (
          status === FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING ||
          status === FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING
        ) {
          this.deleteFileDetailInfo(queryID)
        }
      }
    }
    this.fileDetailInfos = []
    this.listeners.forEach((listener) => listener())
  }

  hasPendingFile() {
    return this.fileDetailInfos.some(
      (item) =>
        item.status === FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING ||
        item.status === FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
    )
  }
}
