import { v4 } from "uuid"
import { IKnowledgeFile } from "@illa-public/public-types"
import { FILE_ITEM_DETAIL_STATUS_IN_UI, UploadFileStore } from "."

export const multipleFileHandler = (
  files: File[],
  currentFiles: Omit<IKnowledgeFile, "fileID">[],
  fileStore: UploadFileStore,
) => {
  const res = files.map((file) => {
    const abortController = new AbortController()
    const index = currentFiles.findIndex(
      (item) => item.fileName === file.name && item.contentType === file.type,
    )

    const queryID = `${file.name}_${new Date().getTime()}`
    const fileNameArr = file.name.split(".")
    const fileName =
      index !== -1
        ? `${fileNameArr[0]}(${v4().slice(0, 3)}).${fileNameArr[1]}`
        : file.name

    fileStore.addFileDetailInfo({
      status: FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
      fileName: fileName,
      contentType: file.type,
      queryID,
      abortController,
      needUploadFile: file,
    })
    return {
      fileName,
      abortController,
      file,
      queryID,
    }
  })
  return res
}
