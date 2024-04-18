import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { PinIcon, UnPinIcon } from "@illa-public/icon"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { usePinOrUnpinTipis } from "@/utils/pinedTabs/hook"
import { IAgentForm } from "../../interface"

const PinOrUnpinButton: FC = () => {
  const { control } = useFormContext<IAgentForm>()
  const { t } = useTranslation()

  const [aiAgentID, name, icon, teamIdentifier] = useWatch({
    control: control,
    name: ["aiAgentID", "name", "icon", "teamIdentifier"],
  })

  const pinedTipiInfo = useSelector((state) =>
    getPinedTipisByTipisID(state, aiAgentID),
  )
  const isPined = !!pinedTipiInfo

  const pinOrUnpinTipis = usePinOrUnpinTipis()
  const handleClickPinOrUnPin = async () => {
    await pinOrUnpinTipis({
      tipiName: name,
      tipiIcon: icon,
      tipiID: aiAgentID,
      tipiOwnerTeamIdentity: teamIdentifier,
    })
  }

  return (
    <Button
      icon={<Icon component={isPined ? UnPinIcon : PinIcon} />}
      onClick={handleClickPinOrUnPin}
    >
      {isPined ? t("dashboard.common.unpin") : t("dashboard.common.pin")}
    </Button>
  )
}

export default PinOrUnpinButton
