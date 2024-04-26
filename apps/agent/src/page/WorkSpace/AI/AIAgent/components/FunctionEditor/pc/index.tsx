import Icon from "@ant-design/icons"
import { Button, Modal, Typography } from "antd"
import { FC, memo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import {
  IEditorFunctionItem,
  TIntegrationType,
} from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { IntegrationTypeSelector } from "@/Modules/Integration/IntegrationSelector"
import BlackButton from "@/components/BlackButton"
import { useCreateFunction } from "@/utils/recentTabs/hook"
import { IAgentForm } from "../../../interface"
import { FUNCTION_LEARN_MORE_LINK } from "../constants"
import { IFunctionItemDetail } from "../interface"
import { MOCK_LIST_DATA } from "../mockData"
import EditorFunctionItem from "../modules/EditorFunctionItem"
import EmptyFunctionContentPC from "./components/EmptyFunctionContentPC"
import SelectModalContentPC from "./components/SelectModalContentPC"
import { containerStyle, functionContainerStyle, titleStyle } from "./style"

const FunctionsEditorPC: FC = memo(() => {
  const { t } = useTranslation()

  const { control, getValues, setValue } = useFormContext<IAgentForm>()
  const [selectModalVisible, setSelectModalVisible] = useState(false)
  const [integrationVisible, setIntegrationVisible] = useState(false)
  const createFunction = useCreateFunction()

  const [fieldFunctions] = useWatch({
    control,
    name: ["functions"],
  })

  const handleValueChange = (values: IEditorFunctionItem[]) => {
    setValue("functions", values)
  }

  const handleRemoveFunction = (functionID: string) => {
    const functions = getValues("functions")
    setValue(
      "functions",
      functions.filter((item) => item.functionID !== functionID),
    )
  }

  const handleClickCreate = () => {
    setSelectModalVisible(false)
    setIntegrationVisible(true)
  }

  // t--------empData
  const [listData, setListData] = useState<IFunctionItemDetail[]>([])
  const handleOpenSelectModal = async () => {
    // triggerGetValue()
    setListData(MOCK_LIST_DATA)
    setSelectModalVisible(true)
  }

  return (
    <>
      <Controller
        name="functions"
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
                {field.value.map((item) => (
                  <EditorFunctionItem
                    key={item.functionID}
                    {...item}
                    handleRemoveItem={handleRemoveFunction}
                  />
                ))}
              </div>
              {field.value.length > 0 ? (
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
      <Modal
        open={selectModalVisible}
        destroyOnClose
        width={520}
        footer={false}
        onCancel={() => setSelectModalVisible(false)}
        title={
          <span css={titleStyle}>
            {t("editor.action.form.title.general.add_functions  ")}
          </span>
        }
        styles={{
          content: {
            padding: 0,
          },
          header: {
            margin: 0,
          },
          footer: {
            margin: 0,
          },
        }}
      >
        {Array.isArray(listData) && listData.length > 0 ? (
          <SelectModalContentPC
            functions={listData}
            onCancel={() => setSelectModalVisible(false)}
            onConfirm={handleValueChange}
            fieldFunctions={fieldFunctions}
            handleClickCreate={handleClickCreate}
          />
        ) : (
          <EmptyFunctionContentPC handleClickCreate={handleClickCreate} />
        )}
      </Modal>

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
