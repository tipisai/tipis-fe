import Icon from "@ant-design/icons"
import { Image } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { AvatarUpload } from "@illa-public/cropper"
import { PlusIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { Agent } from "@illa-public/public-types"
import { ErrorText } from "@/Layout/Form/ErrorText"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { track } from "@/utils/mixpanelHelper"
import {
  uploadContainerStyle,
  uploadContentContainerStyle,
  uploadTextStyle,
} from "./style"

const AvatarUploader: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<Agent>()

  const { errors } = useFormState({
    control: control,
  })

  return (
    <Controller
      name="icon"
      control={control}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          mode="modal"
          title={t("editor.ai-agent.label.icon")}
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
                  console.log("field.value", field.value)
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
