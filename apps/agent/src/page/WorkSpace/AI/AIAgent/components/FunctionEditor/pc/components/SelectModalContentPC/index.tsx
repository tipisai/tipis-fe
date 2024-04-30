import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import { IEditorAIToolsVO } from "@illa-public/public-types"
import BlackButton from "@/components/BlackButton"
import ModalFunctionItem from "../../../modules/ModalFunctionItem"
import { ISelectModalContentPCProps } from "./interface"
import {
  actionContainerStyle,
  itemsContainerStyle,
  modalContentContainerStyle,
} from "./style"

const SelectModalContentPC: FC<ISelectModalContentPCProps> = ({
  onCancel,
  onConfirm,
  functions,
  fieldFunctions = [],
  handleClickCreate,
}) => {
  const { t } = useTranslation()
  const [selectedItems, setSelectedItems] =
    useState<IEditorAIToolsVO[]>(fieldFunctions)

  const selectIDs = useMemo(() => {
    return selectedItems.map((item) => item.aiToolID)
  }, [selectedItems])

  const handleOnConfirm = () => {
    onCancel()
    onConfirm(selectedItems)
  }

  const handleSelected = (checked: boolean, aiToolID: string) => {
    if (checked) {
      const functionItem = functions.find((item) => item.aiToolID === aiToolID)
      !!functionItem && setSelectedItems((prev) => [...prev, functionItem])
    } else {
      setSelectedItems((prev) =>
        prev.filter((item) => item.aiToolID !== aiToolID),
      )
    }
  }
  return (
    <div css={modalContentContainerStyle}>
      <div css={itemsContainerStyle}>
        {functions.map((item) => (
          <ModalFunctionItem
            key={item.aiToolID}
            checked={selectIDs.includes(item.aiToolID)}
            handleSelected={handleSelected}
            {...item}
          />
        ))}
      </div>
      <div css={actionContainerStyle}>
        <Button
          size="large"
          block
          icon={<Icon component={AddIcon} />}
          onClick={handleClickCreate}
        >
          {t("editor.action.form.button.general.create_new")}
        </Button>
        <BlackButton size="large" block onClick={handleOnConfirm}>
          {t("editor.action.form.button.general.confirm")}{" "}
          {selectIDs.length > 0 ? `(${selectIDs.length})` : ""}
        </BlackButton>
      </div>
    </div>
  )
}

export default SelectModalContentPC
