import { Avatar, Card, Typography } from "antd"
import { FC } from "react"
import { IMobileTeamCardProps } from "./interface"
import {
  cardContainerStyle,
  cardHeaderContainerStyle,
  cardIconAndTitleContainerStyle,
  cardIconContainerStyle,
  cardTitleStyle,
  descriptionsStyle,
  mobileTeamCardContainerStyle,
  mobileTeamCardContentContainerStyle,
  moreButtonContainerStyle,
} from "./style"

const MobileTeamCard: FC<IMobileTeamCardProps> = (props) => {
  const { title, icon, moreButton, tags, description, onClickCard } = props

  return (
    <Card hoverable css={cardContainerStyle} onClick={onClickCard}>
      <div css={mobileTeamCardContainerStyle}>
        <div css={mobileTeamCardContentContainerStyle}>
          <div css={cardHeaderContainerStyle}>
            <div css={cardIconAndTitleContainerStyle}>
              <div css={cardIconContainerStyle}>
                <Avatar src={icon} alt={title} size={64} />
              </div>
              <span css={cardTitleStyle}>{title}</span>
            </div>
            {moreButton && (
              <div css={moreButtonContainerStyle}>{moreButton}</div>
            )}
          </div>
          <Typography.Paragraph
            css={descriptionsStyle}
            ellipsis={{
              rows: 2,
              expandable: false,
            }}
          >
            {description}
          </Typography.Paragraph>
          {tags && <div>{tags}</div>}
        </div>
      </div>
    </Card>
  )
}

export default MobileTeamCard
