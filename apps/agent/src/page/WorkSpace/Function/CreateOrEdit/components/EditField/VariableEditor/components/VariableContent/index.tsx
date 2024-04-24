import { Modal } from "antd"
import { FC } from "react"
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { INIT_VARIABLE } from "@illa-public/public-configs"
import { IVariables } from "@illa-public/public-types"
import { IBaseFunctionForm } from "@/page/WorkSpace/Function/CreateOrEdit/interface"
import BlackButton from "../../../../../../../../../components/BlackButton"
import DescriptionEditor from "../DescriptionEditor"
import EnumOptionsEditor from "../EnumOptionsEditor"
import IsEnumEditor from "../IsEnumEditor"
import NameEditor from "../NameEditor"
import RequiredEditor from "../RequiredEditor"
import TestValueEditor from "../TestValueEditor"
import TypeEditor from "../TypeEditor"
import { IVariableModalContentProps } from "./interface"
import {
  buttonStyle,
  customModalStyle,
  footerContainerStyle,
  variableContentStyle,
} from "./style"

const VariableModalContent: FC<IVariableModalContentProps> = (props) => {
  const { index, open, openChange } = props
  const { control } = useFormContext<IBaseFunctionForm>()
  const variableControl = useController({
    control,
    name: "config.variables",
  })
  const { t } = useTranslation()

  const [isEnum, variables] = useWatch({
    control,
    name: [`config.variables.${index}.isEnum`, `config.variables`],
  })

  const methods = useForm<IVariables>({
    defaultValues: variables[index] ?? INIT_VARIABLE,
  })

  const onClickConfirm = () => {
    const values = variableControl.field.value
    const newValue = methods.getValues()
    values[index] = newValue
    variableControl.field.onChange(values)
    openChange(false)
  }

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
      <FormProvider {...methods}>
        <div css={variableContentStyle}>
          <NameEditor />
          <DescriptionEditor />
          <RequiredEditor />
          <TypeEditor />
          <IsEnumEditor />
          {isEnum && <EnumOptionsEditor />}
          <TestValueEditor />
        </div>
        <div css={footerContainerStyle}>
          <BlackButton size="large" css={buttonStyle} onClick={onClickConfirm}>
            Confirm
          </BlackButton>
        </div>
      </FormProvider>
    </Modal>
  )
}

export default VariableModalContent
