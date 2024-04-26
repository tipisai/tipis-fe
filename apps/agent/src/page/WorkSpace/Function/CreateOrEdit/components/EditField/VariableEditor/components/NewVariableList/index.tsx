import { FC } from "react"
import { VARIABLE_TYPE } from "@illa-public/public-types"
import ActionColumn from "./components/ActionColumn"
import DescriptionColumn from "./components/DescriptionColumn"
import RequiredColumn from "./components/RequiredColumn"
import TypeColumn from "./components/TypeColumn"
import { variableListContainerStyle } from "./style"

const NewVariableList: FC = () => {
  return (
    <div css={variableListContainerStyle}>
      <div></div>
      <DescriptionColumn descriptions={["dddd", "fffff"]} />
      <RequiredColumn requireds={[true, false]} />
      <TypeColumn types={[VARIABLE_TYPE.BOOLEAN, VARIABLE_TYPE.FLOAT]} />
      <ActionColumn descriptions={["dddd", "fffff"]} />
      <div></div>
    </div>
  )
}

export default NewVariableList
