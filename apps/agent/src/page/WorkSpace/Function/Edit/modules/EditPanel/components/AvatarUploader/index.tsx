// import Icon from "@ant-design/icons"
// import { Image } from "antd"
import { FC, memo } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
// import { getColor } from "@illa-public/color-scheme"
// import { PlusIcon } from "@illa-public/icon"
import { IAIFunctionResource } from "@illa-public/public-types"
import { ErrorText } from "@/Layout/Form/ErrorText"
import LayoutBlock from "@/Layout/Form/LayoutBlock"

// import {
//   uploadContainerStyle,
//   uploadContentContainerStyle,
//   uploadTextStyle,
// } from "./style"

const AvatarUploader: FC = memo(() => {
  const { t } = useTranslation()
  const { control } = useFormContext<IAIFunctionResource>()

  const { errors } = useFormState({
    control: control,
  })

  return (
    <Controller
      name="config.icon"
      control={control}
      shouldUnregister={false}
      render={() => (
        <LayoutBlock
          title={t("editor.ai-agent.label.icon")}
          subtitleTips={t("editor.ai-agent.generate-icon.tooltips")}
        >
          {/* <AvatarUpload
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
            <div onClick={() => {}}>
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
          </AvatarUpload> */}
          {errors.config?.icon?.message && (
            <ErrorText errorMessage={errors.config?.icon?.message} />
          )}
        </LayoutBlock>
      )}
    />
  )
})

AvatarUploader.displayName = "AvatarUploader"

export default AvatarUploader
