import { Page403, Page404, Page500 } from "@illa-public/status-page"
import { getILLACloudURL } from "@illa-public/utils"
import { Suspense, lazy } from "react"
import { redirect } from "react-router-dom"
import FullSectionLoading from "@/components/FullSectionLoading"
import { RoutesObjectPro } from "./interface"

const RunAgentPage = lazy(() => import("@/page/AI/AIAgentRun"))
const EditAgentPage = lazy(() => import("@/page/AI/AIAgent/editAgent"))
const CreateAgentPage = lazy(() => import("@/page/AI/AIAgent/createAgent"))

export const ILLA_ROUTE_CONFIG: RoutesObjectPro[] = [
  {
    index: true,
    loader: () => redirect(getILLACloudURL(window.customDomain)),
  },
  {
    path: "/:ownerTeamIdentifier/ai-agent/:agentID/run",
    element: (
      <Suspense fallback={<FullSectionLoading />}>
        <RunAgentPage />
      </Suspense>
    ),
    needLogin: true,
    accessByMobile: true,
  },
  {
    path: "/:teamIdentifier/ai-agent",
    needLogin: true,
    element: (
      <Suspense fallback={<FullSectionLoading />}>
        <CreateAgentPage />
      </Suspense>
    ),
  },
  {
    path: "/:teamIdentifier/ai-agent/:agentID?",
    needLogin: true,
    element: (
      <Suspense fallback={<FullSectionLoading />}>
        <EditAgentPage />
      </Suspense>
    ),
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
