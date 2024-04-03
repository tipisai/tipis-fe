import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { canShowShareTipi } from "@/utils/UIHelper/tipis"
// import {
// showShareAgentModal,
// showShareAgentModalOnlyForShare,
// } from "@illa-public/user-role-utils"
// import ContributeButton from "../ContributeButton"
import SaveButton from "../SaveButton"
import ShareButton from "../ShareButton"
import { headerToolsContainerStyle, saveButtonContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const { control } = useFormContext<Agent>()

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
      {!!aiAgentID && showShareDialog && <ShareButton />}
      {/* {!!aiAgentID && showContributeDialog && <ContributeButton />} */}
      <div css={saveButtonContainerStyle}>
        <SaveButton />
      </div>
    </div>
  )
}

export default HeaderTools
