import { Suspense, lazy } from "react"
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom"
import { Page403, Page404, Page500 } from "@illa-public/status-page"
import { getILLACloudURL } from "@illa-public/utils"
import FullSectionLoading from "@/components/FullSectionLoading"
import PCWorkspaceLayout from "../Layout/Workspace/pc"
import UserLayout from "../page/User/Layout/index"
import { buildRouter } from "./buildRouter"
import { RoutesObjectPro } from "./interface"

const RunAgentPage = lazy(() => import("@/page/AI/AIAgentRun"))
const EditAgentPage = lazy(() => import("@/page/AI/AIAgent/editAgent"))
const CreateAgentPage = lazy(() => import("@/page/AI/AIAgent/createAgent"))
const LoginPage = lazy(() => import("@/page/User/Login"))
const RegisterPage = lazy(() => import("@/page/User/Register"))
const ForgotPasswordPage = lazy(() => import("@/page/User/ResetPassword"))
const OAuth = lazy(() => import("@/page/User/Oauth"))

const ILLA_ROUTE_CONFIG: RoutesObjectPro[] = [
  {
    index: true,
    loader: () => redirect(getILLACloudURL(window.customDomain)),
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
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "forgotPassword",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: "oauth",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <OAuth />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/workspace",
    element: <PCWorkspaceLayout />,
    needLogin: true,
    children: [
      {
        path: ":ownerTeamIdentifier/tipis/:agentID/run",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <RunAgentPage />
          </Suspense>
        ),
        accessByMobile: true,
      },
      {
        path: ":teamIdentifier/tipis",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <CreateAgentPage />
          </Suspense>
        ),
      },
      {
        path: ":teamIdentifier/tipis/:agentID",
        element: (
          <Suspense fallback={<FullSectionLoading />}>
            <EditAgentPage />
          </Suspense>
        ),
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
