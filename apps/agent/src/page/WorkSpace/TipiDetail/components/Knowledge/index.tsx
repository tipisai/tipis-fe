import { Tag } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE } from "@illa-public/public-types"
import { IKnowledgeProps } from "./interface"
import {
  fileNameStyle,
  fileTypeIconStyle,
  knowledgeContainerStyle,
  labelStyle,
  tagContainerStyle,
} from "./style"

const Knowledge: FC<IKnowledgeProps> = (props) => {
  const { t } = useTranslation()
  return (
    <div css={knowledgeContainerStyle}>
      <p css={labelStyle}>{t("homepage.edit_tipi.modal.knowledge")}</p>
      <div css={tagContainerStyle}>
        {props.knowledge.map(({ fileName, contentType }) => (
          <Tag
            key={fileName}
            bordered
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${getColor("grayBlue", "08")}`,
              color: getColor("grayBlue", "02"),
              padding: "5px 8px",
              borderRadius: "12px",
              backgroundColor: "white",
            }}
            icon={getFileIconByContentType(
              GCS_OBJECT_TYPE.FILE,
              contentType,
              fileTypeIconStyle,
            )}
          >
            <span css={fileNameStyle}>{fileName}</span>
          </Tag>
        ))}
      </div>
    </div>
  )
}

Knowledge.displayName = "Knowledge"
export default Knowledge
