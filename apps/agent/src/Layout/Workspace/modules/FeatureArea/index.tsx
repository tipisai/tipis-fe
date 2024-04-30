import Icon from "@ant-design/icons"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import { PenIcon, PlusIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { getIsEmptyTeam } from "@illa-public/user-data"
import FunctionIcon from "@/assets/workspace/function.svg?react"
import MarketplaceIcon from "@/assets/workspace/marketplace.svg?react"
import store from "@/redux/store"
import { canShownCreateTipi } from "@/utils/UIHelper/tipis"
import {
  useNavigateToCreateTipis,
  useNavigateToExploreFunction,
  useNavigateToExploreTipis,
  useNavigateToNewChat,
} from "@/utils/routeHelper/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import FeatureCard from "../../components/FeatureCard"
import MenuItemButton from "../../components/MenuItemButton"
import { createTeamContext } from "../../context"
import { featureAreaContainerStyle, featureCardsContainerStyle } from "./style"

const FeatureArea: FC = () => {
  const { t } = useTranslation()
  const navigateToCreateTIpis = useNavigateToCreateTipis()
  const navigateToChat = useNavigateToNewChat()
  const navigateToExploreTipis = useNavigateToExploreTipis()
  const navigateToExploreFunction = useNavigateToExploreFunction()
  const { onChangeTeamVisible } = useContext(createTeamContext)
  const currentTeamInfo = useGetCurrentTeamInfo()

  const handleClickCreateTipis = () => {
    TipisTrack.track("click_create_tipi_entry", {
      parameter2: "left_panel",
    })
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      TipisTrack.track("click_create_team_entry", {
        parameter1: "left_panel_no_team",
      })
      onChangeTeamVisible?.(true)
      return
    }
    navigateToCreateTIpis()
  }

  const handleClickCreateChat = () => {
    TipisTrack.track("click_new_chat")
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      TipisTrack.track("click_create_team_entry", {
        parameter1: "left_panel_no_team",
      })
      onChangeTeamVisible?.(true)
      return
    }
    navigateToChat(v4())
  }

  const handleClickExploreTipis = () => {
    TipisTrack.track("click_explore_tipi_entry")
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    if (isEmptyTeam) {
      TipisTrack.track("click_create_team_entry", {
        parameter1: "left_panel_no_team",
      })
      onChangeTeamVisible?.(true)
      return
    }
    navigateToExploreTipis()
  }

  const handleClickFunction = () => {
    const isEmptyTeam = getIsEmptyTeam(store.getState())
    TipisTrack.track("click_function_dashboard_tab")

    if (isEmptyTeam) {
      TipisTrack.track("click_create_team_entry", {
        parameter1: "left_panel_no_team",
      })
      onChangeTeamVisible?.(true)
      return
    }
    navigateToExploreFunction()
  }

  return (
    <div css={featureAreaContainerStyle}>
      <div css={featureCardsContainerStyle}>
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
      </div>
      <MenuItemButton
        text={t("homepage.left_panel.feature.new_chat")}
        icon={<Icon component={PlusIcon} />}
        onClick={handleClickCreateChat}
      />
      {canShownCreateTipi(currentTeamInfo) && (
        <MenuItemButton
          text={t("homepage.left_panel.feature.create_tipi")}
          icon={<Icon component={PenIcon} />}
          onClick={handleClickCreateTipis}
        />
      )}
    </div>
  )
}

export default FeatureArea
