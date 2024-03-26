import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC } from "react"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { useCreateFunction } from "@/utils/recentTabs/hook"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const createFunction = useCreateFunction()

  return (
    <div css={headerToolsContainerStyle}>
      <Input
        placeholder="Search"
        prefix={<Icon component={SearchIcon} />}
        size="large"
      />
      <Button
        type="primary"
        icon={<Icon component={PlusIcon} />}
        size="large"
        onClick={createFunction}
      >
        Create
      </Button>
    </div>
  )
}

export default HeaderTools
