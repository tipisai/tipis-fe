export const WORKSPACE_LAYOUT_PATH = `/workspace`

export const TEAM_IDENTIFIER_TEMPLATE_PATH = `:teamIdentifier`

export const CHAT_TEMPLATE_PATH = `${TEAM_IDENTIFIER_TEMPLATE_PATH}/chat/:chatID`

export const TIPIS_DASHBOARD_TEMPLATE_PATH = `${TEAM_IDENTIFIER_TEMPLATE_PATH}/tipis`
export const TEAM_TIPI_TEMPLATE_PATH = `${TEAM_IDENTIFIER_TEMPLATE_PATH}/tipi`
export const CREATE_TIPI_TEMPLATE_PATH = `${TEAM_TIPI_TEMPLATE_PATH}/create`
export const EDIT_TIPI_TEMPLATE_PATH = `${TEAM_TIPI_TEMPLATE_PATH}/:agentID/edit`
export const RUN_TIPI_TEMPLATE_PATH = `${TEAM_TIPI_TEMPLATE_PATH}/:agentID/run/:tabID`
export const TIPI_DETAIL_TEMPLATE_PATH = `${TEAM_TIPI_TEMPLATE_PATH}/:agentID/detail`
export const MARKETPLACE_DETAIL_PATH = `${TEAM_IDENTIFIER_TEMPLATE_PATH}/marketTipi/:agentID/detail`

export const TEAM_FUNCTION_TEMPLATE_PATH = `${TEAM_IDENTIFIER_TEMPLATE_PATH}/function`
export const FUNCTIONS_DASHBOARD_TEMPLATE_PATH = `${TEAM_IDENTIFIER_TEMPLATE_PATH}/functions`
export const EDIT_FUNCTION_TEMPLATE_PATH = `${TEAM_FUNCTION_TEMPLATE_PATH}/:functionID/edit`
export const CREATE_FUNCTION_TEMPLATE_PATH = `${TEAM_FUNCTION_TEMPLATE_PATH}/create/:functionType`

export const AUTH_PAGE_PATH = "/auth"
export const AUTH_REDIRECT_PATH = "/authRedirect"
export const EMPTY_TEAM_PATH = "/empty-workspace"
export const SETTING_PATH = "/setting"
export const SETTING_ACCOUNT_PATH = "account"
export const SETTING_LANGUAGE_PATH = "language"
export const SETTING_PASSWORD_PATH = "password"
export const SETTING_LINKED_PATH = "linked"
export const SETTING_TEAM_INFO_PATH = "team-settings"
export const SETTING_MEMBERS_PATH = "members"
export const SETTING_BILLING_PATH = "billing"
