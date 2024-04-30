import Icon from "@ant-design/icons"
import { App, Button, Dropdown, List, MenuProps, Tag } from "antd"
import { FC, MouseEventHandler, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { CopyIcon, DeleteIcon, MoreIcon, PenIcon } from "@illa-public/icon"
import PCTeamCard from "@/components/TeamCard/pc"
import {
  useDeleteAIToolByIDMutation,
  useDuplicateAIToolByIDMutation,
} from "@/redux/services/aiToolsAPI"
import { canShowCreateFunction } from "@/utils/UIHelper/functions"
import { canShownCreateTipi } from "@/utils/UIHelper/tipis"
import { useNavigateToEditFunction } from "@/utils/routeHelper/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { ITeamCardListItemProps } from "./interface"

const TeamCardListItem: FC<ITeamCardListItemProps> = (props) => {
  const { icon, title, description, id, publishToMarketplace } = props
  const { modal, message } = App.useApp()

  const { t } = useTranslation()
  const currentTeamInfo = useGetCurrentTeamInfo()!

  const [duplicateAIToolByID] = useDuplicateAIToolByIDMutation()
  const [deleteAIToolByID] = useDeleteAIToolByIDMutation()
  const navigateToEditFunction = useNavigateToEditFunction()

  const [isMoreActionDropdownOpen, setIsMoreActionDropdownOpen] =
    useState(false)

  const tags = publishToMarketplace ? (
    <Tag color="purple">Marketplace</Tag>
  ) : undefined

  const menuItems: MenuProps["items"] = useMemo(() => {
    const originMenuItems: MenuProps["items"] = []
    if (canShowCreateFunction(currentTeamInfo)) {
      originMenuItems.push({
        label: t("dashboard.common.duplicate"),
        key: "duplicate",
        icon: <Icon component={CopyIcon} />,
      })
    }

    if (canShownCreateTipi(currentTeamInfo)) {
      originMenuItems.push({
        label: t("dashboard.common.delete"),
        key: "delete",
        danger: true,
        icon: <Icon component={DeleteIcon} />,
      })
    }
    return originMenuItems
  }, [currentTeamInfo, t])

  const onClickMenuItem: MenuProps["onClick"] = async ({ key, domEvent }) => {
    domEvent.stopPropagation()
    switch (key) {
      case "duplicate": {
        try {
          await duplicateAIToolByID({
            teamID: currentTeamInfo.id,
            aiToolID: id,
          }).unwrap()
        } catch {
          message.error({
            content: t("dashboard.app.duplicate_fail"),
          })
        }
        break
      }

      case "delete": {
        modal.confirm({
          title: t("dashboard.common.delete_title"),
          content: t("dashboard.common.delete_content"),
          cancelText: t("dashboard.common.delete_cancel_text"),
          okText: t("dashboard.common.delete_ok_text"),
          okButtonProps: {
            type: "primary",
            danger: true,
          },
          onOk: () => {
            deleteAIToolByID({
              teamID: currentTeamInfo.id,
              aiToolID: id,
            })
          },
        })
        break
      }
      default:
        break
    }
  }

  const onClickCard = () => {}

  const onClickEditButton: MouseEventHandler<HTMLElement> = async (e) => {
    e.stopPropagation()
    await navigateToEditFunction({
      functionName: title,
      functionID: id,
    })
  }

  const onClickMoreAction: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    setIsMoreActionDropdownOpen(true)
  }

  return (
    <List.Item>
      <PCTeamCard
        icon={icon}
        title={title}
        description={description}
        tags={tags}
        onClickCard={onClickCard}
        moreButton={
          menuItems.length > 0 && (
            <Dropdown
              open={isMoreActionDropdownOpen}
              onOpenChange={setIsMoreActionDropdownOpen}
              trigger={["click"]}
              menu={{
                items: menuItems,
                onClick: onClickMenuItem,
              }}
            >
              <Button
                type="text"
                icon={<Icon component={MoreIcon} />}
                onClick={onClickMoreAction}
              />
            </Dropdown>
          )
        }
        editButton={
          <>
            <Button
              type="text"
              icon={<Icon component={PenIcon} />}
              onClick={onClickEditButton}
            >
              Edit
            </Button>
          </>
        }
      />
    </List.Item>
  )
}

export default TeamCardListItem
