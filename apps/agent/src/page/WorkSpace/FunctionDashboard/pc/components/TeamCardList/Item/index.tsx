import Icon from "@ant-design/icons"
import { Button, List, Tag } from "antd"
import { FC, MouseEventHandler } from "react"
import { useNavigate } from "react-router-dom"
import { MoreIcon, PenIcon, PlayFillIcon } from "@illa-public/icon"
import PCTeamCard from "@/components/TeamCard/pc"
import { ITeamCardListItemProps } from "./interface"

const TeamCardListItem: FC<ITeamCardListItemProps> = (props) => {
  const { icon, title, description, id, publishToMarketplace } = props

  const tags = publishToMarketplace ? (
    <Tag color="purple">Marketplace</Tag>
  ) : undefined

  const navigate = useNavigate()

  const onClickCard = () => {}

  const onClickEditButton: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    navigate(`edit/${id}`)
  }

  const onClickRunButton: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    navigate(`run/${id}`)
  }

  return (
    <List.Item>
      <PCTeamCard
        icon={icon}
        title={title}
        description={description}
        tags={tags}
        onClickCard={onClickCard}
        moreButton={<Button type="text" icon={<Icon component={MoreIcon} />} />}
        editButton={
          <>
            <Button
              type="text"
              icon={<Icon component={PenIcon} />}
              onClick={onClickEditButton}
            >
              Edit
            </Button>
            <Button
              type="text"
              icon={<Icon component={PlayFillIcon} />}
              onClick={onClickRunButton}
            >
              Run
            </Button>
          </>
        }
      />
    </List.Item>
  )
}

export default TeamCardListItem
