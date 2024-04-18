import Icon from "@ant-design/icons"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview"
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled"
import { Button, ConfigProvider, Divider, Tooltip } from "antd"
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { TipisTrack } from "@illa-public/track-utils"
import { ILLAPublicStorage } from "@illa-public/utils"
import UserInfoContent from "@/Layout/Workspace/components/UserInfoContent"
import PinedTipisArea from "@/Layout/Workspace/modules/PinedTipis/pc"
import PCRecentTabs from "@/Layout/Workspace/modules/RecentTabs/pc"
import LogoIcon from "@/assets/public/logo.svg?react"
import MenuExpandIcon from "@/assets/workspace/menuExpand.svg?react"
import { getPinedTipis } from "@/redux/ui/pinedTipis/selector"
import { COMMON_MENU_PINED_AREA_MIN_HEIGHT } from "../../../config"
import { MenuStatusUIContext } from "../context"
import {
  activeDividerStyle,
  dividerInnerContainerStyle,
  dividerStyle,
  tabAreaContainerStyle,
} from "../style"
import { getProposedHeight } from "../utils"
import {
  dividerContainerStyle,
  miniMenuContainerStyle,
  miniMenuFooterContainerStyle,
  miniMenuInnerContainerStyle,
  miniMenuLockSideBarContainerStyle,
  miniMenuTopAreaContainerStyle,
  miniMenuUserAvatarContainerStyle,
  userInfoContainerStyle,
} from "./style"

const MiniMenu: FC = () => {
  const { changeCollapsed } = useContext(MenuStatusUIContext)

  const { t } = useTranslation()
  const [pinedAreaListHeight, setPinedAreaListHeight] = useState(
    (ILLAPublicStorage.getLocalStorage("pinedAreaListHeight") as
      | undefined
      | number) ?? COMMON_MENU_PINED_AREA_MIN_HEIGHT,
  )
  const pinedTipis = useSelector(getPinedTipis)

  const hasPinedTipis = pinedTipis.length > 0

  const [draggingState, setDraggingState] = useState<"idle" | "dragging">(
    "idle",
  )
  const dividerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const tabAreaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const divider = dividerRef.current
    const tabArea = tabAreaRef.current
    if (!divider || !contentRef) return

    return draggable({
      element: divider,
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        // we will be moving the line to indicate a drag
        // we can disable the native drag preview
        disableNativeDragPreview({ nativeSetDragImage })
        // we don't want any native drop animation for when the user
        // does not drop on a drop target. we want the drag to finish immediately
        preventUnhandled.start()
      },
      onDragStart() {
        setDraggingState("dragging")
      },
      onDrag({ location }) {
        const tabAreaHeight = tabArea?.getBoundingClientRect().height ?? 0
        contentRef.current?.style.setProperty(
          "--local-resizing-height",
          `${getProposedHeight({ initialHeight: pinedAreaListHeight, location, tabAreaHeight, isMiniSize: true })}px`,
        )
      },
      onDrop({ location }) {
        preventUnhandled.stop()
        setDraggingState("idle")
        const tabAreaHeight = tabArea?.getBoundingClientRect().height ?? 0

        const finalHeight = getProposedHeight({
          initialHeight: pinedAreaListHeight,
          location,
          tabAreaHeight,
          isMiniSize: true,
        })

        setPinedAreaListHeight(finalHeight)
        ILLAPublicStorage.setLocalStorage("pinedAreaListHeight", finalHeight)
        contentRef.current?.style.removeProperty("--local-resizing-height")
      },
    })
  }, [pinedAreaListHeight])

  const onClickFoldButton = useCallback(() => {
    TipisTrack.track("click_collapse")

    changeCollapsed(false)
  }, [changeCollapsed])

  return (
    <section css={miniMenuContainerStyle}>
      <div css={miniMenuInnerContainerStyle}>
        <div css={miniMenuTopAreaContainerStyle}>
          <div css={miniMenuUserAvatarContainerStyle}>
            <Icon component={LogoIcon} />
          </div>
          <div css={miniMenuLockSideBarContainerStyle}>
            <Tooltip
              title={t("homepage.left_panel.tab.expand_menu")}
              placement="right"
              align={{
                offset: [16, 0],
              }}
            >
              <Button
                icon={<Icon component={MenuExpandIcon} />}
                type="text"
                onClick={onClickFoldButton}
              />
            </Tooltip>
          </div>
          <div css={tabAreaContainerStyle} ref={tabAreaRef}>
            {hasPinedTipis && (
              <PinedTipisArea
                isMiniSize
                height={pinedAreaListHeight}
                ref={contentRef}
              />
            )}
            <div css={dividerContainerStyle}>
              <div css={dividerInnerContainerStyle(false)} ref={dividerRef}>
                <div
                  css={[
                    dividerStyle,
                    draggingState === "dragging" && activeDividerStyle,
                  ]}
                  className="divider"
                />
              </div>
            </div>
            <PCRecentTabs isMiniSize />
          </div>
          <div css={miniMenuFooterContainerStyle}>
            <div css={dividerContainerStyle}>
              <ConfigProvider
                theme={{
                  components: {
                    Divider: {
                      textPaddingInline: 0,
                      colorSplit: "rgba(16, 9, 116, 0.08);",
                    },
                  },
                }}
              >
                <Divider
                  style={{
                    margin: "0",
                  }}
                />
              </ConfigProvider>
            </div>
            <div css={userInfoContainerStyle}>
              <UserInfoContent isMiniSize />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

MiniMenu.displayName = "MiniMenu"

export default MiniMenu
