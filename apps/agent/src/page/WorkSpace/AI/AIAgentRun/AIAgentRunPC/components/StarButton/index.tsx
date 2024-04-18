import Icon, { StarOutlined } from "@ant-design/icons"
import { App, Button } from "antd"
import { FC, useContext, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { StarFillIcon } from "@illa-public/icon"
import { formatNumForAgent } from "@illa-public/utils"
import { IAgentForm } from "@/page/WorkSpace/AI/AIAgent/interface"
import {
  useStarAIAgentMutation,
  useUnstarAIAgentMutation,
} from "@/redux/services/marketAPI"
import { MarketplaceInfoContext } from "../../../contexts/MarketplaceInfoContext"

const StarButton: FC = () => {
  const { currentMarketplaceInfo } = useContext(MarketplaceInfoContext)

  const { t } = useTranslation()
  const { message: messageAPI } = App.useApp()

  const [starLoading, setStarLoading] = useState(false)
  const [starState, setStarState] = useState(
    currentMarketplaceInfo?.marketplace?.isStarredByCurrentUser ?? false,
  )
  const [starNum, setStarNum] = useState(
    currentMarketplaceInfo?.marketplace.numStars ?? 0,
  )
  const [starAIAgent] = useStarAIAgentMutation()
  const [unstarAIAgent] = useUnstarAIAgentMutation()

  const { control } = useFormContext<IAgentForm>()
  const [aiAgentID] = useWatch({
    control,
    name: ["aiAgentID"],
  })

  const handleClickStar = async () => {
    setStarLoading(true)

    try {
      if (starState) {
        await unstarAIAgent(aiAgentID).unwrap()
        if (starNum > 0) {
          setStarNum(starNum - 1)
        }
      } else {
        await starAIAgent(aiAgentID).unwrap()
        setStarNum(starNum + 1)
      }
      setStarState(!starState)
    } catch (e) {
      messageAPI.error({
        content: t("dashboard.message.star-failed"),
      })
    } finally {
      setStarLoading(false)
    }
  }

  return (
    <Button
      size="large"
      onClick={handleClickStar}
      loading={starLoading}
      icon={
        starState ? (
          <Icon
            component={StarFillIcon}
            style={{
              color: "#FFBB38",
            }}
          />
        ) : (
          <StarOutlined />
        )
      }
    >
      <span>{t("marketplace.star")}</span>
      {starNum > 0 && <span> {formatNumForAgent(starNum)}</span>}
    </Button>
  )
}

export default StarButton
