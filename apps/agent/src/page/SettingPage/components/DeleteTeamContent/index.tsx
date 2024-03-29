import { Button, Input } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { TeamInfo } from "@illa-public/public-types"
import { footerStyle, modalContentStyle } from "./style"

interface IDeleteTeamContent {
  onCancel: () => void
  deleteTeam: () => void
  teamInfo: TeamInfo
}
const DeleteTeamContent: FC<IDeleteTeamContent> = ({
  onCancel,
  deleteTeam,
  teamInfo,
}) => {
  const { t } = useTranslation()
  const [inputTeamName, setInputTeamName] = useState<string>("")

  const disabled = teamInfo.name !== inputTeamName

  const handleOnCancel = () => {
    setInputTeamName("")
    onCancel()
  }

  const handleDeleteTeam = async () => {
    if (inputTeamName) {
      deleteTeam()
    }
  }

  return (
    <div css={modalContentStyle}>
      <span>{t("team_setting.leave_modal.description")}</span>
      <Input
        value={inputTeamName}
        onChange={(v) => setInputTeamName(v.target.value)}
        size="large"
        variant="filled"
        placeholder={t("team_setting.team_info.team_name_placeholder")}
        autoComplete="off"
      />
      <div css={footerStyle}>
        <Button block onClick={handleOnCancel}>
          {t("team_setting.delete_modal.cancel")}
        </Button>
        <Button
          block
          danger
          type="primary"
          disabled={disabled}
          onClick={handleDeleteTeam}
        >
          {t("team_setting.delete_modal.delete")}
        </Button>
      </div>
    </div>
  )
}

export default DeleteTeamContent

export {}
