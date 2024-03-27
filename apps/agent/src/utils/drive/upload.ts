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
      await putChatFileUploadStatus({
        fileID,
        status,
        teamID,
      })
      if (status === UPLOAD_FILE_STATUS.COMPLETE) {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
        })
        message.success(t("editor.inspect.setter_message.uploadsuc"))
        return fileID
      } else {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
        })
        message.error(t("editor.inspect.setter_message.uploadfail"))
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
      await putKnowledgeFileUploadStatus({
        fileID,
        status,
        teamID,
      })
      if (status === UPLOAD_FILE_STATUS.COMPLETE) {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
        })
        message.success(t("editor.inspect.setter_message.uploadsuc"))
        return fileID
      } else {
        store.updateFileDetailInfo(queryID, {
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
        })
        message.error(t("editor.inspect.setter_message.uploadfail"))
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
