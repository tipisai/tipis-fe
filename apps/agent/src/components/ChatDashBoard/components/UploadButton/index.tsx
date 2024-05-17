import Icon from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import { forwardRef } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { AttachmentIcon } from "@illa-public/icon"
import { ACCEPT } from "@/config/constants/knowledge"
import { IUploadButtonProps } from "./interface"
import { sendFileContainerStyle } from "./style"

const UploadButton = forwardRef<HTMLInputElement, IUploadButtonProps>(
  ({}, ref) => {
    const { t } = useTranslation()
    return (
      <Tooltip
        title={t("dashboard.message.support_for_uploadin")}
        placement="top"
        trigger="hover"
      >
        <div css={sendFileContainerStyle}>
          <Button
            size="large"
            icon={
              <Icon
                component={AttachmentIcon}
                color={getColor("grayBlue", "02")}
              />
            }
          />
          <input
            style={{ display: "none" }}
            type="file"
            accept={ACCEPT.join(",")}
            ref={ref}
            multiple
          />
        </div>
      </Tooltip>
    )
  },
)

UploadButton.displayName = "UploadButton"
export default UploadButton
