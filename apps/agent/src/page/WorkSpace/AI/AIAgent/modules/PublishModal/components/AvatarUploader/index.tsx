import Icon from "@ant-design/icons"
import { App, Image } from "antd"
import { FC, memo, useState } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { getColor } from "@illa-public/color-scheme"
import { AvatarUpload } from "@illa-public/cropper"
import { PlusIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { Agent } from "@illa-public/public-types"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { ErrorText } from "@/Layout/Form/ErrorText"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import AIIcon from "@/assets/agent/ai.svg?react"
import { useGenerateIconMutation } from "@/redux/services/agentAPI"
import { track } from "@/utils/mixpanelHelper"
import AILoadingIcon from "../../../../../components/AILoading/aiLoading.svg?react"
import {
  descContainerStyle,
  descTextStyle,
  uploadContainerStyle,
  uploadContentContainerStyle,
  uploadTextStyle,
} from "./style"

const AvatarUploader: FC = memo(() => {
  const { t } = useTranslation()
  const { control, getValues } = useFormContext<Agent>()
  const { message: messageApi } = App.useApp()
  const [generateIcon] = useGenerateIconMutation()

  const [generateIconLoading, setGenerateIconLoading] = useState(false)
  const { errors } = useFormState({
    control: control,
  })

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  return (
    <Controller
      name="icon"
      control={control}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          mode="modal"
          title={t("editor.ai-agent.label.icon")}
          subtitle={
            <div
              css={descContainerStyle}
              onClick={async () => {
                // track(
                //   ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                //   ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                //   {
                //     element: "icon_generate",
                //     parameter1: getValues("prompt") ? true : false,
                //     parameter5: agent.aiAgentID || "-1",
                //   },
                // )
                const currentTime = performance.now()
                if (!getValues("name") || !getValues("description")) {
                  messageApi.error({
                    content: t("editor.ai-agent.generate-icon.blank"),
                  })
                  return
                }
                setGenerateIconLoading(true)
                try {
                  const icon = await generateIcon({
                    teamID: currentTeamInfo.id,
                    name: getValues("name"),
                    description: getValues("description"),
                  }).unwrap()

                  track(
                    ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                    ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                    {
                      element: "icon_generate",
                      consume: performance.now() - currentTime,
                      parameter2: "suc",
                    },
                  )
                  field.onChange(icon.payload)
                } catch (e) {
                  track(
                    ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                    ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                    {
                      element: "icon_generate",
                      consume: performance.now() - currentTime,
                      parameter2: "failed",
                    },
                  )
                  messageApi.error({
                    content: t("editor.ai-agent.generate-desc.failed"),
                  })
                } finally {
                  setGenerateIconLoading(false)
                }
              }}
            >
              {generateIconLoading ? (
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
          subtitleTips={t("editor.ai-agent.generate-icon.tooltips")}
        >
          <MixpanelTrackProvider
            basicTrack={track}
            pageName={ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT}
          >
            <AvatarUpload
              onOk={async (file) => {
                let reader = new FileReader()
                reader.onload = () => {
                  field.onChange(reader.result)
                  // setInRoomUsers(
                  //   updateLocalIcon(reader.result as string, inRoomUsers),
                  // )
                }
                reader.readAsDataURL(file)
                return true
              }}
            >
              <div
                onClick={() => {
                  track(
                    ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                    ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                    {
                      element: "avater",
                    },
                  )
                }}
              >
                {!field.value ? (
                  <div>
                    <div css={uploadContainerStyle}>
                      <div css={uploadContentContainerStyle}>
                        <Icon
                          component={PlusIcon}
                          color={getColor("grayBlue", "03")}
                        />

                        <div css={uploadTextStyle}>
                          {t("editor.ai-agent.placeholder.icon")}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={field.value}
                    css={uploadContentContainerStyle}
                    width="100px"
                    height="100px"
                  />
                )}
              </div>
            </AvatarUpload>
          </MixpanelTrackProvider>
          {errors.icon?.message && (
            <ErrorText errorMessage={errors.icon?.message} />
          )}
        </LayoutBlock>
      )}
    />
  )
})

AvatarUploader.displayName = "AvatarUploader"

export default AvatarUploader
