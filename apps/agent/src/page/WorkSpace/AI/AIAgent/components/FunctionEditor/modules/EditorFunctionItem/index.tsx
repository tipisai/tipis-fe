import Icon from "@ant-design/icons"
import { App, Button, Image } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { DeleteIcon, PenIcon } from "@illa-public/icon"
import { getEditFunctionPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IEditorFunctionItemProps } from "./interface"
import { functionItemContainerStyle, functionNameStyle } from "./style"

const EditorFunctionItem: FC<IEditorFunctionItemProps> = ({
  aiToolID,
  name,
  config,
  isMobile,
  handleRemoveItem,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const teamInfo = useGetCurrentTeamInfo()
  const { modal } = App.useApp()
  const handleClickEdit = () => {
    if (!teamInfo) return
    navigate(getEditFunctionPath(teamInfo.identifier, aiToolID))
  }

  const handleClickRemove = () => {
    modal.confirm({
      title: t("homepage.edit_tipi.modal.delete_function.title"),
      content: t("homepage.edit_tipi.modal.delete_function.desc"),
      cancelText: t("homepage.edit_tipi.modal.delete_function.cancel"),
      okText: t("homepage.edit_tipi.modal.delete_function.confirm"),
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      onOk: () => {
        handleRemoveItem(aiToolID)
      },
    })
  }

  return (
    <div css={functionItemContainerStyle}>
      <Image
        width={32}
        height={32}
        preview={false}
        src={config.icon}
        style={{ borderRadius: 8 }}
      />
      <span css={functionNameStyle}>{name}</span>
      {!isMobile && (
        <Button
          type="text"
          size="small"
          icon={<Icon component={PenIcon} />}
          onClick={handleClickEdit}
        />
      )}
      <Button
        size="small"
        type="text"
        icon={<Icon component={DeleteIcon} />}
        onClick={handleClickRemove}
      />
    </div>
  )
}
export default EditorFunctionItem
