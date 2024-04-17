import Icon from "@ant-design/icons"
import { Button } from "antd"
import { memo } from "react"
import { SendIcon } from "@illa-public/icon"
import { IPresetCardProps } from "../../interface"
import {
  cardContentContainerStyle,
  cardDescStyle,
  cardTitleStyle,
  presetCardContainerStyle,
  sendButtonStyle,
} from "./style"

const PresetCard = memo((props: IPresetCardProps) => {
  const { title, description, id, onClickCard } = props
  const handleClick = () => {
    onClickCard(id)
  }
  return (
    <div css={presetCardContainerStyle} onClick={handleClick}>
      <div css={cardContentContainerStyle}>
        <p css={cardTitleStyle}>{title}</p>
        <p css={cardDescStyle}>{description}</p>
      </div>
      <Button
        id="sendButton"
        icon={<Icon component={SendIcon} />}
        size="large"
        css={sendButtonStyle}
      />
    </div>
  )
})

PresetCard.displayName = "PresetCard"

export default PresetCard
