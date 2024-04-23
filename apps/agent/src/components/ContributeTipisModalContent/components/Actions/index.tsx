import { Button } from "antd"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { getCurrentId } from "@illa-public/user-data"
import BlackButton from "@/components/BlackButton"
import {
  useContributeAgentWithHashtagsMutation,
  useRemoveToMarketplaceMutation,
  useUpdateAgentContributeMutation,
} from "@/redux/services/marketAPI"
import {
  IContributeFromFields,
  IContributeTipisModalContentProps,
} from "../../ContributeContent/interface"
import { actionsContainerStyle } from "./style"

const Actions: FC<
  Omit<IContributeTipisModalContentProps, "visible" | "onClose">
> = ({ isContribute, tipisID, contributeCallback }) => {
  const { t } = useTranslation()
  const { trigger, getValues } = useFormContext<IContributeFromFields>()

  const teamID = useSelector(getCurrentId)!

  const [removeToMarketplace] = useRemoveToMarketplaceMutation()
  const [contributeAgent] = useContributeAgentWithHashtagsMutation()
  const [updateAgentContribute] = useUpdateAgentContributeMutation()
  const handleSubmit = async () => {
    await trigger()
    const { hashtags, contributeToMarketplace, publishConfiguration } =
      getValues()

    try {
      if (isContribute && !contributeToMarketplace) {
        removeToMarketplace({ teamID, tipisID }).unwrap()
        contributeCallback(false)
      } else if (!contributeToMarketplace) {
        contributeAgent({
          teamID,
          tipisID,
          publishConfiguration,
          hashtags,
        }).unwrap()
        contributeCallback(true, "contribute")
      } else {
        updateAgentContribute({
          teamID,
          tipisID,
          publishConfiguration,
          hashtags,
        }).unwrap()
        contributeCallback(true, "update")
      }
    } catch (e) {}
  }
  return (
    <div css={actionsContainerStyle}>
      {isContribute && (
        <Button block size="large">
          {t("homepage.contribute_modal.cancel")}
        </Button>
      )}
      <BlackButton block onClick={handleSubmit} size="large">
        {isContribute
          ? t("homepage.contribute_modal.update")
          : t("homepage.contribute_modal.successful.contribute")}
      </BlackButton>
    </div>
  )
}

export default Actions
