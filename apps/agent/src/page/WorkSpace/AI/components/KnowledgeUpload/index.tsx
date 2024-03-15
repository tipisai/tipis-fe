import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { ChangeEvent, FC, useRef } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { getFileIconByContentType } from "@illa-public/icon"
import {
  DeleteIcon,
  LoadingIcon,
  SuccessIcon,
  UploadIcon,
} from "@illa-public/icon"
import { GCS_OBJECT_TYPE, IKnowledgeFile } from "@illa-public/public-types"
import {
  ACCEPT,
  MAX_FILE_SIZE,
  MAX_MESSAGE_FILES_LENGTH,
} from "@/config/constants/knowledge"
import { handleParseFile } from "@/utils/file"
import {
  fileItemStyle,
  fileListContainerStyle,
  fileNameStyle,
  fileTypeIconStyle,
  iconHotSpotStyle,
  nameContainerStyle,
  opeationStyle,
} from "./style"

interface KnowledgeUploadProps {
  addFile: (file: IKnowledgeFile, isUpdate?: boolean) => void
  removeFile: (name: string) => void
  values: IKnowledgeFile[]
}

const KnowledgeUpload: FC<KnowledgeUploadProps> = ({
  values,
  removeFile,
  addFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const { message: messageAPI, modal } = App.useApp()

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    const file = files && files[0]
    if (!file) return
    try {
      if (file.size > MAX_FILE_SIZE) {
        messageAPI.warning({
          content: t("dashboard.message.please_use_a_file_wi"),
        })
        return
      }
      const fileItem = {
        name: file.name,
        type: file.type,
      }
      addFile(fileItem)
      const value = await handleParseFile(file)
      if (value === "") {
        messageAPI.warning({
          content: t("dashboard.message.no_usable_text_conte"),
        })
        removeFile(file.name)
      } else {
        const fileItem = {
          name: file.name,
          type: file.type,
          value,
        }
        addFile(fileItem, true)
      }
    } catch (e) {
      messageAPI.error({
        content: t("dashboard.message.no_usable_text_conte"),
      })
    }
    inputRef.current && (inputRef.current.value = "")
  }

  const handleDelete = (name: string) => {
    modal.confirm({
      title: t("drive.modal.delete_going_on_task.title"),
      content: t("drive.modal.delete_going_on_task.description"),
      okText: t("drive.modal.delete_going_on_task.delete"),
      cancelText: t("drive.modal.delete_going_on_task.cancel"),
      onOk: () => removeFile(name),
    })
  }

  const handleUploadFile = () => {
    if (Array.isArray(values) && values.length >= MAX_MESSAGE_FILES_LENGTH) {
      messageAPI.warning({
        content: t("dashboard.message.support_for_up_to_10"),
      })
      return
    }
    inputRef.current?.click()
  }
  return (
    <>
      <div>
        <Button
          block
          type="dashed"
          icon={<Icon component={UploadIcon} />}
          onClick={handleUploadFile}
        >
          Upload
        </Button>
        <input
          style={{ display: "none" }}
          type="file"
          accept={ACCEPT.join(",")}
          ref={inputRef}
          onChange={handleOnChange}
        />
      </div>
      {Array.isArray(values) && values.length > 0 && (
        <div css={fileListContainerStyle}>
          {values.map((fileInfo) => (
            <div key={fileInfo.name} css={fileItemStyle}>
              <div css={nameContainerStyle}>
                {getFileIconByContentType(
                  GCS_OBJECT_TYPE.FILE,
                  fileInfo.type,
                  fileTypeIconStyle,
                )}
                <span css={fileNameStyle}>{fileInfo.name}</span>
              </div>
              <div css={opeationStyle}>
                {fileInfo.value ? (
                  <Icon
                    component={SuccessIcon}
                    color={getColor("green", "03")}
                  />
                ) : (
                  <Icon
                    component={LoadingIcon}
                    color={getColor("grayBlue", "02")}
                    spin
                  />
                )}
                <span
                  css={iconHotSpotStyle}
                  onClick={() => handleDelete(fileInfo.name)}
                >
                  <Icon component={DeleteIcon} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default KnowledgeUpload
