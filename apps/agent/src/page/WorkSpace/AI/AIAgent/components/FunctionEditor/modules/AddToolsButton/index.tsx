import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { AddIcon } from "@illa-public/icon"
import BlackButton from "@/components/BlackButton"
import { IAddToolsButtonProps } from "./interface"

const AddToolsButton: FC<IAddToolsButtonProps> = ({
  toolsLength,
  handleOpenSelectModal,
}) => {
  const { t } = useTranslation()
  return toolsLength > 0 ? (
    <BlackButton
      style={{
        marginBottom: "8px",
        padding: "1px 8px",
        minWidth: "32px",
      }}
      type="text"
      icon={<Icon component={AddIcon} />}
      onClick={handleOpenSelectModal}
    >
      {t("editor.action.panel.btn.new")}
    </BlackButton>
  ) : (
    <Button
      block
      size="large"
      icon={<Icon component={AddIcon} />}
      onClick={handleOpenSelectModal}
    >
      {t("editor.action.panel.btn.new")}
    </Button>
  )
}

export default AddToolsButton
