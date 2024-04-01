import { FieldErrors } from "react-hook-form"
import {
  TIPIS_PAGE_NAME,
  TIPIS_TRACK_PUBLIC_PAGE_NAME,
} from "@illa-public/track-utils"
import { IAllFormFields } from "./interface"

export const getValidReportParams = (
  page: TIPIS_PAGE_NAME,
  isValid: boolean,
  errors: FieldErrors<IAllFormFields>,
) => {
  if (isValid) {
    return {
      parameter2: "suc",
    }
  }
  const { email, password, nickname, verificationCode, newPassword } = errors
  const errorList = []
  if (page === TIPIS_TRACK_PUBLIC_PAGE_NAME.SIGNUP) {
    if (nickname) {
      if (nickname.type === "required") {
        errorList.push("username_blank")
      } else if (nickname.type === "minLength") {
        errorList.push("username_short")
      } else if (nickname.type === "maxLength") {
        errorList.push("username_long")
      }
    }
  }

  if (
    page === TIPIS_TRACK_PUBLIC_PAGE_NAME.SIGNUP ||
    page === TIPIS_TRACK_PUBLIC_PAGE_NAME.FORGET_PASSWORD
  ) {
    if (verificationCode && verificationCode.type === "required") {
      errorList.push("verification_code_blank")
    }
  }
  if (email && email.type === "required") {
    errorList.push("email_blank")
  } else if (email && (email.type === "validate" || email.type === "pattern")) {
    errorList.push("invalid_email")
  }

  if (
    (password && password.type === "required") ||
    (newPassword && newPassword.type === "required")
  ) {
    errorList.push("password_blank")
  } else if (
    (password && password.type === "minLength") ||
    (newPassword && newPassword.type === "minLength")
  ) {
    errorList.push("password_short")
  }

  if (!isValid) {
    return {
      parameter2: "failed",
      parameter3: errorList,
    }
  }
}
