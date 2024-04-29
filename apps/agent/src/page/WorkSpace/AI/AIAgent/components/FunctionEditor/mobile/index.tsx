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
import SelectDrawer from "./components/SelectDrawer"
import { containerStyle, functionContainerStyle } from "./style"

const FunctionsEditorMobile: FC = memo(() => {
  const { t } = useTranslation()

  const { control, getValues, setValue } = useFormContext<IAgentForm>()
  const [selectModalVisible, setSelectModalVisible] = useState(false)
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

  const handleOpenSelectModal = async () => {
    setSelectModalVisible(true)
  }

  useEffect(() => {
    if (aiToolID && aiToolIcon && aiToolName) {
      const aiTools = getValues("aiTools")
      if (aiTools.some((item) => item.aiToolID === aiToolID)) {
        return
      }
      setValue(
        "aiTools",
        [
          ...aiTools,
          {
            aiToolID,
            name: aiToolName,
            config: {
              icon: aiToolIcon,
            },
          },
        ],
        { shouldDirty: true },
      )
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
                    isMobile
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
        <SelectDrawer
          selectModalVisible={selectModalVisible}
          onCancel={() => setSelectModalVisible(false)}
          fieldAiTools={fieldAiTools}
          handleValueChange={handleValueChange}
        />
      )}
    </>
  )
})

FunctionsEditorMobile.displayName = "FunctionsEditorMobile"

export default FunctionsEditorMobile
