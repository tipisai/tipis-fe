import { App } from "antd"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { isILLAAPiError } from "@illa-public/illa-net"
import {
  DRIVE_FILE_TYPE,
  GCS_OBJECT_TYPE,
  UPLOAD_FILE_DUPLICATION_HANDLER,
  UPLOAD_FILE_STATUS,
} from "@illa-public/public-types"
import {
  CollarModalType,
  handleCollaPurchaseError,
} from "@illa-public/upgrade-modal"
import { getCurrentId } from "@illa-public/user-data"
import {
  useLazyGetFileListQuery,
  useLazyGetUploadURLQuery,
  usePutUploadStatusMutation,
} from "@/redux/services/driveAPI"
import { updateFilesToDrive } from "@/services/drive"
import {
  FILE_ITEM_DETAIL_STATUS_IN_UI,
  GET_SINGED_URL_ERROR_CODE,
} from "./interface"
import { updateFileDetailStore } from "./store"

export const useUploadFileToDrive = () => {
  const { message } = App.useApp()
  const { t } = useTranslation()
  const [triggerGetFileList] = useLazyGetFileListQuery()
  const [triggerGetUploadURLQuery] = useLazyGetUploadURLQuery()
  const [updateUploadStatus] = usePutUploadStatusMutation()

  const teamID = useSelector(getCurrentId)!

  const getUploadToDriveSingedURL = async (
    folderPath: string,
    fileInfo: {
      fileName: string
      size: number
      contentType: string
      replace: boolean
    },
  ) => {
    try {
      const fileList = await triggerGetFileList({
        req: {
          path: "/root",
          type: DRIVE_FILE_TYPE.MIX,
        },
        teamID,
      }).unwrap()
      if (!fileList.currentFolderID)
        throw new Error(GET_SINGED_URL_ERROR_CODE.UPLOAD_FAILED)
      const singedURLResponse = await triggerGetUploadURLQuery({
        req: {
          name: folderPath
            ? `${folderPath}/${fileInfo.fileName}`
            : fileInfo.fileName,
          type: GCS_OBJECT_TYPE.FILE,
          contentType: fileInfo.contentType,
          size: fileInfo.size,
          folderID: fileList.currentFolderID,
          duplicationHandler: fileInfo.replace
            ? UPLOAD_FILE_DUPLICATION_HANDLER.COVER
            : UPLOAD_FILE_DUPLICATION_HANDLER.RENAME,
        },
        teamID,
      }).unwrap()
      return {
        url: singedURLResponse.url,
        fileID: singedURLResponse.id,
        fileName: singedURLResponse.name,
      }
    } catch (e) {
      if (isILLAAPiError(e)) {
        return Promise.reject(e)
      }
      throw new Error(GET_SINGED_URL_ERROR_CODE.UPLOAD_FAILED)
    }
  }

  const uploadFileToDrive = async (
    queryID: string,
    needUploadFile: File,
    fileOptions: {
      folder: string
      replace: boolean
    },
    abortSignal: AbortSignal,
  ) => {
    const { folder, replace } = fileOptions
    try {
      updateFileDetailStore.updateFileDetailInfo(queryID, {
        loaded: 0,
        total: needUploadFile.size,
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
      })
      const uploadURLResponse = await getUploadToDriveSingedURL(folder, {
        fileName: needUploadFile.name,
        size: needUploadFile.size,
        contentType: needUploadFile.type,
        replace,
      })

      updateFileDetailStore.updateFileDetailInfo(queryID, {
        loaded: 0,
        total: needUploadFile.size,
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING,
      })

      const processCallback = (loaded: number) => {
        updateFileDetailStore.updateFileDetailInfo(queryID!, {
          loaded: loaded,
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING,
        })
      }
      const status = await updateFilesToDrive(
        uploadURLResponse.url,
        needUploadFile,
        processCallback,
        abortSignal,
      )
      await updateUploadStatus({
        fileID: uploadURLResponse.fileID,
        status,
        teamID,
      })
      if (status === UPLOAD_FILE_STATUS.COMPLETE) {
        updateFileDetailStore.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
        })
        message.success(t("editor.inspect.setter_message.uploadsuc"))
        return {
          id: uploadURLResponse.fileID,
          name: uploadURLResponse.fileName,
        }
      } else {
        updateFileDetailStore.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
        })
        message.error(t("editor.inspect.setter_message.uploadfail"))
      }
    } catch (e) {
      updateFileDetailStore.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
      })
      // TODO: WTF  add  report from
      const isCollaError = handleCollaPurchaseError(
        e,
        CollarModalType.STORAGE,
        "",
      )
      !isCollaError &&
        message.error(t("editor.inspect.setter_message.uploadfail"))
    }
  }

  return {
    uploadFileToDrive,
  }
}
