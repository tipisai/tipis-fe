import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import {
  ForkIcon,
  PinIcon,
  PlayFillIcon,
  ShareIcon,
  UnPinIcon,
} from "@illa-public/icon"
import { MarketShareModal } from "@illa-public/market-share"
import { TipisTrack } from "@illa-public/track-utils"
import { useForkAIAgentToTeamMutation } from "@/redux/services/agentAPI"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { usePinOrUnpinTipis } from "@/utils/pinedTabs/hook"
import { getEditTipiPath } from "@/utils/routeHelper"
import { useNavigateToRunTipis } from "@/utils/routeHelper/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IActionGroupProps } from "../interface"
import {
  actionGroupContainerStyle,
  otherActionGroupContainerStyle,
} from "./style"

const MobileActionGroup: FC<IActionGroupProps> = (props) => {
  const {
    isContribute,
    runNumber,
    forkNumber,
    tipisID,
    tipisIcon,
    tipisName,
    isFromMarketplace,
    isPublishConfiguration,
    ownerTeamIdentity,
  } = props
  const { t } = useTranslation()
  const { message: messageAPI } = App.useApp()
  const currentTeamInfo = useGetCurrentTeamInfo()
  const navigateToRun = useNavigateToRunTipis()
  const pinedInfos = useSelector((state) =>
    getPinedTipisByTipisID(state, tipisID),
  )
  const [shareVisible, setShareVisible] = useState(false)
  const [forkLoading, setForkLoading] = useState(false)
  const [forkAIAgentToTeam] = useForkAIAgentToTeamMutation()
  const navigate = useNavigate()
  const isPined = !!pinedInfos
  const pinOrUnpinTipis = usePinOrUnpinTipis()
  const handleClickPinOrUnPin = async () => {
    await pinOrUnpinTipis({
      tipiName: tipisName,
      tipiIcon: tipisIcon,
      tipiID: tipisID,
      tipiOwnerTeamIdentity: ownerTeamIdentity,
    })
  }

  const handleClickRun = () => {
    TipisTrack.track("click_run_tipi_entry", {
      parameter1: "detail",
    })
    navigateToRun(
      {
        tipisIcon,
        tipisID,
        tipisName,
      },
      v4(),
      ownerTeamIdentity,
    )
  }

  const handleClickFork = async () => {
    if (!currentTeamInfo) return
    setForkLoading(true)
    try {
      const newAgent = await forkAIAgentToTeam({
        teamID: currentTeamInfo.id,
        aiAgentID: tipisID,
      }).unwrap()
      navigate(getEditTipiPath(currentTeamInfo.identify, newAgent.aiAgentID))
    } catch (e) {
      messageAPI.error({
        content: t("dashboard.message.fork-failed"),
      })
    } finally {
      setForkLoading(false)
    }
  }

  return (
    <>
      <div css={actionGroupContainerStyle}>
        <Button
          type="primary"
          size="large"
          block
          icon={<Icon component={PlayFillIcon} />}
          onClick={handleClickRun}
        >
          {t("dashboard.common.run")}{" "}
          {isContribute && !!runNumber ? runNumber : ""}
        </Button>

        <div css={otherActionGroupContainerStyle}>
          {isFromMarketplace && isPublishConfiguration && (
            <Button
              block
              icon={<Icon component={ForkIcon} />}
              size="large"
              loading={forkLoading}
              onClick={handleClickFork}
            >
              {t("dashboard.common.fork")} {!!forkNumber ? forkNumber : ""}
            </Button>
          )}

          <Button
            block
            icon={<Icon component={isPined ? UnPinIcon : PinIcon} />}
            onClick={handleClickPinOrUnPin}
            size="large"
          >
            {isPined ? t("dashboard.common.unpin") : t("dashboard.common.pin")}
          </Button>
          {isContribute && (
            <Button
              block
              icon={<Icon component={ShareIcon} />}
              size="large"
              onClick={() => setShareVisible(true)}
            >
              {t("dashboard.common.share")}
            </Button>
          )}
        </div>
      </div>
      <MarketShareModal
        title={`${t("user_management.modal.social_media.default_text.agent", {
          tipisName: tipisName,
        })}`}
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        ID={tipisID}
        name={tipisName}
      />
    </>
  )
}

export default MobileActionGroup
