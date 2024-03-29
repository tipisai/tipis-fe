import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { PenIcon, PlusIcon } from "@illa-public/icon"
import { getIsEmptyTeam } from "@illa-public/user-data"
import FunctionIcon from "@/assets/workspace/function.svg?react"
import MarketplaceIcon from "@/assets/workspace/marketplace.svg?react"
import store from "@/redux/store"
import {
  useAddCreateChatTab,
  useAddCreateTipisTab,
  useGoToExploreFunctions,
  useGoToExploreTipis,
} from "@/utils/recentTabs/hook"
import FeatureCard from "../../components/FeatureCard"
import MenuItemButton from "../../components/MenuItemButton"
import { featureAreaContainerStyle, featureCardsContainerStyle } from "./style"

interface FeatureAreaProps {
  openCreateModal?: () => void
}
const FeatureArea: FC<FeatureAreaProps> = ({ openCreateModal }) => {
  const { t } = useTranslation()
  const addCreateTipisTab = useAddCreateTipisTab()
  const createChat = useAddCreateChatTab()
  const gotoExploreTipi = useGoToExploreTipis()
  const gotoExploreFunction = useGoToExploreFunctions()

  const handleClickCreateTipis = () => {
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      openCreateModal?.()
      return
    }
    addCreateTipisTab()
  }

  const handleClickCreateChat = () => {
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      openCreateModal?.()
      return
    }
    createChat()
  }

  const handleClickExploreTipis = () => {
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      openCreateModal?.()
      return
    }
    gotoExploreTipi()
  }

  const handleClickFunction = () => {
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      openCreateModal?.()
      return
    }
    gotoExploreFunction()
  }

  return (
    <div css={featureAreaContainerStyle}>
      <div css={featureCardsContainerStyle}>
        <FeatureCard
          icon={<Icon component={MarketplaceIcon} />}
          title={t("homepage.left_panel.feature.explore_tipi")}
          position="left"
          onClick={handleClickExploreTipis}
        />
        <FeatureCard
          icon={<Icon component={FunctionIcon} />}
          title={t("homepage.left_panel.feature.function")}
          position="right"
          onClick={handleClickFunction}
        />
      </div>
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
