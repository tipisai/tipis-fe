import { Typography } from "antd"
import { FC, memo, useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
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

  const { control, getValues, setValue } = useFormContext<IAgentForm>()
  const [selectModalVisible, setSelectModalVisible] = useState(false)
  const [integrationVisible, setIntegrationVisible] = useState(false)
  const { aiToolID, aiToolName, aiToolIcon } = useParams()

  const [fieldAiTools] = useWatch({
    control,
    name: ["aiTools"],
  })

  const handleValueChange = (values: IEditorAIToolsVO[]) => {
    setValue("aiTools", values, { shouldDirty: true })
  }

  const handleRemoveFunction = (aiToolID: string) => {
    const aiTools = getValues("aiTools")
    setValue(
      "aiTools",
      aiTools.filter((item) => item.aiToolID !== aiToolID),
      { shouldDirty: true },
    )
  }

  const handleClickCreate = () => {
    setSelectModalVisible(false)
    setIntegrationVisible(true)
  }

  const handleOpenSelectModal = async () => {
    setSelectModalVisible(true)
  }

  useEffect(() => {
    if (aiToolID && aiToolIcon && aiToolName) {
      const aiTools = [...getValues("aiTools")]
      const targetAiToolIndex = aiTools.findIndex(
        (item) => item.aiToolID === aiToolID,
      )
      if (targetAiToolIndex !== -1) {
        aiTools[targetAiToolIndex] = {
          ...aiTools[targetAiToolIndex],
          name: aiToolName,
          config: {
            icon: aiToolIcon,
          },
        }
      } else {
        aiTools.push({
          aiToolID,
          name: aiToolName,
          config: {
            icon: aiToolIcon,
          },
        })
      }
      setValue("aiTools", aiTools)
    }
  }, [aiToolID, aiToolIcon, aiToolName, getValues, setValue])

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
