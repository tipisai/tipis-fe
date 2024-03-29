import { Steps } from "antd"
import { FC, useState } from "react"
import TextAlert from "../../../../components/TextAlert"
import ConfigureAPIPanel from "../../../ConfigureAPIPanel"
import VariablesPanel from "../../../VariablesPanel"
import { parametersListContainerStyle, stepsContainerStyle } from "./style"

const ParametersList: FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const stepItems = [
    {
      title: "Add variables",
      content: (
        <>
          <TextAlert content="To help the model better understand the parameters required for this function, please add variables and describe them. The added variables can be directly accessed when configuring the interface." />
          <VariablesPanel />
        </>
      ),
    },
    {
      title: "Configure API",
      content: (
        <>
          <TextAlert content="Configure your API. During the configuration process, you can use {{variable name}} to reference variables. When making a request to your API, we will replace the {{variable name}} region with the variable value generated by the model." />
          <ConfigureAPIPanel />
        </>
      ),
    },
  ]
  return (
    <div css={parametersListContainerStyle}>
      <div css={stepsContainerStyle}>
        <Steps
          current={currentStep}
          items={stepItems}
          onChange={setCurrentStep}
        />
      </div>
      {stepItems[currentStep].content}
    </div>
  )
}

export default ParametersList
