import { Button } from "antd"
import { FC } from "react"
import { publishButtonStyle } from "./style"

const PublishButton: FC = () => {
  return (
    <Button
      type="primary"
      htmlType="submit"
      size="large"
      css={publishButtonStyle}
    >
      Publish
    </Button>
  )
}

export default PublishButton
