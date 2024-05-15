// import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
// import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview"
// import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled"
// import { App } from "antd"
import { FC } from "react"
// import { useTranslation } from "react-i18next"
// import { useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"
import { useGetTeamsInfoQuery } from "@illa-public/user-data"
// import { ILLAPublicStorage } from "@illa-public/utils"
import FeatureArea from "@/Layout/Workspace/modules/FeatureArea"
import MenuFooter from "@/Layout/Workspace/modules/MenuFooter"
// import PCRecentTabs from "@/Layout/Workspace/modules/RecentTabs/pc"
import TeamSelectAndInviteButton from "@/Layout/Workspace/modules/TeamSelectAndInviteButton"
// import { getPinedTipis } from "@/redux/ui/pinedTipis/selector"
// import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
// import { useRemoveAllRecentTabReducer } from "@/utils/recentTabs/baseHook"
// import { getChatPath } from "@/utils/routeHelper"
// import { useGetCurrentTeamInfo } from "@/utils/team"
// import PinedTipisArea from "../../../modules/PinedTipis/pc"
// import {
//   COMMON_MENU_PINED_AREA_MIN_HEIGHT,
//   COMMON_MENU_PINED_AREA_SINGLE_MIN_HEIGHT,
// } from "../../config"
import MenuHeader from "../MenuHeader"
import {
  // activeDividerStyle,
  // closeAllContainerStyle,
  // closeAllTextStyle,
  // dividerInnerContainerStyle,
  // dividerOuterContainerStyle,
  // dividerStyle,
  menuContainerStyle,
  menuContentStyle,
  menuInnerContainerStyle, // tabAreaContainerStyle,
  teamSelectAndInviteButtonContainerStyle,
} from "./style"

// import { getProposedHeight } from "./utils"

const PCWorkspaceMenu: FC = () => {
  const { data, isSuccess } = useGetTeamsInfoQuery(null)
  // const { modal } = App.useApp()
  // const { t } = useTranslation()
  // const currentTeamInfo = useGetCurrentTeamInfo()
  // const [pinedAreaListHeight, setPinedAreaListHeight] = useState(0)
  // const pinedTipis = useSelector(getPinedTipis)

  // const hasPinedTipis = pinedTipis.length > 0

  // useEffect(() => {
  //   if (pinedTipis.length <= 3) {
  //     setPinedAreaListHeight(
  //       COMMON_MENU_PINED_AREA_SINGLE_MIN_HEIGHT * pinedTipis.length,
  //     )
  //   } else {
  //     setPinedAreaListHeight(
  //       (ILLAPublicStorage.getLocalStorage("pinedAreaListHeight") as
  //         | undefined
  //         | number) ?? COMMON_MENU_PINED_AREA_MIN_HEIGHT,
  //     )
  //   }
  // }, [pinedTipis.length])

  // const [draggingState, setDraggingState] = useState<"idle" | "dragging">(
  //   "idle",
  // )
  // const dividerRef = useRef<HTMLDivElement | null>(null)
  // const contentRef = useRef<HTMLDivElement | null>(null)
  // const tabAreaRef = useRef<HTMLDivElement | null>(null)

  // useEffect(() => {
  //   const divider = dividerRef.current
  //   const tabArea = tabAreaRef.current
  //   if (!divider || !contentRef) return

  //   return draggable({
  //     element: divider,
  //     canDrag: () => pinedTipis.length > 3,
  //     onGenerateDragPreview: ({ nativeSetDragImage }) => {
  //       // we will be moving the line to indicate a drag
  //       // we can disable the native drag preview
  //       disableNativeDragPreview({ nativeSetDragImage })
  //       // we don't want any native drop animation for when the user
  //       // does not drop on a drop target. we want the drag to finish immediately
  //       preventUnhandled.start()
  //     },
  //     onDragStart() {
  //       setDraggingState("dragging")
  //     },
  //     onDrag({ location }) {
  //       const tabAreaHeight = tabArea?.getBoundingClientRect().height ?? 0
  //       contentRef.current?.style.setProperty(
  //         "--local-resizing-height",
  //         `${getProposedHeight({ initialHeight: pinedAreaListHeight, location, tabAreaHeight, isMiniSize: false })}px`,
  //       )
  //     },
  //     onDrop({ location }) {
  //       preventUnhandled.stop()
  //       setDraggingState("idle")
  //       const tabAreaHeight = tabArea?.getBoundingClientRect().height ?? 0

  //       const finalHeight = getProposedHeight({
  //         initialHeight: pinedAreaListHeight,
  //         location,
  //         tabAreaHeight,
  //         isMiniSize: false,
  //       })

  //       setPinedAreaListHeight(finalHeight)
  //       ILLAPublicStorage.setLocalStorage("pinedAreaListHeight", finalHeight)
  //       contentRef.current?.style.removeProperty("--local-resizing-height")
  //     },
  //   })
  // }, [pinedAreaListHeight, pinedTipis.length])

  const hasTeamInfos = Array.isArray(data) && data.length > 0
  // const recentTabInfos = useSelector(getRecentTabInfos)
  // const closeAll = useRemoveAllRecentTabReducer()
  // const navigate = useNavigate()

  // const handleClickCloseAll = () => {
  //   const onOkModal = async () => {
  //     await closeAll()
  //     navigate(getChatPath(currentTeamInfo?.identify ?? ""))
  //   }
  //   modal.confirm({
  //     content: t("homepage.edit_tipi.modal.not_save_desc"),
  //     okText: t("homepage.edit_tipi.modal.not_save_ok"),
  //     cancelText: t("homepage.edit_tipi.modal.not_save_cancel"),
  //     onOk: onOkModal,
  //   })
  // }

  return (
    isSuccess && (
      <>
        <section css={menuContainerStyle}>
          <div css={menuInnerContainerStyle}>
            <div css={menuContentStyle}>
              <MenuHeader />
              {hasTeamInfos && (
                <div css={teamSelectAndInviteButtonContainerStyle}>
                  <TeamSelectAndInviteButton />
                </div>
              )}
              <FeatureArea />
              {/* <div
                css={tabAreaContainerStyle(draggingState === "dragging")}
                ref={tabAreaRef}
              >
                {hasPinedTipis && (
                  <PinedTipisArea
                    isMiniSize={false}
                    height={pinedAreaListHeight}
                    ref={contentRef}
                  />
                )}
                {hasTeamInfos && (
                  <>
                    <div css={dividerOuterContainerStyle}>
                      <div
                        css={dividerInnerContainerStyle(pinedTipis.length > 3)}
                        ref={dividerRef}
                      >
                        <div
                          css={[
                            dividerStyle,
                            draggingState === "dragging" && activeDividerStyle,
                          ]}
                          className="divider"
                        />
                      </div>
                      {recentTabInfos.length > 0 && (
                        <div
                          css={closeAllContainerStyle}
                          onClick={handleClickCloseAll}
                        >
                          <span css={closeAllTextStyle}>
                            {t("homepage.left_panel.tab.clear_all")}
                          </span>
                        </div>
                      )}
                    </div>
                    <PCRecentTabs isMiniSize={false} />
                  </>
                )}
              </div> */}
            </div>
            <MenuFooter />
          </div>
        </section>
      </>
    )
  )
}

export default PCWorkspaceMenu
