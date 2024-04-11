import { App, ConfigProvider, Divider } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useGetTeamsInfoQuery } from "@illa-public/user-data"
import FeatureArea from "@/Layout/Workspace/modules/FeatureArea"
import MenuFooter from "@/Layout/Workspace/modules/MenuFooter"
import RecentTabs from "@/Layout/Workspace/modules/RecentTabs"
import TeamSelectAndInviteButton from "@/Layout/Workspace/modules/TeamSelectAndInviteButton"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import { useRemoveAllRecentTabReducer } from "@/utils/recentTabs/baseHook"
import { getChatPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import MenuHeader from "../MenuHeader"
import {
  closeAllContainerStyle,
  closeAllTextStyle,
  dividerContainerStyle,
  menuContainerStyle,
  menuContentStyle,
  menuInnerContainerStyle,
  teamSelectAndInviteButtonContainerStyle,
} from "./style"

const PCWorkspaceMenu: FC = () => {
  const { data, isSuccess } = useGetTeamsInfoQuery(null)
  const { modal } = App.useApp()
  const { t } = useTranslation()
  const currentTeamInfo = useGetCurrentTeamInfo()

  const hasTeamInfos = Array.isArray(data) && data.length > 0
  const recentTabInfos = useSelector(getRecentTabInfos)
  const closeAll = useRemoveAllRecentTabReducer()
  const navigate = useNavigate()

  const handleClickCloseAll = () => {
    const onOkModal = async () => {
      await closeAll()
      navigate(getChatPath(currentTeamInfo?.identifier ?? ""))
    }
    modal.confirm({
      content: t("homepage.edit_tipi.modal.not_save_desc"),
      okText: t("homepage.edit_tipi.modal.not_save_ok"),
      cancelText: t("homepage.edit_tipi.modal.not_save_cancel"),
      onOk: onOkModal,
    })
  }

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
              {hasTeamInfos && (
                <>
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
                        orientation="right"
                        orientationMargin={0}
                      >
                        {recentTabInfos.length > 1 && (
                          <div
                            css={closeAllContainerStyle}
                            onClick={handleClickCloseAll}
                          >
                            <span css={closeAllTextStyle}>
                              {t("homepage.left_panel.tab.clear_all")}
                            </span>
                          </div>
                        )}
                      </Divider>
                    </ConfigProvider>
                  </div>
                  <RecentTabs isMiniSize={false} />
                </>
              )}
            </div>
            <MenuFooter />
          </div>
        </section>
      </>
    )
  )
}

export default PCWorkspaceMenu
