import { Input, Modal } from "antd"
import { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import LabelWithController from "@/Layout/Function/LabelWithController"
import BlackButton from "@/components/BlackButton"
import {
  useGetParamsListByResourceType,
  useTestRunFunction,
} from "@/utils/function/hook"
import { ITestValueModalProps } from "./interface"
import {
  customModalStyle,
  footerContainerStyle,
  variableContentStyle,
} from "./style"

const TestValueModal: FC<ITestValueModalProps> = (props) => {
  const { open, changeOpen } = props
  const { t } = useTranslation()
  const parameters = useGetParamsListByResourceType()

  const formattedParameters = parameters.reduce(
    (acc, cur) => {
      acc[cur.name] = ""
      return acc
    },
    {} as Record<string, string>,
  )

  const { control, handleSubmit } = useForm<Record<string, string>>({
    defaultValues: formattedParameters,
    shouldUnregister: true,
  })

  const { onTestRunFunction, isLoading } = useTestRunFunction()

  const onSubmit = async (formData: Record<string, string>) => {
    await onTestRunFunction(formData)
    changeOpen(false)
  }

  return (
    <Modal
      title={t("homepage.edit_tipi.modal.add_test_value")}
      width={696}
      css={customModalStyle}
      footer={false}
      open={open}
      destroyOnClose
      onCancel={() => {
        changeOpen(false)
      }}
    >
      <div css={variableContentStyle}>
        {parameters.map((param, i) => {
          return (
            <Controller
              control={control}
              key={i}
              name={`${param.name}`}
              rules={{
                required: param.required
                  ? t("homepage.edit_tipi.modal.required")
                  : false,
              }}
              render={({ fieldState, field }) => (
                <LabelWithController
                  title={param.name}
                  required={param.required}
                  errorMessage={fieldState.error?.message}
                >
                  <Input
                    size="large"
                    {...field}
                    status={!!fieldState.error?.message ? "error" : undefined}
                  />
                </LabelWithController>
              )}
            />
          )
        })}
      </div>
      <div css={footerContainerStyle}>
        <BlackButton
          size="large"
          block
          onClick={handleSubmit(onSubmit)}
          loading={isLoading}
        >
          {t("function.edit.test.button.test_connection")}
        </BlackButton>
      </div>
    </Modal>
  )
}

export default TestValueModal
