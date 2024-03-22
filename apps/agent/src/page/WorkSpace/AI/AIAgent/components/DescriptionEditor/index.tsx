import Icon from "@ant-design/icons"
import { App, Input } from "antd"
import { FC, memo, useState } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { ErrorText } from "@/Layout/Form/ErrorText"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import AIIcon from "@/assets/agent/ai.svg?react"
import { useGeneratePromptDescriptionMutation } from "@/redux/services/agentAPI"
import { track } from "@/utils/mixpanelHelper"
import AILoadingIcon from "../../../components/AILoading/aiLoading.svg?react"
import { descContainerStyle, descTextStyle } from "./style"

const DescriptionEditor: FC = memo(() => {
  const { t } = useTranslation()
  const { control, getValues } = useFormContext<Agent>()
  const { message: messageApi } = App.useApp()
  const [generatePromptDescription] = useGeneratePromptDescriptionMutation()
  const [generateDescLoading, setGenerateDescLoading] = useState(false)
  const { errors } = useFormState({
    control: control,
  })

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  return (
    <Controller
      name="description"
      control={control}
      rules={{
        required: t("editor.ai-agent.validation_blank.description"),
        maxLength: {
          value: 160,
          message: t("editor.ai-agent.length_invalid.description"),
        },
      }}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          mode="modal"
          title={t("editor.ai-agent.label.desc")}
          subtitleTips={t("editor.ai-agent.generate-desc.tooltips")}
          required
          subtitle={
            <div
              css={descContainerStyle}
              onClick={async () => {
                // track(
                //   ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                //   ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                //   {
                //     element: "desc_generate",
                //     parameter1: getValues("prompt") ? true : false,
                //     parameter5: agent.aiAgentID || "-1",
                //   },
                // )
                const currentTime = performance.now()
                if (!getValues("prompt")) {
                  messageApi.error({
                    content: t("editor.ai-agent.generate-desc.blank"),
                  })
                  return
                }
                setGenerateDescLoading(true)
                try {
                  const desc = await generatePromptDescription({
                    teamID: currentTeamInfo.id,
                    prompt: getValues("prompt"),
                  }).unwrap()
                  track(
                    ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                    ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                    {
                      element: "desc_generate",
                      consume: performance.now() - currentTime,
                      parameter2: "suc",
                    },
                  )
                  field.onChange(desc.payload)
                } catch (e) {
                  track(
                    ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                    ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                    {
                      element: "desc_generate",
                      consume: performance.now() - currentTime,
                      parameter2: "failed",
                    },
                  )
                  messageApi.error({
                    content: t("editor.ai-agent.generate-desc.failed"),
                  })
                } finally {
                  setGenerateDescLoading(false)
                }
              }}
            >
              {generateDescLoading ? (
                <Icon
                  component={AILoadingIcon}
                  spin
                  style={{
                    fontSize: "12px",
                  }}
                />
              ) : (
                <Icon
                  component={AIIcon}
                  style={{
                    fontSize: "12px",
                  }}
                />
              )}
              <div css={descTextStyle}>
                {t("editor.ai-agent.generate-desc.button")}
              </div>
            </div>
          }
        >
          <Input.TextArea
            {...field}
            status={!!errors.description ? "error" : undefined}
            maxLength={160}
            placeholder={t("editor.ai-agent.placeholder.desc")}
            rows={5}
          />
          {errors.description?.message && (
            <ErrorText errorMessage={errors.description?.message} />
          )}
        </LayoutBlock>
      )}
    />
  )
})

DescriptionEditor.displayName = "DescriptionEditor"

export default DescriptionEditor
