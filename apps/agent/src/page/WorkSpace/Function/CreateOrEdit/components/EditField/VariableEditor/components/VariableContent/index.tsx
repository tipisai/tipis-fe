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
    name: "parameters",
  })
  const { t } = useTranslation()

  const variables = useWatch({
    control,
    name: "parameters",
  })

  const methods = useForm<IVariables>({
    defaultValues: variables[index] ?? INIT_VARIABLE,
    mode: "onChange",
    shouldUnregister: true,
  })

  const isEnum = useWatch({
    control: methods.control,
    name: "isEnum",
  })

  const onClickConfirm = (data: IVariables) => {
    console.log("data", data)
    const values = variableControl.field.value
    values[index] = data
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
          <BlackButton
            size="large"
            css={buttonStyle}
            onClick={methods.handleSubmit(onClickConfirm)}
          >
            {t("function.edit.variable_modal.button.confirm")}
          </BlackButton>
        </div>
      </FormProvider>
    </Modal>
  )
}

export default VariableModalContent
