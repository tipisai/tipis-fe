import Icon from "@ant-design/icons"
import { Button, Dropdown, MenuProps } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import {
  InfoIcon,
  MoreIcon,
  PenIcon,
  PinIcon,
  ShareIcon,
} from "@illa-public/icon"

const MobileMoreActionButton: FC = () => {
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
    {
      key: "share",
      label: t("Share"),
      icon: <Icon component={ShareIcon} />,
    },
  ]
  return (
    <div>
      <Dropdown
        menu={{
          items: items,
        }}
        trigger={["click"]}
      >
        <Button icon={<Icon component={MoreIcon} />} type="text" />
      </Dropdown>
    </div>
  )
}

MobileMoreActionButton.displayName = "MobileMoreActionButton"
export default MobileMoreActionButton
