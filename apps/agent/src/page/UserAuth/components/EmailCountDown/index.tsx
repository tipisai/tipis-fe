import { Statistic } from "antd"
import { FC } from "react"
import { IEmailCountDownProps } from "./interface"

const { Countdown } = Statistic

const EmailCountDown: FC<IEmailCountDownProps> = ({ onFinished }) => {
  return (
    <Countdown
      value={Date.now() + 1000 * 60}
      format="ss"
      valueStyle={{
        fontSize: 14,
      }}
      onFinish={onFinished}
    />
  )
}

export default EmailCountDown
