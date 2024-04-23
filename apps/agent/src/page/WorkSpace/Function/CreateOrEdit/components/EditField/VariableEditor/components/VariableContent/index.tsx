import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { IBaseFunctionForm } from "../../../../../interface"
import DescriptionEditor from "../DescriptionEditor"
import EnumOptionsEditor from "../EnumOptionsEditor"
import IsEnumEditor from "../IsEnumEditor"
import NameEditor from "../NameEditor"
import RequiredEditor from "../RequiredEditor"
import TestValueEditor from "../TestValueEditor"
import TypeEditor from "../TypeEditor"
import { IVariableContentProps } from "./interface"
import { variableContentStyle } from "./style"

const VariableContent: FC<IVariableContentProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  const [isEnum] = useWatch({
    control,
    name: [`config.variables.${index}.isEnum`],
  })

  return (
    <div css={variableContentStyle}>
      <NameEditor index={index} />
      <DescriptionEditor index={index} />
      <RequiredEditor index={index} />
      <TypeEditor index={index} />
      <IsEnumEditor index={index} />
      {isEnum && <EnumOptionsEditor index={index} />}
      <TestValueEditor index={index} />
    </div>
  )
}

export default VariableContent
