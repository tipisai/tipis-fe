import { memo } from "react"
import { IPresetCardProps } from "../../interface"
import {
  cardContentContainerStyle,
  cardDescStyle,
  cardTitleStyle,
  presetCardContainerStyle,
} from "./style"

const PresetCard = memo((props: IPresetCardProps) => {
  const { title, description, id, onClickCard } = props
  const handleClick = () => {
    onClickCard(id)
  }
  return (
    <div
      css={presetCardContainerStyle}
      onClick={handleClick}
      className="presetCard"
    >
      <div css={cardContentContainerStyle}>
        <p css={cardTitleStyle}>{title}</p>
        <p css={cardDescStyle}>{description}</p>
      </div>
    </div>
  )
})

PresetCard.displayName = "PresetCard"

export default PresetCard
