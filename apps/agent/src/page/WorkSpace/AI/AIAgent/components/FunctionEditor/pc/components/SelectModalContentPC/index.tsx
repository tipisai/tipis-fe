import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import { IEditorFunctionItem } from "@illa-public/public-types"
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
  fieldFunctions,
  handleClickCreate,
}) => {
  const { t } = useTranslation()
  const [selectedItems, setSelectedItems] =
    useState<IEditorFunctionItem[]>(fieldFunctions)

  const selectIDs = useMemo(() => {
    return selectedItems.map((item) => item.functionID)
  }, [selectedItems])

  const handleOnConfirm = () => {
    onCancel()
    onConfirm(selectedItems)
  }

  const handleSelected = (
    checked: boolean,
    functionItem: IEditorFunctionItem,
  ) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, functionItem])
    } else {
      setSelectedItems((prev) =>
        prev.filter((item) => item.functionID !== functionItem.functionID),
      )
    }
  }
  return (
    <div css={modalContentContainerStyle}>
      <div css={itemsContainerStyle}>
        {functions.map((item) => (
          <ModalFunctionItem
            key={item.functionID}
            checked={selectIDs.includes(item.functionID)}
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
          {t("create_new")}
        </Button>
        <BlackButton size="large" block onClick={handleOnConfirm}>
          {t("confirm")} {selectIDs.length > 0 ? `(${selectIDs.length})` : ""}
        </BlackButton>
      </div>
    </div>
  )
}

export default SelectModalContentPC
