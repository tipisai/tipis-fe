import Icon from "@ant-design/icons"
import { Button, Dropdown, MenuProps } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { InfoIcon, MoreIcon, PenIcon, PinIcon } from "@illa-public/icon"

const MoreActionButton: FC = () => {
  const { t } = useTranslation()
  const items: MenuProps["items"] = [
    {
      key: "pin",
      label: t("Pin"),
      icon: <Icon component={PinIcon} />,
    },
    {
      key: "edit",
      label: t("Edit"),
      icon: <Icon component={PenIcon} />,
    },
    {
      key: "detail",
      label: t("Detail"),
      icon: <Icon component={InfoIcon} />,
    },
  ]

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button size="large" icon={<Icon component={MoreIcon} />} />
    </Dropdown>
  )
}

export default MoreActionButton
