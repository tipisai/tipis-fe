import { FieldErrorsImpl } from "react-hook-form"

export enum ValidType {
  MAX_LENGTH = "maxLength",
  MIN_LENGTH = "minLength",
  REQUIRED = "required",
  PATTERN = "pattern",
}

export enum TransformValidType {
  USERNAME_BLANK = "username_blank",
  USERNAME_LONG = "username_long",
  USERNAME_SHORT = "username_short",
  CURRENT_PASSWORD_SHORT = "current_password_short",
  NEW_PASSWORD_SHORT = "new_password_short",
  CURRENT_PASSWORD_LONG = "current_password_long",
  NEW_PASSWORD_LONG = "new_password_long",
  CONFIRM_NOT_MATCH = "confirm_not_match",
  NAME_BLANK = "name_blank",
  IDENTIFY_BLANK = "identify_blank",
  IDENTIFY_ERROR_FORMAT = "identify_error_format",
}

export const getValidPasswordErr = (
  errorList: Partial<
    FieldErrorsImpl<{
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }>
  >,
) => {
  const { newPassword, currentPassword, confirmPassword } = errorList
  let validErrors = []
  if (newPassword) {
    if (newPassword.type === "minLength") {
      validErrors.push(TransformValidType.NEW_PASSWORD_SHORT)
    } else if (newPassword.type === "maxLength") {
      validErrors.push(TransformValidType.NEW_PASSWORD_LONG)
    }
  }

  if (currentPassword) {
    if (currentPassword.type === "minLength") {
      validErrors.push(TransformValidType.CURRENT_PASSWORD_SHORT)
    } else if (currentPassword.type === "maxLength") {
      validErrors.push(TransformValidType.CURRENT_PASSWORD_LONG)
    }
  }

  if (confirmPassword && confirmPassword.type === "validate") {
    validErrors.push(TransformValidType.CONFIRM_NOT_MATCH)
  }
  return validErrors
}

export const getValidUserNameError = (error: string | undefined): string[] => {
  let validErrors = []
  switch (error) {
    case ValidType.MAX_LENGTH: {
      validErrors.push(TransformValidType.USERNAME_LONG)
      break
    }
    case ValidType.MIN_LENGTH: {
      validErrors.push(TransformValidType.USERNAME_SHORT)
      break
    }
    case undefined:
    case ValidType.REQUIRED: {
      validErrors.push(TransformValidType.USERNAME_BLANK)
      break
    }
    default:
  }
  return validErrors
}

export const getValidTeamSettingError = (
  errorList: Partial<
    FieldErrorsImpl<{
      name: string
      identifier: string
      icon: string
    }>
  >,
): string[] => {
  const { name, identifier } = errorList
  let validErrors = []
  if (name && name.type === "required") {
    validErrors.push(TransformValidType.NAME_BLANK)
  }

  if (identifier) {
    if (identifier.type === "required") {
      validErrors.push(TransformValidType.IDENTIFY_BLANK)
    }
    if (identifier.type === "pattern") {
      validErrors.push(TransformValidType.IDENTIFY_ERROR_FORMAT)
    }
  }
  return validErrors
}
