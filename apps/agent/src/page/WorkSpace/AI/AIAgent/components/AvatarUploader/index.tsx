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
import { message } from "@/utils/antdStore"
import { track } from "@/utils/mixpanelHelper"
import { IAgentForm } from "../../interface"
import { uploadContentContainerStyle } from "./style"

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: FileType) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg"
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!")
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!")
  }
  return isJpgOrPng && isLt2M
}

const AvatarUploader: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IAgentForm>()

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
