import { Steps } from "antd"
import { FC, useState } from "react"
import ParameterEditor from "./components/ParameterEditor"
import TextAlert from "./components/TextAlert"
import { parametersListContainerStyle, stepsContainerStyle } from "./style"

const ParametersList: FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const stepItems = [
    {
      title: "Add variables",
      content: (
        <>
          <TextAlert content="To help the model better understand the parameters required for this function, please add variables and describe them. The added variables can be directly accessed when configuring the interface." />
          <ParameterEditor />
        </>
      ),
    },
    {
      title: "Configure API",
      content: "Configure API",
    },
  ]
  return (
    <div css={parametersListContainerStyle}>
      <div css={stepsContainerStyle}>
        <Steps current={currentStep} items={stepItems} />
      </div>
      {stepItems[currentStep].content}
    </div>
  )
}

export default ParametersList
