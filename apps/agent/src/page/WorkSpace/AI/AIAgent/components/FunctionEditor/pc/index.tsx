import { Typography } from "antd"
import { FC, memo, useState } from "react"
import {
  Controller,
  useController,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { IEditorAIToolsVO } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { IAgentForm } from "../../../interface"
import { FUNCTION_LEARN_MORE_LINK } from "../constants"
import AddToolsButton from "../modules/AddToolsButton"
import EditorFunctionItem from "../modules/EditorFunctionItem"
import IntegrationModal from "./components/IntegrationModal"
import SelectModal from "./components/SelectModal"
import { containerStyle, functionContainerStyle } from "./style"

const FunctionsEditorPC: FC = memo(() => {
  const { t } = useTranslation()

  const { control, getValues } = useFormContext<IAgentForm>()
  const [selectModalVisible, setSelectModalVisible] = useState(false)
  const [integrationVisible, setIntegrationVisible] = useState(false)
  const {
    field: { onChange },
  } = useController({
    control,
    name: "aiTools",
  })

  const [fieldAiTools] = useWatch({
    control,
    name: ["aiTools"],
  })

  const handleValueChange = (values: IEditorAIToolsVO[]) => {
    onChange(values)
  }

  const handleRemoveFunction = (aiToolID: string) => {
    const aiTools = getValues("aiTools")
    onChange(aiTools.filter((item) => item.aiToolID !== aiToolID))
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
              <AddToolsButton
                toolsLength={field.value?.length}
                handleOpenSelectModal={handleOpenSelectModal}
              />
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

      {integrationVisible && (
        <IntegrationModal
          integrationVisible={integrationVisible}
          onCancel={() => setIntegrationVisible(false)}
        />
      )}
    </>
  )
})

FunctionsEditorPC.displayName = "FunctionsEditorPC"

export default FunctionsEditorPC
