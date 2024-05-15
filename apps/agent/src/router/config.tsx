import { Suspense, lazy } from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { Page403, Page404, Page500 } from "@illa-public/status-page"
import AuthCheck from "@/components/Auth/AuthCheck"
import FullSectionLoading from "@/components/FullSectionLoading"
import SettingLayout from "@/page/SettingPage"
import WorkspaceLayout from "../Layout/Workspace"
import TeamAndLoginCheck from "../components/Auth/TeamAndLoginCheck"
import RootPage from "../page/RootPage"
import Empty from "../page/WorkSpace/Empty"
import { buildRouter } from "./buildRouter"
import {
  AUTH_PAGE_PATH,
  AUTH_REDIRECT_PATH,
  CHAT_TEMPLATE_PATH,
  CREATE_FUNCTION_TEMPLATE_PATH,
  CREATE_TIPI_TEMPLATE_PATH,
  EDIT_FUNCTION_TEMPLATE_PATH,
  EDIT_TIPI_TEMPLATE_PATH,
  EMPTY_TEAM_PATH,
  FUNCTIONS_DASHBOARD_TEMPLATE_PATH,
  MARKETPLACE_DETAIL_PATH,
  RUN_TIPI_TEMPLATE_PATH,
  SETTING_ACCOUNT_PATH,
  SETTING_BILLING_PATH,
  SETTING_LANGUAGE_PATH,
  SETTING_LINKED_PATH,
  SETTING_MEMBERS_PATH,
  SETTING_PATH,
  SETTING_TEAM_INFO_PATH,
  TEAM_IDENTIFIER_TEMPLATE_PATH,
  TIPIS_DASHBOARD_TEMPLATE_PATH,
  TIPI_DETAIL_TEMPLATE_PATH,
  WORKSPACE_LAYOUT_PATH,
} from "./constants"
import { RoutesObjectPro } from "./interface"
import { rootLoader } from "./loader/rootLoader"

/**
 *
 * @group Tipis page
 *
 */
const TipisDashboard = lazy(() => import("@/page/WorkSpace/TipisDashboard"))
const RunTipiPage = lazy(() => import("@/page/WorkSpace/AI/AIAgentRun"))
const EditTipiPage = lazy(() => import("@/page/WorkSpace/AI/AIAgent/editAgent"))
const CreateAgentPage = lazy(
  () => import("@/page/WorkSpace/AI/AIAgent/createAgent"),
)
const TipiDetailPage = lazy(
  () => import("@/page/WorkSpace/TipiDetail/TeamTipiDetail"),
)
const MarketTipiDetailPage = lazy(
  () => import("@/page/WorkSpace/TipiDetail/MarketTipiDetail"),
)

/**
 *
 * @group Auth page
 *
 */
const AuthPage = lazy(() => import("@/page/UserAuth/AuthPage"))
const AuthRedirect = lazy(() => import("@/page/UserAuth/AuthRedirect"))

/**
 *
 * @group Setting Account page
 *
 */
const PersonalSetting = lazy(
  () => import("@/page/SettingPage/account/personal"),
)
const LanguageSetting = lazy(
  () => import("@/page/SettingPage/account/language"),
)
const LinkedSettingPage = lazy(
  () => import("@/page/SettingPage/account/linked"),
)
const MobileSettingNavPage = lazy(
  () => import("@/page/SettingPage/mobileSettingNavPage"),
)

/**
 *
 * @group Setting Team Page
 *
 */
const TeamSetting = lazy(() => import("@/page/SettingPage/team/info"))
const TeamBilling = lazy(() => import("@/page/SettingPage/team/billing"))
const TeamMembers = lazy(() => import("@/page/SettingPage/team/member"))

/**
 *
 * @group Function Page
 *
 */
const FunctionDashboard = lazy(
  () => import("@/page/WorkSpace/FunctionDashboard"),
)
const EditFunctionPage = lazy(() => import("@/page/WorkSpace/Function/edit"))
const CreateFunctionPage = lazy(
  () => import("@/page/WorkSpace/Function/create"),
)

