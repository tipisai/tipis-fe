import { GetProp, Image, Upload, UploadProps } from "antd"
import ImgCrop from "antd-img-crop"
import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
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
              customRequest={() => {}}
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
        </LayoutBlock>
      )}
    />
  )
})

AvatarUploader.displayName = "AvatarUploader"

export default AvatarUploader
