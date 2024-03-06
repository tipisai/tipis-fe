import { createBrowserRouter } from "react-router-dom"
import { buildRouter } from "./buildRouter"
import { ILLA_ROUTE_CONFIG } from "./config"

const ILLARoute = createBrowserRouter(buildRouter(ILLA_ROUTE_CONFIG), {
  basename: import.meta.env.ILLA_BASE_PATH ?? "/",
})
export default ILLARoute
