import Icon from "@ant-design/icons"
import { Button, Modal, Typography } from "antd"
import { FC, memo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import { IEditorAIToolsVO, TIntegrationType } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { IntegrationTypeSelector } from "@/Modules/Integration/IntegrationSelector"
import BlackButton from "@/components/BlackButton"
import { useCreateFunction } from "@/utils/recentTabs/hook"
import { IAgentForm } from "../../../interface"
import { FUNCTION_LEARN_MORE_LINK } from "../constants"
import EditorFunctionItem from "../modules/EditorFunctionItem"
import SelectModal from "./components/SelectModal"
import { containerStyle, functionContainerStyle } from "./style"

const FunctionsEditorPC: FC = memo(() => {
  const { t } = useTranslation()

  const { control, getValues, setValue } = useFormContext<IAgentForm>()
  const [selectModalVisible, setSelectModalVisible] = useState(false)
  const [integrationVisible, setIntegrationVisible] = useState(false)
  const createFunction = useCreateFunction()

  const [fieldAiTools] = useWatch({
    control,
    name: ["aiTools"],
  })

  const handleValueChange = (values: IEditorAIToolsVO[]) => {
    setValue("aiTools", values)
  }

  const handleRemoveFunction = (aiToolID: string) => {
    const aiTools = getValues("aiTools")
    setValue(
      "aiTools",
      aiTools.filter((item) => item.aiToolID !== aiToolID),
    )
  }

  const handleClickCreate = () => {
    setSelectModalVisible(false)
    setIntegrationVisible(true)
  }

  const handleOpenSelectModal = async () => {
    setSelectModalVisible(true)
  }

  return (
    <>
      <Controller
        name="aiTools"
        control={control}
        shouldUnregister={false}
        render={({ field }) => (
          <LayoutBlock
            title={t("editor.ai-agent.label.functions")}
            description={
              <Trans
                i18nKey="homepage.edit_tipi.tips.function"
                t={t}
                components={[
                  <Typography.Link
                    key={FUNCTION_LEARN_MORE_LINK}
                    href={FUNCTION_LEARN_MORE_LINK}
                    target="__blank"
                  />,
                ]}
              />
            }
          >
            <div css={containerStyle}>
              <div css={functionContainerStyle}>
                {field.value?.map((item) => (
                  <EditorFunctionItem
                    key={item.aiToolID}
                    {...item}
                    handleRemoveItem={handleRemoveFunction}
                  />
                ))}
              </div>
              {field.value?.length > 0 ? (
                <BlackButton
                  style={{
                    marginBottom: "8px",
                    padding: "1px 8px",
                    minWidth: "32px",
                  }}
                  type="text"
                  icon={<Icon component={AddIcon} />}
                  onClick={handleOpenSelectModal}
                >
                  {t("editor.action.panel.btn.new")}
                </BlackButton>
              ) : (
                <Button
                  block
                  size="large"
                  icon={<Icon component={AddIcon} />}
                  onClick={handleOpenSelectModal}
                >
                  {t("editor.action.panel.btn.new")}
                </Button>
              )}
            </div>
          </LayoutBlock>
        )}
      />
      {selectModalVisible && (
        <SelectModal
          selectModalVisible={selectModalVisible}
          onCancel={() => setSelectModalVisible(false)}
          fieldAiTools={fieldAiTools}
          handleClickCreate={handleClickCreate}
          handleValueChange={handleValueChange}
        />
      )}

      <Modal
        open={integrationVisible}
        destroyOnClose
        width={1080}
        footer={false}
        title={t("editor.action.modal.title")}
        onCancel={() => {
          setIntegrationVisible(false)
        }}
      >
        <IntegrationTypeSelector
          onSelect={function (item: TIntegrationType): void {
            createFunction(item)
          }}
        />
      </Modal>
    </>
  )
})

FunctionsEditorPC.displayName = "FunctionsEditorPC"

export default FunctionsEditorPC
