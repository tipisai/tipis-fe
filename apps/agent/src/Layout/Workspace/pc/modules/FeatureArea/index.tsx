import Icon from "@ant-design/icons"
import { FC } from "react"
import { PenIcon, PlusIcon } from "@illa-public/icon"
import MarketplaceIcon from "@/assets/workspace/marketplace.svg?react"
import FeatureCard from "../../components/FeatureCard"
import MenuItemButton from "../../components/MenuItemButton"
import { featureAreaContainerStyle, featureCardsContainerStyle } from "./style"

const FeatureArea: FC = () => {
  return (
    <div css={featureAreaContainerStyle}>
      <div css={featureCardsContainerStyle}>
        <FeatureCard
          icon={<Icon component={MarketplaceIcon} />}
          title="Explore tipi"
          position="left"
        />
        <FeatureCard
          icon={<Icon component={MarketplaceIcon} />}
          title="Function"
          position="right"
        />
      </div>
      <MenuItemButton text="New Chat" icon={<Icon component={PlusIcon} />} />
      <MenuItemButton
        text="Create a tipis"
        icon={<Icon component={PenIcon} />}
      />
    </div>
  )
}

export default FeatureArea
