import { FC } from "react"
import { Navigate } from "react-router-dom"
import { useGetAuthSessionQuery } from "@illa-public/user-data"
import { AUTH_PAGE_PATH } from "@/router/constants"
import { BaseProtectComponentProps } from "@/router/interface"

const AuthCheck: FC<BaseProtectComponentProps> = (props) => {
  const { data, isLoading, error, isSuccess } = useGetAuthSessionQuery(null)

  if (error) {
    return <Navigate to="/404" />
  }
  if (!isLoading && !data?.session) {
    return <Navigate to={AUTH_PAGE_PATH} />
  }

  return isSuccess ? props.children : null
}

export default AuthCheck
