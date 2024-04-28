import { Modal } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useGetAllAIToolsListQuery } from "@/redux/services/aiToolsAPI"
import { useGetCurrentTeamInfo } from "@/utils/team"
import EmptyFunctionContentPC from "../EmptyFunctionContentPC"
import SelectModalContentPC from "../SelectModalContentPC"
import { ISelectModalProps } from "./interface"
import { titleStyle } from "./style"

const SelectModal: FC<ISelectModalProps> = ({
  selectModalVisible,
  onCancel,
  fieldAiTools,
  handleClickCreate,
  handleValueChange,
}) => {
  const { t } = useTranslation()
  const teamInfo = useGetCurrentTeamInfo()!
  const { data: listData, isLoading } = useGetAllAIToolsListQuery({
    teamID: teamInfo.id,
    sortBy: "createdAt",
  })

  if (isLoading) return null
  return (
    <Modal
      open={selectModalVisible}
      destroyOnClose
      width={520}
      footer={false}
      onCancel={onCancel}
      title={
        <span css={titleStyle}>
          {t("editor.action.form.title.general.add_functions")}
        </span>
      }
      styles={{
        content: {
          padding: 0,
        },
        header: {
          margin: 0,
        },
        footer: {
          margin: 0,
        },
      }}
    >
      {Array.isArray(listData) && listData.length > 0 ? (
        <SelectModalContentPC
          functions={listData}
          onCancel={onCancel}
          onConfirm={handleValueChange}
          fieldFunctions={fieldAiTools}
          handleClickCreate={handleClickCreate}
        />
      ) : (
        <EmptyFunctionContentPC handleClickCreate={handleClickCreate} />
      )}
    </Modal>
  )
}

export default SelectModal
