import { Tag } from "antd"
import { FC } from "react"
import { IKnowledgeProps } from "./interface"
import { knowledgeContainerStyle, labelStyle, tagContainerStyle } from "./style"

const Knowledge: FC<IKnowledgeProps> = (props) => {
  return (
    <div css={knowledgeContainerStyle}>
      <p css={labelStyle}>Knowledge</p>
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
