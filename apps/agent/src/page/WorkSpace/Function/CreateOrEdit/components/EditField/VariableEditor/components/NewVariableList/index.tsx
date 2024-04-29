import { FC } from "react"
import ActionColumn from "./components/ActionColumn"
import DescriptionColumn from "./components/DescriptionColumn"
import RequiredColumn from "./components/RequiredColumn"
import TypeColumn from "./components/TypeColumn"
import VariableAndAddColumn from "./components/VariableAndAddColumn"
import { variableListContainerStyle } from "./style"

const NewVariableList: FC = () => {
  return (
    <div css={variableListContainerStyle}>
      <VariableAndAddColumn />
      <DescriptionColumn />
      <RequiredColumn />
      <TypeColumn />
      <ActionColumn />
    </div>
  )
}

export default NewVariableList
