import { App } from "antd"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { UPLOAD_FILE_STATUS } from "@illa-public/public-types"
import { useCreditModal } from "@illa-public/upgrade-modal"
import { BILLING_REPORT_FROM } from "@illa-public/upgrade-modal/constants"
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
import { isGenerateDescWithCreditError } from "./utils"

export const useUploadFileToDrive = () => {
  const { message } = App.useApp()
  const { t } = useTranslation()
  const teamID = useSelector(getCurrentId)!
  const creditModal = useCreditModal()

  const [triggerGetChatUploadAddress] = useLazyGetChatUploadAddressQuery()
  const [triggerGetKnowledgeUploadAddress] =
    useLazyGetKnowledgeUploadAddressQuery()

  const [putChatFileUploadStatus] = usePutChatFileUploadStatusMutation()
  const [putKnowledgeFileUploadStatus] =
    usePutKnowledgeFileUploadStatusMutation()

  const uploadChatFile = async (
    queryID: string,
    needUploadFile: File,
    contentType: string,
    abortSignal: AbortSignal,
    store: UploadFileStore,
  ) => {
    try {
      if (!store.getFileInfo(queryID)) {
        return
      }
      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
      })
      const { uploadAddress, fileID } = await triggerGetChatUploadAddress({
        name: needUploadFile.name,
        contentType,
        size: needUploadFile.size,
        teamID,
      }).unwrap()

      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING,
      })

      const processCallback = (loaded: number) => {
        store.updateFileDetailInfo(queryID!, {
          loaded: loaded,
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING,
        })
      }
      const status = await uploadFileToObjectStorage(
        uploadAddress,
        needUploadFile,
        processCallback,
        abortSignal,
      )
      const updateStatusRes = await putChatFileUploadStatus({
        fileID,
        status,
        teamID,
      }).unwrap()
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
        return updateStatusRes
      }
    } catch (e) {
      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
      })
      isGenerateDescWithCreditError(e) &&
        creditModal({
          from: BILLING_REPORT_FROM.RUN,
        })
      message.error(t("editor.inspect.setter_message.uploadfail"))
    }
  }

  const uploadKnowledgeFile = async (
    queryID: string,
    needUploadFile: File,
    contentType: string,
    abortSignal: AbortSignal,
    store: UploadFileStore,
  ) => {
    if (!store.getFileInfo(queryID)) {
      return
    }
    try {
      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING,
      })
      const { uploadAddress, fileID } = await triggerGetKnowledgeUploadAddress({
        name: needUploadFile.name,
        contentType,
        size: needUploadFile.size,
        teamID,
      }).unwrap()

      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING,
      })

      const processCallback = (loaded: number) => {
        store.updateFileDetailInfo(queryID!, {
          loaded: loaded,
          status: FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING,
        })
      }
      const status = await uploadFileToObjectStorage(
        uploadAddress,
        needUploadFile,
        processCallback,
        abortSignal,
      )
      const updateStatusRes = await putKnowledgeFileUploadStatus({
        fileID,
        status,
        teamID,
      }).unwrap()
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
        return updateStatusRes
      }
    } catch (e) {
      store.updateFileDetailInfo(queryID, {
        status: FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR,
      })
      isGenerateDescWithCreditError(e) &&
        creditModal({
          from: BILLING_REPORT_FROM.RUN,
        })
      message.error(t("editor.inspect.setter_message.uploadfail"))
    }
  }

  return {
    uploadChatFile,
    uploadKnowledgeFile,
  }
}
