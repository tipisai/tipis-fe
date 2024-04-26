import { FC, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { IEditorFunction } from "@illa-public/public-types"
import BlackButton from "@/components/BlackButton"
import ModalFunctionItem from "../../../modules/ModalFunctionItem"
import { ISelectModalContentMobileProps } from "./interface"
import {
  actionContainerStyle,
  itemsContainerStyle,
  modalContentContainerStyle,
} from "./style"

const SelectModalContentMobile: FC<ISelectModalContentMobileProps> = ({
  onCancel,
  onConfirm,
  functions,
  fieldFunctions = [],
}) => {
  const { t } = useTranslation()
  const [selectedItems, setSelectedItems] =
    useState<IEditorFunction[]>(fieldFunctions)

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
        <BlackButton size="large" block onClick={handleOnConfirm}>
          {t("confirm")} {selectIDs.length > 0 ? `(${selectIDs.length})` : ""}
        </BlackButton>
      </div>
    </div>
  )
}

export default SelectModalContentMobile
