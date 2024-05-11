import { FC, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import InputPage from "./components/InputPage"
import ResendPage from "./components/ResendPage"
import { AUTH_STEP, IEmailForm } from "./interface"
import { containerStyle } from "./style"

const AuthPage: FC = () => {
  const [authStep, setAuthStep] = useState<AUTH_STEP>(AUTH_STEP.INPUT_PAGE)
  const formProps = useForm<IEmailForm>()
  return (
    <FormProvider {...formProps}>
      <div css={containerStyle}>
        {authStep === AUTH_STEP.INPUT_PAGE ? (
          <InputPage setAuthStep={setAuthStep} />
        ) : (
          <ResendPage setAuthStep={setAuthStep} />
        )}
      </div>
    </FormProvider>
  )
}

export default AuthPage
