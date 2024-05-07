import { ConfigProvider, List, Tag } from "antd"
import { FC } from "react"
import MobileTeamCard from "@/components/TeamCard/mobile"
import { ITeamCardListItemProps } from "../../../components/TeamCardList/interface"

const MobileTeamCardListItem: FC<ITeamCardListItemProps> = (props) => {
  const { icon, title, description, publishToMarketplace } = props

  const tags = publishToMarketplace ? (
    <Tag color="purple">Marketplace</Tag>
  ) : undefined

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
        <MobileTeamCard
          icon={icon}
          title={title}
          description={description}
          tags={tags}
          moreButton={undefined}
        />
      </List.Item>
    </ConfigProvider>
  )
}

export default MobileTeamCardListItem
