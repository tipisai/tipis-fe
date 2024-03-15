import { FC } from "react"
import ActionTypeSelect from "./components/ActionTypeSelect"
import CookiesInput from "./components/Cookies"
import HeadersInput from "./components/HeadersInput"
import URLInput from "./components/URLInput"
import URLParametersInput from "./components/URLParametersInput"
import { configureAPIPanelContainerStyle } from "./style"

const ConfigureAPIPanel: FC = () => {
  return (
    <div css={configureAPIPanelContainerStyle}>
      <ActionTypeSelect />
      <URLInput />
      <URLParametersInput />
      <HeadersInput />
      <CookiesInput />
      {/* {!["GET", "HEAD"].includes(actionContent.method) && (
        <RestAPIBodyEditor
          flowActionID={flowActionID}
          actionContent={actionContent}
          calcContext={calcContext}
          handleUpdateActionContent={handleUpdateActionContent}
        />
      )} */}
    </div>
  )
}

export default ConfigureAPIPanel
