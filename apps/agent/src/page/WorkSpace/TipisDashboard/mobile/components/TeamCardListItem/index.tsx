import { ConfigProvider, List, Tag } from "antd"
import { FC } from "react"
import { v4 } from "uuid"
import { TipisTrack } from "@illa-public/track-utils"
import TeamCard from "@/components/TeamCard"
import { useNavigateToRunTipis } from "@/utils/routeHelper/hook"
import { ITeamCardListItemProps } from "../../../components/TeamCardList/interface"

const MobileTeamCardListItem: FC<ITeamCardListItemProps> = (props) => {
  const { icon, title, description, id, publishToMarketplace } = props

  const tags = publishToMarketplace ? (
    <Tag color="purple">Marketplace</Tag>
  ) : undefined

  const navigateRunTipis = useNavigateToRunTipis()

  const onClickCard = () => {
    TipisTrack.track("click_run_tipi_entry", {
      parameter1: "dashboard",
    })
    navigateRunTipis(
      {
        tipisID: id,
        tipisIcon: icon,
        tipisName: title,
      },
      v4(),
    )
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            paddingLG: 16,
          },
        },
      }}
    >
      <List.Item>
        <TeamCard
          icon={icon}
          title={title}
          description={description}
          tags={tags}
          onClickCard={onClickCard}
          moreButton={null}
          editButton={null}
        />
      </List.Item>
    </ConfigProvider>
  )
}

export default MobileTeamCardListItem
