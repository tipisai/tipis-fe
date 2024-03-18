import { IUploadDetailStore } from "./interface"

export const updateFileDetailStore: IUploadDetailStore = {
  fileDetailInfos: [],
  listeners: [],
  subscribe(listener) {
    updateFileDetailStore.listeners.push(listener)
    return () => {
      updateFileDetailStore.listeners = updateFileDetailStore.listeners.filter(
        (l) => l !== listener,
      )
    }
  },
  addFileDetailInfo(fileDetailInfo) {
    updateFileDetailStore.fileDetailInfos = [
      ...updateFileDetailStore.fileDetailInfos,
      fileDetailInfo,
    ]
    updateFileDetailStore.listeners.forEach((listener) => listener())
  },

  updateFileDetailInfo(queryID, fileDetailInfo) {
    const index = updateFileDetailStore.fileDetailInfos.findIndex(
      (item) => item.queryID === queryID,
    )
    if (index !== -1) {
      updateFileDetailStore.fileDetailInfos[index] = {
        ...updateFileDetailStore.fileDetailInfos[index],
        ...fileDetailInfo,
      }
      updateFileDetailStore.fileDetailInfos = [
        ...updateFileDetailStore.fileDetailInfos,
      ]
      updateFileDetailStore.listeners.forEach((listener) => listener())
    }
  },

  deleteFileDetailInfo(queryID) {
    updateFileDetailStore.fileDetailInfos =
      updateFileDetailStore.fileDetailInfos.filter(
        (item) => item.queryID !== queryID,
      )
    updateFileDetailStore.listeners.forEach((listener) => listener())
  },

  retryUpload(queryID, uploadFileToDrive) {
    const uploadInfo = updateFileDetailStore.fileDetailInfos.find(
      (item) => item.queryID === queryID,
    )
    if (uploadInfo && uploadInfo.uploadParams) {
      uploadFileToDrive(
        queryID,
        uploadInfo.uploadParams.fileData,
        uploadInfo.uploadParams,
        uploadInfo.abortController?.signal!,
      )
      updateFileDetailStore.listeners.forEach((listener) => listener())
    }
  },

  getSnapshot() {
    return updateFileDetailStore.fileDetailInfos
  },
}
