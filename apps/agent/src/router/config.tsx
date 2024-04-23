import { Suspense, lazy } from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { Page403, Page404, Page500 } from "@illa-public/status-page"
import FullSectionLoading from "@/components/FullSectionLoading"
import SettingLayout from "@/page/SettingPage"
import WorkspaceLayout from "../Layout/Workspace"
import LoginAuth from "../components/Auth/LoginAuth"
import TeamAndLoginCheck from "../components/Auth/TeamAndLoginCheck"
import RootPage from "../page/RootPage"
import UserLayout from "../page/User/Layout/index"
import Empty from "../page/WorkSpace/Empty"
import { buildRouter } from "./buildRouter"
import {
  CHAT_TEMPLATE_PATH,
  CREATE_FUNCTION_TEMPLATE_PATH,
  CREATE_TIPI_TEMPLATE_PATH,
  EDIT_FUNCTION_TEMPLATE_PATH,
  EDIT_TIPI_TEMPLATE_PATH,
  MARKETPLACE_DETAIL_PATH,
  FUNCTIONS_DASHBOARD_TEMPLATE_PATH,
  RUN_TIPI_TEMPLATE_PATH,
  TEAM_IDENTIFIER_TEMPLATE_PATH,
  TIPIS_DASHBOARD_TEMPLATE_PATH,
  TIPI_DETAIL_TEMPLATE_PATH,
  WORKSPACE_LAYOUT_PATH,
} from "./constants"
import { RoutesObjectPro } from "./interface"
import { rootLoader } from "./loader/rootLoader"

const RunAgentPage = lazy(() => import("@/page/WorkSpace/AI/AIAgentRun"))
const EditAgentPage = lazy(
  () => import("@/page/WorkSpace/AI/AIAgent/editAgent"),
)
const CreateAgentPage = lazy(
  () => import("@/page/WorkSpace/AI/AIAgent/createAgent"),
)
const TipisDashboard = lazy(() => import("@/page/WorkSpace/TipisDashboard"))
const FunctionDashboard = lazy(
  () => import("@/page/WorkSpace/FunctionDashboard/pc"),
)
const LoginPage = lazy(() => import("@/page/User/Login"))
const RegisterPage = lazy(() => import("@/page/User/Register"))
const ForgotPasswordPage = lazy(() => import("@/page/User/ResetPassword"))
const OAuth = lazy(() => import("@/page/User/Oauth"))
const PersonalSetting = lazy(
  () => import("@/page/SettingPage/account/personal"),
)
const LanguageSetting = lazy(
  () => import("@/page/SettingPage/account/language"),
)
const PasswordSettingPage = lazy(
  () => import("@/page/SettingPage/account/password"),
)
const LinkedSettingPage = lazy(
  () => import("@/page/SettingPage/account/linked"),
)
const MobileSettingNavPage = lazy(
  () => import("@/page/SettingPage/mobileSettingNavPage"),
)
const TeamSetting = lazy(() => import("@/page/SettingPage/team/info"))
const TeamBilling = lazy(() => import("@/page/SettingPage/team/billing"))
const TeamMembers = lazy(() => import("@/page/SettingPage/team/member"))
const EditFunctionPage = lazy(
  () => import("@/page/WorkSpace/Function/CreateOrEdit/edit"),
)
const CreateFunctionPage = lazy(
  () => import("@/page/WorkSpace/Function/CreateOrEdit/create"),
)

const ChatPage = lazy(() => import("@/page/WorkSpace/Chat"))
const TipiDetailPage = lazy(
  () => import("@/page/WorkSpace/TipiDetail/TeamTipiDetail"),
)
const MarketTipiDetailPage = lazy(
  () => import("@/page/WorkSpace/TipiDetail/MarketTipiDetail"),
)

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
    path: "/user",
    element: <UserLayout />,
    accessByMobile: true,
    children: [
      {
        index: true,
        accessByMobile: true,
        element: <Navigate to="./login" replace />,
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <LoginPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <RegisterPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: "forgotPassword",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: "oauth",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <OAuth />
          </Suspense>
        ),
        accessByMobile: true,
      },
    ],
  },
  {
    path: "/empty-workspace",
    ProtectComponent: LoginAuth,
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
            <EditAgentPage />
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
            <RunAgentPage />
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
    path: "/setting",
    accessByMobile: true,
    ProtectComponent: LoginAuth,
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
        path: "account",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <PersonalSetting />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: "language",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <LanguageSetting />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: "password",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <PasswordSettingPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: "linked",
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
    path: "/setting/:teamIdentifier",
    accessByMobile: true,
    element: <SettingLayout />,
    ProtectComponent: TeamAndLoginCheck,
    children: [
      {
        path: "team-settings",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <TeamSetting />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: "members",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <TeamMembers />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: "billing",
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
