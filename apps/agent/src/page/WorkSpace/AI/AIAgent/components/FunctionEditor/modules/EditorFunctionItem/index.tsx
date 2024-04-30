import Icon from "@ant-design/icons"
import { App, Button, Image } from "antd"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { DeleteIcon, PenIcon } from "@illa-public/icon"
import { IAgentForm } from "@/page/WorkSpace/AI/AIAgent/interface"
import { getCurrentTabID } from "@/redux/ui/recentTab/selector"
import {
  CREATE_FUNCTION_FROM_SINGLE,
  CREATE_FUNCTION_FROM_SINGLE_KEY,
  CREATE_FUNCTION_FROM_TAB_KEY,
  getEditFunctionPath,
} from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IEditorAIToolsVOItemProps } from "./interface"
import { functionItemContainerStyle, functionNameStyle } from "./style"

const EditorFunctionItem: FC<IEditorAIToolsVOItemProps> = ({
  aiToolID,
  name,
  config,
  isMobile,
  handleRemoveItem,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const teamInfo = useGetCurrentTeamInfo()
  const { getValues } = useFormContext<IAgentForm>()
  const { modal } = App.useApp()
  const currentTabID = useSelector(getCurrentTabID)
  const handleClickEdit = () => {
    if (!teamInfo) return
    const searchParams = new URLSearchParams()
    const from = !!getValues("aiAgentID")
      ? CREATE_FUNCTION_FROM_SINGLE.EDIT_TIPIS
      : CREATE_FUNCTION_FROM_SINGLE.CREATE_TIPIS

    searchParams.append(CREATE_FUNCTION_FROM_SINGLE_KEY, from)
    searchParams.append(CREATE_FUNCTION_FROM_TAB_KEY, currentTabID)
    navigate(
      `${getEditFunctionPath(teamInfo.identifier, aiToolID)}?${searchParams.toString()}`,
    )
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
