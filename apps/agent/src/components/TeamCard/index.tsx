import { Avatar, Card, Typography } from "antd"
import { FC } from "react"
import { ITeamCardProps } from "./interface"
import {
  cardContainerStyle,
  cardHeaderContainerStyle,
  cardIconAndTitleContainerStyle,
  cardIconContainerStyle,
  cardTitleStyle,
  descriptionsStyle,
  footerButtonContainerStyle,
  moreButtonContainerStyle,
  teamCardContainerStyle,
  teamCardFooterContainerStyle,
} from "./style"

const TeamCard: FC<ITeamCardProps> = (props) => {
  const {
    title,
    icon,
    moreButton,
    editButton,
    tags,
    description,
    onClickCard,
  } = props

  return (
    <Card hoverable css={cardContainerStyle} onClick={onClickCard}>
      <div css={teamCardContainerStyle}>
        <div css={cardHeaderContainerStyle}>
          <div css={cardIconAndTitleContainerStyle}>
            <div css={cardIconContainerStyle}>
              <Avatar src={icon} alt={title} size={64} />
            </div>
            <span css={cardTitleStyle}>{title}</span>
          </div>
          <div css={moreButtonContainerStyle}>{moreButton}</div>
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
        <div css={teamCardFooterContainerStyle}>
          <div>{tags}</div>
          <div css={footerButtonContainerStyle}>{editButton}</div>
        </div>
      </div>
    </Card>
  )
}

export default TeamCard
