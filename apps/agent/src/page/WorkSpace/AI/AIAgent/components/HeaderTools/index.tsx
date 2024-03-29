import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSelector } from "react-redux"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import {
  showShareAgentModal,
  showShareAgentModalOnlyForShare,
} from "@illa-public/user-role-utils"
import ContributeButton from "../ContributeButton"
import SaveButton from "../SaveButton"
import ShareButton from "../ShareButton"
import { headerToolsContainerStyle, saveButtonContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const { control } = useFormContext<Agent>()

  const [publishedToMarketplace, aiAgentID] = useWatch({
    control: control,
    name: ["publishedToMarketplace", "aiAgentID"],
  })

  const showShareDialog = showShareAgentModalOnlyForShare(currentTeamInfo)
  const showContributeDialog = showShareAgentModal(
    currentTeamInfo,
    currentTeamInfo.myRole,
    publishedToMarketplace,
  )

  return (
    <div css={headerToolsContainerStyle}>
      {!!aiAgentID && showShareDialog && <ShareButton />}
      {!!aiAgentID && showContributeDialog && <ContributeButton />}
      <div css={saveButtonContainerStyle}>
        <SaveButton />
      </div>
    </div>
  )
}

export default HeaderTools
