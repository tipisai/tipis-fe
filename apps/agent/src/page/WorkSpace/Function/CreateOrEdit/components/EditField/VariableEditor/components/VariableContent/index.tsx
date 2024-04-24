import { Modal } from "antd"
import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IBaseFunctionForm } from "@/page/WorkSpace/Function/CreateOrEdit/interface"
import DescriptionEditor from "../DescriptionEditor"
import EnumOptionsEditor from "../EnumOptionsEditor"
import IsEnumEditor from "../IsEnumEditor"
import NameEditor from "../NameEditor"
import RequiredEditor from "../RequiredEditor"
import TestValueEditor from "../TestValueEditor"
import TypeEditor from "../TypeEditor"
import { IVariableModalContentProps } from "./interface"
import { customModalStyle, variableContentStyle } from "./style"

const VariableModalContent: FC<IVariableModalContentProps> = (props) => {
  const { index, open, openChange } = props
  const { control } = useFormContext<IBaseFunctionForm>()
  const { t } = useTranslation()

  const [isEnum] = useWatch({
    control,
    name: [`config.variables.${index}.isEnum`],
  })

  return (
    <Modal
      open={open}
      title={t("function.edit.variable_modal.title.edit_variable")}
      css={customModalStyle}
      footer={false}
      onCancel={(e) => {
        e.stopPropagation()
        openChange(false)
      }}
      destroyOnClose
      width={696}
    >
      <div css={variableContentStyle}>
        <NameEditor index={index} />
        <DescriptionEditor index={index} />
        <RequiredEditor index={index} />
        <TypeEditor index={index} />
        <IsEnumEditor index={index} />
        {isEnum && <EnumOptionsEditor index={index} />}
        <TestValueEditor index={index} />
      </div>
    </Modal>
  )
}

export default VariableModalContent
