import { v4 } from "uuid"
import { IKnowledgeFile } from "@illa-public/public-types"
import { SEND_CONTENT_TYPES, TYPE_MAPPING } from "@/config/constants/knowledge"
import { FILE_ITEM_DETAIL_STATUS_IN_UI, UploadFileStore } from "."
import { fileToString } from "../file/fileToStream"

export const multipleFileHandler = async (
  files: File[],
  currentFiles: Omit<IKnowledgeFile, "fileID">[],
  fileStore: UploadFileStore,
) => {
  const needUploadFiles: {
    fileName: string
    abortController: AbortController
    file: File
    queryID: string
    contentType: string
  }[] = []
  const notAcceptFiles: File[] = []
  for (let file of files) {
    const abortController = new AbortController()
    const index = currentFiles.findIndex(
      (item) => item.fileName === file.name && item.contentType === file.type,
    )
    const fileNameArr = file.name.split(".")
    const contentType = await getRealFileType(file, fileNameArr[1])

    if (!contentType) {
      notAcceptFiles.push(file)
      continue
    }

    const queryID = `${file.name}_${new Date().getTime()}`
    const fileName =
      index !== -1
        ? `${fileNameArr[0]}(${v4().slice(0, 3)}).${fileNameArr[1]}`
        : file.name

    fileStore.addFileDetailInfo({
      loaded: 0,
      total: file.size,
      status: FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
      fileName: fileName,
      contentType,
      queryID,
      abortController,
      needUploadFile: file,
    })
    needUploadFiles.push({
      fileName,
      abortController,
      file,
      queryID,
      contentType,
    })
  }

  return { needUploadFiles, notAcceptFiles }
}

export const getRealFileType = async (file: File, ext: string) => {
  if (!!file.type) return file.type
  const str = await fileToString(file)
  if (str.startsWith(TYPE_MAPPING.PDF)) {
    return SEND_CONTENT_TYPES.PDF
  } else if (str.startsWith(TYPE_MAPPING.ZIP)) {
    switch (ext) {
      case ".docx": {
        return SEND_CONTENT_TYPES.DOCX
      }
      case "xlsx":
      case "csv": {
        return SEND_CONTENT_TYPES.XLSX
      }
    }
  } else {
    switch (ext) {
      case "txt": {
        return SEND_CONTENT_TYPES.TEXT
      }
      case "md":
      case "mdx": {
        return SEND_CONTENT_TYPES.MD
      }
      case "json":
      case "json5": {
        return SEND_CONTENT_TYPES.JSON
      }
      case "csv": {
        return SEND_CONTENT_TYPES.CSV
      }
      case "": {
        return SEND_CONTENT_TYPES.TEXT
      }
    }
  }
}
