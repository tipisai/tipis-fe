import { Suspense, lazy } from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { Page403, Page404, Page500 } from "@illa-public/status-page"
import FullSectionLoading from "@/components/FullSectionLoading"
import SettingLayout from "@/page/SettingPage"
import { MobileWorkspaceLayout } from "../Layout/Workspace/mobile"
import PCWorkspaceLayout from "../Layout/Workspace/pc"
import SettingProtectedComponent from "../components/SettingProtectedComponent"
import UserLayout from "../page/User/Layout/index"
import { buildRouter } from "./buildRouter"
import { RoutesObjectPro } from "./interface"
import { rootLoader } from "./loader/rootLoader"
import { workspaceLayoutLoader } from "./loader/workspaceLayoutLoader"

const RunAgentPage = lazy(() => import("@/page/WorkSpace/AI/AIAgentRun"))
const EditAgentPage = lazy(
  () => import("@/page/WorkSpace/AI/AIAgent/editAgent"),
)
const CreateAgentPage = lazy(
  () => import("@/page/WorkSpace/AI/AIAgent/createAgent"),
)
const TipisDashboard = lazy(() => import("@/page/WorkSpace/TipisDashboard/pc"))
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
const EditFunctionPage = lazy(() => import("@/page/WorkSpace/Function/Edit"))
const ChatPage = lazy(() => import("@/page/WorkSpace/Chat"))
const TipiDetailPage = lazy(() => import("@/page/WorkSpace/TipiDetail"))

const ILLA_ROUTE_CONFIG: RoutesObjectPro[] = [
  {
    index: true,
    loader: rootLoader,
  },
  {
    path: "/user",
    element: <UserLayout />,
    accessByMobile: true,
    children: [
      {
        index: true,
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
    path: "/workspace",
    element: (
      <LayoutAutoChange
        desktopPage={<PCWorkspaceLayout />}
        mobilePage={<MobileWorkspaceLayout />}
      />
    ),
    needLogin: true,
    loader: workspaceLayoutLoader,
    accessByMobile: true,
    children: [
      {
        path: ":teamIdentifier",
        accessByMobile: true,
        element: <Navigate to="chat/DEFAULT_CHAT" replace />,
      },
      {
        path: ":teamIdentifier/chat/:chatID",
        needLogin: true,
        accessByMobile: true,
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <ChatPage />
          </Suspense>
        ),
      },
      {
        path: ":teamIdentifier/tipis",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <TipisDashboard />
          </Suspense>
        ),
      },
      {
        path: ":teamIdentifier/tipi/:agentID/create",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <CreateAgentPage />
          </Suspense>
        ),
      },
      {
        path: ":teamIdentifier/tipi/:agentID/edit",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <EditAgentPage />
          </Suspense>
        ),
      },
      {
        path: ":teamIdentifier/tipi/:agentID/detail",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <TipiDetailPage />
          </Suspense>
        ),
      },
      {
        path: ":teamIdentifier/tipi/:agentID/run/:tabID?",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <RunAgentPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: ":teamIdentifier/functions",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <FunctionDashboard />
          </Suspense>
        ),
      },
      {
        path: ":teamIdentifier/function/:functionID/create",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <EditFunctionPage />
          </Suspense>
        ),
      },
      {
        path: ":teamIdentifier/function/:functionID/edit",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <FunctionDashboard />
          </Suspense>
        ),
      },
      {
        path: ":teamIdentifier/function/:functionID/detail",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <FunctionDashboard />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/setting",
    accessByMobile: true,
    element: (
      <SettingProtectedComponent>
        <SettingLayout />
      </SettingProtectedComponent>
    ),
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
    needLogin: true,
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

const ILLARoute = createBrowserRouter(buildRouter(ILLA_ROUTE_CONFIG), {
  basename: import.meta.env.ILLA_BASE_PATH ?? "/",
})

export const ILLARouterProvider = () => {
  return <RouterProvider router={ILLARoute} />
}
