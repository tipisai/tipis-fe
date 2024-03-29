import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import { PenIcon, PlusIcon } from "@illa-public/icon"
import { getIsEmptyTeam } from "@illa-public/user-data"
// import FunctionIcon from "@/assets/workspace/function.svg?react"
import MarketplaceIcon from "@/assets/workspace/marketplace.svg?react"
import store from "@/redux/store"
import {
  useNavigateToCreateTipis,
  useNavigateToExploreTipis,
  useNavigateToNewChat,
} from "@/utils/routeHelper/hook"
// import FeatureCard from "../../components/FeatureCard"
import MenuItemButton from "../../components/MenuItemButton"
import { featureAreaContainerStyle } from "./style"

interface FeatureAreaProps {
  openCreateModal?: () => void
}
const FeatureArea: FC<FeatureAreaProps> = ({ openCreateModal }) => {
  const { t } = useTranslation()
  const navigateToCreateTIpis = useNavigateToCreateTipis()
  const navigateToChat = useNavigateToNewChat()
  const navigateToExploreTipis = useNavigateToExploreTipis()
  // const navigateToExploreFunction = useNavigateToExploreFunction()

  const handleClickCreateTipis = () => {
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      openCreateModal?.()
      return
    }
    navigateToCreateTIpis()
  }

  const handleClickCreateChat = () => {
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      openCreateModal?.()
      return
    }
    navigateToChat(v4())
  }

  const handleClickExploreTipis = () => {
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      openCreateModal?.()
      return
    }
    navigateToExploreTipis()
  }

  // const handleClickFunction = () => {
  //   const isEmptyTeam = getIsEmptyTeam(store.getState())
  //   if (isEmptyTeam) {
  //     openCreateModal?.()
  //     return
  //   }
  //   navigateToExploreFunction()
  // }

  return (
    <div css={featureAreaContainerStyle}>
      {/* <div css={featureCardsContainerStyle}>
        <FeatureCard
          icon={<Icon component={MarketplaceIcon} />}
          title={t("homepage.left_panel.feature.explore_tipi")}
          position="full"
          onClick={handleClickExploreTipis}
        />
        <FeatureCard
          icon={<Icon component={FunctionIcon} />}
          title={t("homepage.left_panel.feature.function")}
          position="right"
          onClick={handleClickFunction}
        />
      </div> */}
      <MenuItemButton
        text={t("homepage.left_panel.feature.explore_tipi")}
        icon={<Icon component={MarketplaceIcon} />}
        onClick={handleClickExploreTipis}
      />
      <MenuItemButton
        text={t("homepage.left_panel.feature.new_chat")}
        icon={<Icon component={PlusIcon} />}
        onClick={handleClickCreateChat}
      />
      <MenuItemButton
        text={t("homepage.left_panel.feature.create_tipi")}
        icon={<Icon component={PenIcon} />}
        onClick={handleClickCreateTipis}
      />
    </div>
  )
}

export default FeatureArea
