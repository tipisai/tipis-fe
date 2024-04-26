import Icon from "@ant-design/icons"
import { Button, Drawer, Typography } from "antd"
import { FC, memo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { AddIcon, CloseIcon } from "@illa-public/icon"
import { IEditorAIToolsVO } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import BlackButton from "@/components/BlackButton"
import { useLazyGetAllAIToolsListQuery } from "@/redux/services/aiToolsAPI"
import { useGetCurrentTeamInfo } from "@/utils/team"
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
  const teamInfo = useGetCurrentTeamInfo()
  const [newloading, setNewLoading] = useState(false)

  const [triggerGetAllAIToolsList] = useLazyGetAllAIToolsListQuery()

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

  const [listData, setListData] = useState<IEditorAIToolsVO[]>([])
  const handleOpenSelectModal = async () => {
    if (!teamInfo) return
    try {
      setNewLoading(true)
      const list = await triggerGetAllAIToolsList({
        teamID: teamInfo.id,
        sortBy: "createdAt",
      }).unwrap()
      setListData(list.aiToolList)
      setSelectModalVisible(true)
    } catch (e) {
    } finally {
      setNewLoading(false)
    }
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
                  loading={newloading}
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
                  loading={newloading}
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
