import { App } from "antd"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { UPLOAD_FILE_STATUS } from "@illa-public/public-types"
import { getCurrentId } from "@illa-public/user-data"
import {
  useLazyGetChatUploadAddressQuery,
  useLazyGetKnowledgeUploadAddressQuery,
  usePutChatFileUploadStatusMutation,
  usePutKnowledgeFileUploadStatusMutation,
} from "@/redux/services/driveAPI"
import { uploadFileToObjectStorage } from "@/services/drive"
import { DEFAULT_CONTENT_TYPE } from "./constant"
import { FILE_ITEM_DETAIL_STATUS_IN_UI } from "./interface"
import { UploadFileStore } from "./store"

export const useUploadFileToDrive = () => {
  const { message } = App.useApp()
  const { t } = useTranslation()
  const teamID = useSelector(getCurrentId)!

  const [triggerGetChatUploadAddress] = useLazyGetChatUploadAddressQuery()
  const [triggerGetKnowledgeUploadAddress] =
    useLazyGetKnowledgeUploadAddressQuery()

  const [putChatFileUploadStatus] = usePutChatFileUploadStatusMutation()
  const [putKnowledgeFileUploadStatus] =
    usePutKnowledgeFileUploadStatusMutation()

  const uploadChatFile = async (
    queryID: string,
    needUploadFile: File,
    abortSignal: AbortSignal,
    store: UploadFileStore,
  ) => {
    try {
      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
      })
      const { uploadAddress, fileID } = await triggerGetChatUploadAddress({
        name: needUploadFile.name,
        contentType: needUploadFile.type || DEFAULT_CONTENT_TYPE,
        size: needUploadFile.size,
        teamID,
      }).unwrap()

      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING,
      })
      const status = await uploadFileToObjectStorage(
        uploadAddress,
        needUploadFile,
        abortSignal,
      )
      const updateStatusRes = await putChatFileUploadStatus({
        fileID,
        status,
        teamID,
      })
      if (status === UPLOAD_FILE_STATUS.FAILED || "error" in updateStatusRes) {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
        })
        message.error(t("editor.inspect.setter_message.uploadfail"))
      } else if (status === UPLOAD_FILE_STATUS.CANCELED) {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
        })
      } else {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
        })
        message.success(t("editor.inspect.setter_message.uploadsuc"))
        return fileID
      }
    } catch (e) {
      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
      })
      message.error(t("editor.inspect.setter_message.uploadfail"))
    }
  }

  const uploadKnowledgeFile = async (
    queryID: string,
    needUploadFile: File,
    abortSignal: AbortSignal,
    store: UploadFileStore,
  ) => {
    try {
      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
      })
      const { uploadAddress, fileID } = await triggerGetKnowledgeUploadAddress({
        name: needUploadFile.name,
        contentType: needUploadFile.type,
        size: needUploadFile.size,
        teamID,
      }).unwrap()

      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING,
      })
      const status = await uploadFileToObjectStorage(
        uploadAddress,
        needUploadFile,
        abortSignal,
      )
      const updateStatusRes = await putKnowledgeFileUploadStatus({
        fileID,
        status,
        teamID,
      })
      if (status === UPLOAD_FILE_STATUS.FAILED || "error" in updateStatusRes) {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
        })
        message.error(t("editor.inspect.setter_message.uploadfail"))
      } else if (status === UPLOAD_FILE_STATUS.CANCELED) {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
        })
      } else {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
        })
        message.success(t("editor.inspect.setter_message.uploadsuc"))
        return fileID
      }
    } catch (e) {
      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
      })
      message.error(t("editor.inspect.setter_message.uploadfail"))
    }
  }

  return {
    uploadChatFile,
    uploadKnowledgeFile,
  }
}
