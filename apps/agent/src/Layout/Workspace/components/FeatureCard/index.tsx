import { FC } from "react"
import { IFeatureCardProps } from "./interface"
import { featureCardContainerStyle, titleStyle } from "./style"

const FeatureCard: FC<IFeatureCardProps> = (props) => {
  const { icon, title, position, onClick } = props
  return (
    <div css={featureCardContainerStyle(position)} onClick={onClick}>
      {icon}
      <span css={titleStyle}>{title}</span>
    </div>
  )
}

export default FeatureCard
