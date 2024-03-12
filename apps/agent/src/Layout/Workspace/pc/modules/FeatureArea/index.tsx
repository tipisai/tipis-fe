import Icon from "@ant-design/icons"
import { FC } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { PenIcon, PlusIcon } from "@illa-public/icon"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import MarketplaceIcon from "@/assets/workspace/marketplace.svg?react"
import FeatureCard from "../../components/FeatureCard"
import MenuItemButton from "../../components/MenuItemButton"
import { featureAreaContainerStyle, featureCardsContainerStyle } from "./style"

const FeatureArea: FC = () => {
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const handleClickCreateTipis = () => {
    navigate(`/workspace/${currentTeamInfo?.identifier}/ai-agent`)
  }
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
        onClick={handleClickCreateTipis}
      />
    </div>
  )
}

export default FeatureArea
