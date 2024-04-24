import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { DeleteIcon, PenIcon } from "@illa-public/icon"
import { IBaseFunctionForm } from "../../../../../interface"
import VariableModalContent from "../VariableContent"
import { IVariableItemProps } from "./interface"
import {
  buttonGroupStyle,
  buttonStyle,
  listItemContainerStyle,
  variableNameStyle,
} from "./style"

const VariableListItem: FC<IVariableItemProps> = (props) => {
  const { index, variableName } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  const [showEditModal, setShowEditModal] = useState(false)

  return (
    <div css={listItemContainerStyle}>
      <p css={variableNameStyle}>{variableName}</p>
      <div css={buttonGroupStyle}>
        <Button
          type="text"
          icon={<Icon component={PenIcon} />}
          size="small"
          css={buttonStyle}
        />
        <Controller
          control={control}
          name="config.variables"
          render={({ field }) => (
            <Button
              css={buttonStyle}
              size="small"
              type="text"
              icon={<Icon component={DeleteIcon} />}
              onClick={() => {
                const newVariables = field.value.filter(
                  (_, itemIndex) => itemIndex !== index,
                )
                field.onChange(newVariables)
              }}
            />
          )}
        />
      </div>
      <VariableModalContent
        index={index}
        open={showEditModal}
        openChange={setShowEditModal}
      />
    </div>
  )
}

export default VariableListItem
