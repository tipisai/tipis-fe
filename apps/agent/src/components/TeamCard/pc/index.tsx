import { Avatar, Card, Typography } from "antd"
import { FC } from "react"
import { IPCTeamCardProps } from "./interface"
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

const PCTeamCard: FC<IPCTeamCardProps> = (props) => {
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
          {moreButton && <div css={moreButtonContainerStyle}>{moreButton}</div>}
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
        {(tags || editButton) && (
          <div css={teamCardFooterContainerStyle(!!tags)}>
            {tags && <div>{tags}</div>}
            {editButton && (
              <div css={footerButtonContainerStyle}>{editButton}</div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export default PCTeamCard
