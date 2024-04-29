import Icon from "@ant-design/icons"
import { Drawer } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { CloseIcon } from "@illa-public/icon"
import { useGetAllAIToolsListQuery } from "@/redux/services/aiToolsAPI"
import { useGetCurrentTeamInfo } from "@/utils/team"
import EmptyFunctionContentMobile from "../EmptyFunctionContentMobile"
import SelectModalContentMobile from "../SelectModalContentMobile"
import { ISelectDrawerProps } from "./interface"
import { closeIconStyle, titleStyle } from "./style"

const SelectDrawer: FC<ISelectDrawerProps> = ({
  selectModalVisible,
  onCancel,
  fieldAiTools,
  handleValueChange,
}) => {
  const { t } = useTranslation()
  const teamInfo = useGetCurrentTeamInfo()!
  const { data, isLoading } = useGetAllAIToolsListQuery({
    teamID: teamInfo.id,
    sortBy: "createdAt",
  })
  if (isLoading) return null
  return (
    <Drawer
      open={selectModalVisible}
      destroyOnClose
      footer={false}
      title={
        <span css={titleStyle}>
          {t("editor.action.form.title.general.add_functions")}
        </span>
      }
      width="100%"
      height="100%"
      placement="bottom"
      onClose={onCancel}
      closeIcon={<Icon component={CloseIcon} css={closeIconStyle} />}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      {Array.isArray(data?.aiToolList) && data?.aiToolList.length > 0 ? (
        <SelectModalContentMobile
          functions={data?.aiToolList}
          onCancel={onCancel}
          onConfirm={handleValueChange}
          fieldFunctions={fieldAiTools}
        />
      ) : (
        <EmptyFunctionContentMobile />
      )}
    </Drawer>
  )
}

export default SelectDrawer
