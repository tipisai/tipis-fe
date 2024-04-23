import Icon from "@ant-design/icons"
import { Button, Modal } from "antd"
import { memo, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import CreateOrSelectIntegration from "@/Modules/Integration/CreateOrSelectIntegration"
import { IIntegrationEditorProps } from "./interface"
import { customModalStyle } from "./style"

const IntegrationEditor = memo((props: IIntegrationEditorProps) => {
  const { integrationType } = props
  const { t } = useTranslation()
  const { control } = useFormContext()

  const [modalShow, setModalShow] = useState(false)

  return (
    <>
      <Controller
        name="integration"
        control={control}
        rules={{
          required: t("function.edit.configure.label.integration"),
        }}
        shouldUnregister={false}
        render={({ field }) => (
          <LayoutBlock
            title={t("function.edit.configure.label.integration")}
            required
            // errorMessage={errors.description?.message}
          >
            {!field.value && (
              <>
                <Button
                  icon={<Icon component={PlusIcon} />}
                  block
                  size="large"
                  onClick={() => {
                    setModalShow(true)
                  }}
                >
                  {t("editor.action.panel.btn.new")}
                </Button>
                <Modal
                  open={modalShow}
                  destroyOnClose
                  title="dddddd"
                  width={696}
                  footer={false}
                  css={customModalStyle}
                  onCancel={() => {
                    setModalShow(false)
                  }}
                >
                  <CreateOrSelectIntegration
                    onConfirm={(integrationID) => {
                      field.onChange(integrationID)
                    }}
                    integrationType={integrationType}
                  />
                </Modal>
              </>
            )}
          </LayoutBlock>
        )}
      />
    </>
  )
})

IntegrationEditor.displayName = "IntegrationEditor"

export default IntegrationEditor
