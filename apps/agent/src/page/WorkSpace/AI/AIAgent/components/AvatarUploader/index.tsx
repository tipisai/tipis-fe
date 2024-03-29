import { GetProp, Image, Upload, UploadProps } from "antd"
import ImgCrop from "antd-img-crop"
import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { track } from "@/utils/mixpanelHelper"
import { IAgentForm } from "../../interface"
import { uploadContentContainerStyle } from "./style"
import { useBeforeUploadAvatar } from "./utils"

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const AvatarUploader: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IAgentForm>()
  const beforeUpload = useBeforeUploadAvatar()

  return (
    <Controller
      name="icon"
      control={control}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock
          title={t("editor.ai-agent.label.icon")}
          subtitleTips={t("editor.ai-agent.generate-icon.tooltips")}
        >
          <MixpanelTrackProvider
            basicTrack={track}
            pageName={ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT}
          >
            <ImgCrop
              rotationSlider
              onModalOk={(v) => {
                getBase64(v as FileType, (url) => {
                  field.onChange(url)
                })
              }}
              beforeCrop={beforeUpload}
              cropShape="round"
            >
              <Upload
                listType="picture-card"
                showUploadList={false}
                onRemove={() => {
                  field.onChange("")
                }}
              >
                {field.value ? (
                  <Image
                    src={field.value}
                    css={uploadContentContainerStyle}
                    width="100px"
                    height="100px"
                    preview={{
                      visible: false,
                      mask: "+ Upload",
                    }}
                  />
                ) : (
                  "+ Upload"
                )}
              </Upload>
            </ImgCrop>
          </MixpanelTrackProvider>
        </LayoutBlock>
      )}
    />
  )
})

AvatarUploader.displayName = "AvatarUploader"

export default AvatarUploader
