import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import { INIT_VARIABLE } from "@illa-public/public-configs"
import { IBaseFunctionForm } from "@/page/WorkSpace/Function/CreateOrEdit/interface"
import VariableModalContent from "../VariableContent"
import { ICreateVariableButtonProps } from "./interface"

const CreateVariableButton: FC<ICreateVariableButtonProps> = (props) => {
  const {
    addedIndex,
    buttonProps: { type, size, block, hiddenButton },
  } = props
  const { t } = useTranslation()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { control } = useFormContext<IBaseFunctionForm>()
  const variableControl = useController({
    control,
    name: "config.variables",
  })

  const handleClickNewButton = () => {
    variableControl.field.onChange([
      ...variableControl.field.value,
      INIT_VARIABLE,
    ])
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
