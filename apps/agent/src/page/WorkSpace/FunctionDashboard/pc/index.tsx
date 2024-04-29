import { Modal, Tabs } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { IntegrationTypeSelector } from "@/Modules/Integration/IntegrationSelector"
import { useNavigateToCreateFunction } from "@/utils/routeHelper/hook"
import TeamCardList from "../components/TeamCardList"
import HeaderTools from "./components/HeaderTools"
import TeamCardListItem from "./components/TeamCardListItem"
import { FunctionDashboardContext } from "./context"
import {
  cardListContainerStyle,
  functionPCDashboardContainerStyle,
  tabsContainerStyle,
} from "./style"

const FunctionPCDashboard: FC = () => {
  const { t } = useTranslation()
  const navigateToCreateFunction = useNavigateToCreateFunction()
  const [canShowModal, setShowModal] = useState(false)
  return (
    <FunctionDashboardContext.Provider
      value={{
        isCreateFunctionModalOpen: canShowModal,
        changeCreateFunctionModal: setShowModal,
      }}
    >
      <div css={functionPCDashboardContainerStyle}>
        <WorkspacePCHeaderLayout
          title={t("homepage.function_dashboard.title.function_dashboard")}
          extra={<HeaderTools />}
        />
        <div css={tabsContainerStyle}>
          <Tabs
            items={[
              {
                label: t("homepage.function_dashboard.tab.team"),
                key: "team",
                children: (
                  <div css={cardListContainerStyle}>
                    <TeamCardList RenderItem={TeamCardListItem} />
                  </div>
                ),
              },
            ]}
            activeKey="team"
            style={{ height: "100%" }}
          />
        </div>
      </div>
      <Modal
        open={canShowModal}
        destroyOnClose
        width={1080}
        footer={false}
        title={t("editor.action.modal.title")}
        onCancel={() => {
          setShowModal(false)
        }}
      >
        <IntegrationTypeSelector onSelect={navigateToCreateFunction} />
      </Modal>
    </FunctionDashboardContext.Provider>
  )
}

export default FunctionPCDashboard
