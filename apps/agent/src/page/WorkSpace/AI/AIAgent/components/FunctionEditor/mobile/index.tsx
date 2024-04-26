import Icon from "@ant-design/icons"
import { Button, Drawer, Typography } from "antd"
import { FC, memo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { AddIcon, CloseIcon } from "@illa-public/icon"
import { IEditorFunction } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import BlackButton from "@/components/BlackButton"
import { IAgentForm } from "../../../interface"
import { FUNCTION_LEARN_MORE_LINK } from "../constants"
import EditorFunctionItem from "../modules/EditorFunctionItem"
import EmptyFunctionContentMobile from "./components/EmptyFunctionContentMobile"
import SelectModalContentMobile from "./components/SelectModalContentMobile"
import {
  closeIconStyle,
  containerStyle,
  functionContainerStyle,
  titleStyle,
} from "./style"

const FunctionsEditorMobile: FC = memo(() => {
  const { t } = useTranslation()

  const { control, getValues, setValue } = useFormContext<IAgentForm>()
  const [selectModalVisible, setSelectModalVisible] = useState(false)

  const [fieldAiTools] = useWatch({
    control,
    name: ["aiTools"],
  })

  const handleValueChange = (values: IEditorFunction[]) => {
    setValue("aiTools", values)
  }

  const handleRemoveFunction = (aiToolID: string) => {
    const aiTools = getValues("aiTools")
    setValue(
      "aiTools",
      aiTools.filter((item) => item.aiToolID !== aiToolID),
    )
  }

  // t--------empData
  const [listData, setListData] = useState<IEditorFunction[]>([])
  const handleOpenSelectModal = async () => {
    // triggerGetValue()
    setListData([])
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
                    isMobile
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
      <Drawer
        open={selectModalVisible}
        destroyOnClose
        footer={false}
        title={
          <span css={titleStyle}>
            {t("editor.action.form.title.general.add_functions")}
          </span>
        }
        width="100%"
        height="100%"
        placement="bottom"
        onClose={() => setSelectModalVisible(false)}
        closeIcon={<Icon component={CloseIcon} css={closeIconStyle} />}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        {Array.isArray(listData) && listData.length > 0 ? (
          <SelectModalContentMobile
            functions={listData}
            onCancel={() => setSelectModalVisible(false)}
            onConfirm={handleValueChange}
            fieldFunctions={fieldAiTools}
          />
        ) : (
          <EmptyFunctionContentMobile />
        )}
      </Drawer>
    </>
  )
})

FunctionsEditorMobile.displayName = "FunctionsEditorMobile"

export default FunctionsEditorMobile
