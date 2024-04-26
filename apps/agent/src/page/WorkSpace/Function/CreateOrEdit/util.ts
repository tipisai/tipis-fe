import { useFormContext, useWatch } from "react-hook-form"
import { DATA_VALUE_TYPE } from "@illa-public/code-editor-new"
import { ICompletionOption } from "@illa-public/code-editor-new/CodeMirror/extensions/interface"
import {
  IFunctionInterface,
  IVariables,
  VARIABLE_TYPE,
} from "@illa-public/public-types"

export const MOCK_DATA: IVariables[] = [
  {
    name: "user",
    description: "The user object containing user details.",
    type: VARIABLE_TYPE.OBJECT,
    isEnum: false,
    required: true,
    enum: [],
    children: [
      {
        name: "id",
        description: "The unique identifier for the user.",
        type: VARIABLE_TYPE.INT,
        isEnum: false,
        required: true,
        enum: [],
        children: [],
        testValue: "123",
      },
      {
        name: "name",
        description: "The name of the user.",
        type: VARIABLE_TYPE.STRING,
        isEnum: false,
        required: true,
        enum: [],
        children: [],
        testValue: "John Doe",
      },
      {
        name: "email",
        description: "The email address of the user.",
        type: VARIABLE_TYPE.STRING,
        isEnum: false,
        required: false,
        enum: [],
        children: [],
        testValue: "john.doe@example.com",
      },
      {
        name: "isVerified",
        description: "Flag to check if the user's email is verified.",
        type: VARIABLE_TYPE.BOOLEAN,
        isEnum: false,
        required: false,
        enum: [],
        children: [],
        testValue: "true",
      },
    ],
    testValue: "null",
  },
  {
    name: "settings",
    description: "User settings.",
    type: VARIABLE_TYPE.OBJECT,
    isEnum: false,
    required: false,
    enum: [],
    children: [
      {
        name: "theme",
        description: "The theme of the application for the user.",
        type: VARIABLE_TYPE.STRING,
        isEnum: true,
        required: false,
        enum: ["light", "dark"],
        children: [],
        testValue: "dark",
      },
      {
        name: "notifications",
        description: "Notification settings for the user.",
        type: VARIABLE_TYPE.BOOLEAN,
        isEnum: false,
        required: false,
        enum: [],
        children: [],
        testValue: "true",
      },
    ],
    testValue: "null",
  },
]

export type TTransResult = ICompletionOption & {
  depth: number
  originType: VARIABLE_TYPE
  required: boolean
  name: string
  parentKey: string
}

export function variableToCompletionOption(
  variable: IVariables,
): TTransResult[] {
  // Define the mapping from VARIABLE_TYPE to DATA_VALUE_TYPE
  const typeMapping: { [key in VARIABLE_TYPE]: DATA_VALUE_TYPE } = {
    [VARIABLE_TYPE.STRING]: DATA_VALUE_TYPE.STRING,
    [VARIABLE_TYPE.INT]: DATA_VALUE_TYPE.NUMBER,
    [VARIABLE_TYPE.FLOAT]: DATA_VALUE_TYPE.NUMBER,
    [VARIABLE_TYPE.BOOLEAN]: DATA_VALUE_TYPE.BOOLEAN,
    [VARIABLE_TYPE.NULL]: DATA_VALUE_TYPE.UNKNOWN,
    [VARIABLE_TYPE.OBJECT]: DATA_VALUE_TYPE.OBJECT,
    [VARIABLE_TYPE.STRING_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.INTEGER_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.NUMBER_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.BOOLEAN_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.NULL_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.OBJECT_ARRAY]: DATA_VALUE_TYPE.ARRAY,
  }

  // Recursive function to handle objects and their children
  function mapVariable(
    variable: IVariables,
    parentKey: string = "",
    depth: number = 0,
  ): TTransResult[] {
    const baseOption: TTransResult = {
      key: parentKey ? `${parentKey}.${variable.name}` : variable.name,
      name: variable.name,
      value: variable.testValue,
      description: variable.description,
      type: typeMapping[variable.type],
      originType: variable.type,
      required: variable.required,
      parentKey,
      depth,
    }

    let options: TTransResult[] = [baseOption]

    if (
      variable.type === VARIABLE_TYPE.OBJECT &&
      variable.children.length > 0
    ) {
      const childOptions = variable.children.flatMap((child) =>
        mapVariable(child, baseOption.key, depth + 1),
      )
      options = options.concat(childOptions)
    }

    return options
  }

  return mapVariable(variable)
}

export const useVariableToCompletionOption = () => {
  const { control } = useFormContext<IFunctionInterface>()

  const variables = useWatch({
    control,
    name: "parameters",
  })

  return variables.map((v) => variableToCompletionOption(v)).flat()
}
