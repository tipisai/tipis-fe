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
  const { data, isLoading } = useGetAllAIToolsListQuery(teamInfo.id)

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
      {Array.isArray(data?.aiToolList) && data?.aiToolList.length > 0 ? (
        <SelectModalContentPC
          functions={data?.aiToolList}
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
