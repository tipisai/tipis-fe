import Icon from "@ant-design/icons"
import { Button, List, Tag } from "antd"
import { FC, MouseEventHandler } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { MoreIcon, PenIcon, PlayFillIcon } from "@illa-public/icon"
import TeamCard from "@/components/TeamCard"
import { ITabInfo, TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import { getEditTipiPath, getRunTipiPath } from "@/utils/routeHelper"
import { ITeamCardListItemProps } from "./interface"

const TeamCardListItem: FC<ITeamCardListItemProps> = (props) => {
  const { icon, title, description, id, publishToMarketplace } = props

  const { teamIdentifier } = useParams()
  const tags = publishToMarketplace ? (
    <Tag color="purple">Marketplace</Tag>
  ) : undefined

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onClickCard = () => {
    navigate(getRunTipiPath(teamIdentifier!, id))
  }

  const onClickEditButton: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.EDIT_TIPIS,
      tabID: id,
      cacheID: id,
    }
    dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    navigate(getEditTipiPath(teamIdentifier!, id))
  }

  const onClickRunButton: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    const tabsInfo: ITabInfo = {
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.RUN_TIPIS,
      tabID: id,
      cacheID: id,
    }
    dispatch(recentTabActions.addRecentTabReducer(tabsInfo))
    navigate(getRunTipiPath(teamIdentifier!, id))
  }

  return (
    <List.Item>
      <TeamCard
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