/**
 *
 * @group Chat Page
 *
 */
const ChatPage = lazy(() => import("@/page/WorkSpace/Chat"))

const SubScribeRedirect = lazy(
  () => import("@/page/SettingPage/subscribedRedirect"),
)

const ILLA_ROUTE_CONFIG: RoutesObjectPro[] = [
  {
    index: true,
    loader: rootLoader,
    element: <RootPage />,
    accessByMobile: true,
  },
  {
    path: AUTH_PAGE_PATH,
    accessByMobile: true,
    element: (
      <Suspense fallback={<FullSectionLoading />}>
        <AuthPage />
      </Suspense>
    ),
  },
  {
    path: AUTH_REDIRECT_PATH,
    accessByMobile: true,
    element: (
      <Suspense fallback={<FullSectionLoading />}>
        <AuthRedirect />
      </Suspense>
    ),
  },
  {
    path: EMPTY_TEAM_PATH,
    ProtectComponent: AuthCheck,
    accessByMobile: true,
    element: <WorkspaceLayout />,
    children: [
      {
        index: true,
        accessByMobile: true,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <Empty />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: WORKSPACE_LAYOUT_PATH,
    element: <WorkspaceLayout />,
    ProtectComponent: TeamAndLoginCheck,
    accessByMobile: true,
    children: [
      {
        path: TEAM_IDENTIFIER_TEMPLATE_PATH,
        accessByMobile: true,
        element: <Navigate to="chat/DEFAULT_CHAT" replace />,
      },
      {
        path: CHAT_TEMPLATE_PATH,
        accessByMobile: true,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <ChatPage />
          </Suspense>
        ),
      },
      {
        path: TIPIS_DASHBOARD_TEMPLATE_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <TipisDashboard />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: CREATE_TIPI_TEMPLATE_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <CreateAgentPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: EDIT_TIPI_TEMPLATE_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <EditTipiPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: TIPI_DETAIL_TEMPLATE_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <TipiDetailPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: MARKETPLACE_DETAIL_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <MarketTipiDetailPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: RUN_TIPI_TEMPLATE_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <RunTipiPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: FUNCTIONS_DASHBOARD_TEMPLATE_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <FunctionDashboard />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: CREATE_FUNCTION_TEMPLATE_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <CreateFunctionPage />
          </Suspense>
        ),
      },
      {
        path: EDIT_FUNCTION_TEMPLATE_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <EditFunctionPage />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: SETTING_PATH,
    accessByMobile: true,
    ProtectComponent: AuthCheck,
    element: <SettingLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <MobileSettingNavPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: SETTING_ACCOUNT_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <PersonalSetting />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: SETTING_LANGUAGE_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <LanguageSetting />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: SETTING_LINKED_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <LinkedSettingPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
    ],
  },

  {
    path: `${SETTING_PATH}/${TEAM_IDENTIFIER_TEMPLATE_PATH}`,
    accessByMobile: true,
    element: <SettingLayout />,
    ProtectComponent: TeamAndLoginCheck,
    children: [
      {
        path: SETTING_TEAM_INFO_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <TeamSetting />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: SETTING_MEMBERS_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <TeamMembers />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: SETTING_BILLING_PATH,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <TeamBilling />
          </Suspense>
        ),
        accessByMobile: true,
      },
    ],
  },
  {
    path: "/landing/subscribed",
    element: (
      <Suspense fallback={<FullSectionLoading />}>
        <SubScribeRedirect />
      </Suspense>
    ),
    accessByMobile: true,
  },
  {
    path: "/403",
    element: <Page403 />,
    accessByMobile: true,
  },
  {
    path: "/500",
    element: <Page500 />,
    accessByMobile: true,
  },
  {
    path: "/*",
    element: <Page404 />,
    accessByMobile: true,
  },
]

const ILLARoute = createBrowserRouter(buildRouter(ILLA_ROUTE_CONFIG))

export const ILLARouterProvider = () => {
  return <RouterProvider router={ILLARoute} />
}
