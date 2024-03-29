import { Tag } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { IKnowledgeProps } from "./interface"
import { knowledgeContainerStyle, labelStyle, tagContainerStyle } from "./style"

const Knowledge: FC<IKnowledgeProps> = (props) => {
  const { t } = useTranslation()
  return (
    <div css={knowledgeContainerStyle}>
      <p css={labelStyle}>{t("homepage.edit_tipi.modal.knowledge")}</p>
      <div css={tagContainerStyle}>
        {props.knowledgeNames.map((name) => (
          <Tag key={name}>{name}</Tag>
        ))}
      </div>
    </div>
  )
}

Knowledge.displayName = "Knowledge"
export default Knowledge
