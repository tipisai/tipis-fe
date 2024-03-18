import { v4 } from "uuid"
import { IKnowledgeFile } from "@illa-public/public-types"
import {
  FILE_ITEM_DETAIL_STATUS_IN_UI,
  IUploadParams,
  updateFileDetailStore,
} from "."

export const getPathForSignedUrl = (path: string) => {
  if (path === "root") {
    return ""
  } else {
    return path.replace("root/", "")
  }
}

export const multipleFileHandler = (
  files: File[],
  currentFiles: Omit<IKnowledgeFile, "value">[],
  uploadParams: Omit<IUploadParams, "fileData">,
  unAddStore?: boolean,
) => {
  const res = files.map((file) => {
    const abortController = new AbortController()
    const index = currentFiles.findIndex(
      (item) => item.fileName === file.name && item.contentType === file.type,
    )

    const queryID = `${file.name}_${new Date().getTime()}`
    const fileName =
      index !== -1
        ? `${file.name.split(".")[0]}(${v4().slice(0, 3)})`
        : file.name

    !unAddStore &&
      updateFileDetailStore.addFileDetailInfo({
        loaded: 0,
        total: 0,
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
        fileName: fileName,
        contentType: file.type,
        queryID,
        abortController,
        uploadParams: {
          ...uploadParams,
          fileData: file,
        },
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
