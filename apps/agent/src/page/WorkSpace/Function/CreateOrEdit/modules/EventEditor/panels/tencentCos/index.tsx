import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  FUNCTION_ACTION_TYPE,
  IBaseFunction,
  TTencentCosFunctionContent,
} from "@illa-public/public-types"
import ActionTypeEditor from "./components/ActionTypeEditor"
import DelimiterEditor from "./components/DelimiterEditor"
import MaxKeysEditor from "./components/MaxKeysEditor"
import ObjectNameEditor from "./components/ObjectNameEditor"
import PrefixEditor from "./components/PrefixEditor"
// import VersionIDEditor from "./components/VersionIDEditor"
import { tencentCosContainerStyle } from "./style"

const TencentCosEventEditor: FC = () => {
  const { control } =
    useFormContext<IBaseFunction<TTencentCosFunctionContent>>()
  const actionType = useWatch({
    control,
    name: "content.actionType",
  })

  return (
    <div css={tencentCosContainerStyle}>
      <ActionTypeEditor />
      {actionType === FUNCTION_ACTION_TYPE.LIST && (
        <>
          <PrefixEditor />
          <DelimiterEditor />
          <MaxKeysEditor />
        </>
      )}
      {actionType === FUNCTION_ACTION_TYPE.GET_DOWNLOAD_URL && (
        <>
          <ObjectNameEditor />
          {/* <VersionIDEditor /> */}
        </>
      )}
    </div>
  )
}

export default TencentCosEventEditor
