import Icon from "@ant-design/icons"
import { Button, Image } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { DeleteIcon, DoubtIcon, PenIcon } from "@illa-public/icon"
import { IEditorFunctionItemProps } from "./interface"
import {
  deletedFunctionNameStyle,
  deletedIconStyle,
  functionItemContainerStyle,
  functionNameStyle,
} from "./style"

const EditorFunctionItem: FC<IEditorFunctionItemProps> = ({
  isDeleted,
  functionID,
  functionName,
  functionIcon,
  handleRemoveItem,
}) => {
  const { t } = useTranslation()
  const handleClickEdit = () => {
    console.log(functionID)
  }
  return isDeleted ? (
    <div css={functionItemContainerStyle}>
      <div css={deletedIconStyle}>
        <Icon component={DoubtIcon} />
      </div>
      <span css={deletedFunctionNameStyle}>
        {t("_This function has been deleted")}
      </span>
      <Button
        type="text"
        size="small"
        icon={<Icon component={DeleteIcon} />}
        onClick={() => handleRemoveItem(functionID)}
      />
    </div>
  ) : (
    <div css={functionItemContainerStyle}>
      <Image
        width={32}
        height={32}
        preview={false}
        src={functionIcon}
        style={{ borderRadius: 8 }}
      />
      <span css={functionNameStyle}>{functionName}</span>
      <Button
        type="text"
        size="small"
        icon={<Icon component={PenIcon} />}
        onClick={handleClickEdit}
      />
      <Button
        size="small"
        type="text"
        icon={<Icon component={DeleteIcon} />}
        onClick={() => handleRemoveItem(functionID)}
      />
    </div>
  )
}
export default EditorFunctionItem
