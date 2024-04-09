import Icon from "@ant-design/icons"
import { App, Input } from "antd"
import { FC, memo, useState } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Agent } from "@illa-public/public-types"
import { TipisTrack } from "@illa-public/track-utils"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import AIIcon from "@/assets/agent/ai.svg?react"
import { useGeneratePromptDescriptionMutation } from "@/redux/services/agentAPI"
import AILoadingIcon from "../../../components/AILoading/aiLoading.svg?react"
import { SCROLL_ID } from "../../interface"
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
          scrollId={SCROLL_ID.DESCRIPTION}
          title={t("editor.ai-agent.label.desc")}
          subtitleTips={t("editor.ai-agent.generate-desc.tooltips")}
          required
          errorMessage={errors.description?.message}
          subtitle={
            <div
              css={descContainerStyle}
              onClick={async () => {
                TipisTrack.track("click_generate_desc", {
                  parameter1: getValues("aiAgentID") ? "edit" : "create",
                })
                const prompt = getValues("prompt")
                if (!prompt) {
                  messageApi.error({
                    content: t("editor.ai-agent.generate-desc.blank"),
                  })
                  return
                }
                setGenerateDescLoading(true)
                try {
                  const desc = await generatePromptDescription({
                    teamID: currentTeamInfo.id,
                    prompt: prompt,
                  }).unwrap()

                  field.onChange(desc.payload)
                } catch (e) {
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
            autoSize={{
              minRows: 1,
              maxRows: 5,
            }}
          />
        </LayoutBlock>
      )}
    />
  )
})

DescriptionEditor.displayName = "DescriptionEditor"

export default DescriptionEditor
