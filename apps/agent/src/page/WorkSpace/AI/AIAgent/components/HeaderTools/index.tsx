import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { canShowShareTipi } from "@/utils/UIHelper/tipis"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IAgentForm } from "../../interface"
import PinOrUnpinButton from "../PinOrUnpinButton"
// import {
// showShareAgentModal,
// showShareAgentModalOnlyForShare,
// } from "@illa-public/user-role-utils"
// import ContributeButton from "../ContributeButton"
import SaveButton from "../SaveButton"
import ShareButton from "../ShareButton"
import { headerToolsContainerStyle, saveButtonContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const currentTeamInfo = useGetCurrentTeamInfo()
  const { control } = useFormContext<IAgentForm>()

  const [aiAgentID] = useWatch({
    control: control,
    name: ["aiAgentID"],
  })

  const showShareDialog = canShowShareTipi(currentTeamInfo)
  // const showContributeDialog = showShareAgentModal(
  //   currentTeamInfo,
  //   currentTeamInfo.myRole,
  //   publishedToMarketplace,
  // )

  return (
    <div css={headerToolsContainerStyle}>
      {!!aiAgentID && <PinOrUnpinButton />}
      {!!aiAgentID && showShareDialog && <ShareButton />}
      {/* {!!aiAgentID && showContributeDialog && <ContributeButton />} */}
      <div css={saveButtonContainerStyle}>
        <SaveButton />
      </div>
    </div>
  )
}

export default HeaderTools
