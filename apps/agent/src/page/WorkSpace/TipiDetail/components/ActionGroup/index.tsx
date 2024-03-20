import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import {
  ForkIcon,
  PlayFillIcon,
  ShareIcon,
  StarOutlineIcon,
} from "@illa-public/icon"
import { IActionGroupProps } from "./interface"
import { actionGroupContainerStyle } from "./style"

const ActionGroup: FC<IActionGroupProps> = (props) => {
  const { isContribute, runNumber, forkNumber, starNumber } = props
  return (
    <div css={actionGroupContainerStyle}>
      <Button
        type="primary"
        block
        icon={<Icon component={PlayFillIcon} />}
        style={{ maxWidth: "307px" }}
      >
        Run {isContribute ? runNumber : ""}
      </Button>
      {isContribute && (
        <Button block icon={<Icon component={ForkIcon} />}>
          Fork {forkNumber}
        </Button>
      )}
      {isContribute && (
        <Button block icon={<Icon component={StarOutlineIcon} />}>
          Star {starNumber}
        </Button>
      )}
      {isContribute && (
        <Button block icon={<Icon component={ShareIcon} />}>
          Share
        </Button>
      )}
    </div>
  )
}

export default ActionGroup
