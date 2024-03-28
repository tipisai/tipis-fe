import Icon from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import { forwardRef } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { AttachmentIcon } from "@illa-public/icon"
import { ACCEPT } from "@/config/constants/knowledge"
import { sendFileContainerStyle } from "./style"

interface UploadButton {
  handleClick: () => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UploadButton = forwardRef<HTMLInputElement, UploadButton>(
  ({ handleClick, handleFileChange }, ref) => {
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
            onClick={handleClick}
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
            onChange={handleFileChange}
          />
        </div>
      </Tooltip>
    )
  },
)

UploadButton.displayName = "UploadButton"
export default UploadButton
