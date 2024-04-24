import Icon from "@ant-design/icons"
import { ConfigProvider, GetProp, Image, Upload, UploadProps } from "antd"
import ImgCrop from "antd-img-crop"
import { FC, memo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import LayoutBlock from "@/Layout/Function/LayoutBlock"
import { IBaseFunctionForm } from "../../../interface"
import { customUploadStyle, uploadContentContainerStyle } from "./style"
import { useBeforeUploadAvatar } from "./utils"

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const AvatarUploader: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IBaseFunctionForm>()
  const beforeUpload = useBeforeUploadAvatar()

  return (
    <Controller
      name="config.icon"
      control={control}
      shouldUnregister={false}
      render={({ field }) => (
        <LayoutBlock title={t("editor.ai-agent.label.icon")}>
          <ConfigProvider
            theme={{
              token: {
                controlHeightLG: 47,
              },
            }}
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
                css={customUploadStyle}
                onRemove={() => {
                  field.onChange("")
                }}
                customRequest={() => {}}
              >
                {field.value ? (
                  <Image
                    src={field.value}
                    css={uploadContentContainerStyle}
                    width="120px"
                    height="120px"
                    preview={{
                      visible: false,
                      mask: <Icon component={PlusIcon} />,
                    }}
                  />
                ) : (
                  <Icon component={PlusIcon} />
                )}
              </Upload>
            </ImgCrop>
          </ConfigProvider>
        </LayoutBlock>
      )}
    />
  )
})

AvatarUploader.displayName = "AvatarUploader"

export default AvatarUploader
