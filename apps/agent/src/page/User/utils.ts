import { FieldErrors } from "react-hook-form"
import { LoginFields, RegisterFields } from "./interface"

export const getValidReportParamsFromLogin = (
  errors: FieldErrors<LoginFields>,
) => {
  const { email, password } = errors
  const errorList = []
  if (email && email.type === "required") {
    errorList.push("email_blank")
  } else if (email && (email.type === "validate" || email.type === "pattern")) {
    errorList.push("invalid_email")
  }

  if (password && password.type === "required") {
    errorList.push("password_blank")
  } else if (password && password.type === "minLength") {
    errorList.push("password_short")
  }

  return errorList
}

export const getValidReportParamsFromRegister = (
  errors: FieldErrors<RegisterFields>,
) => {
  const { nickname, verificationCode, email, password } = errors
  const errorList = []
  if (nickname) {
    if (nickname.type === "required") {
      errorList.push("username_blank")
    } else if (nickname.type === "minLength") {
      errorList.push("username_short")
    } else if (nickname.type === "maxLength") {
      errorList.push("username_long")
    }
  }
  if (verificationCode && verificationCode.type === "required") {
    errorList.push("verification_code_blank")
  }
  if (email && email.type === "required") {
    errorList.push("email_blank")
  } else if (email && (email.type === "validate" || email.type === "pattern")) {
    errorList.push("invalid_email")
  }

  if (password && password.type === "required") {
    errorList.push("password_blank")
  } else if (password && password.type === "minLength") {
    errorList.push("password_short")
  }

  return errorList
}
