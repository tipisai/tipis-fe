import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import VariableModalContent from "../VariableContent"
import { ICreateVariableButtonProps } from "./interface"

const CreateVariableButton: FC<ICreateVariableButtonProps> = (props) => {
  const {
    addedIndex,
    buttonProps: { type, size, block, hiddenButton },
  } = props
  const { t } = useTranslation()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleClickNewButton = () => {
    setShowCreateModal(true)
  }

  return (
    <>
      {!hiddenButton && (
        <Button
          size={size}
          type={type}
          icon={<Icon component={PlusIcon} />}
          onClick={handleClickNewButton}
          block={block}
        >
          {t("editor.action.panel.btn.new")}
        </Button>
      )}
      <VariableModalContent
        index={addedIndex}
        open={showCreateModal}
        openChange={setShowCreateModal}
      />
    </>
  )
}

export default CreateVariableButton
