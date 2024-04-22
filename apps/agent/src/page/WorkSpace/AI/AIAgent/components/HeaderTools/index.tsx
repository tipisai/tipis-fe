import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { showShareAgentModal } from "@illa-public/user-role-utils"
import { canShowShareTipi } from "@/utils/UIHelper/tipis"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IAgentForm } from "../../interface"
import ContributeButton from "../ContributeButton"
import PinOrUnpinButton from "../PinOrUnpinButton"
import SaveButton from "../SaveButton"
import ShareButton from "../ShareButton"
import { headerToolsContainerStyle, saveButtonContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const currentTeamInfo = useGetCurrentTeamInfo()
  const { control } = useFormContext<IAgentForm>()

  const [aiAgentID, publishedToMarketplace] = useWatch({
    control: control,
    name: ["aiAgentID", "publishedToMarketplace"],
  })

  const showShareDialog = canShowShareTipi(currentTeamInfo)
  const showContributeDialog =
    currentTeamInfo &&
    showShareAgentModal(
      currentTeamInfo,
      currentTeamInfo.myRole,
      publishedToMarketplace,
    )

  return (
    <div css={headerToolsContainerStyle}>
      {!!aiAgentID && <PinOrUnpinButton />}
      {!!aiAgentID && showShareDialog && <ShareButton />}
      {!!aiAgentID && showContributeDialog && <ContributeButton />}
      <div css={saveButtonContainerStyle}>
        <SaveButton />
      </div>
    </div>
  )
}

export default HeaderTools
