import { VARIABLE_TYPE } from "@illa-public/public-types"

export const CANT_ENUM_TYPE = [
  VARIABLE_TYPE.BOOLEAN,
  VARIABLE_TYPE.OBJECT,
  VARIABLE_TYPE.NULL,
  VARIABLE_TYPE.OBJECT_ARRAY,
]

export const VARIABLE_TYPE_OPTIONS = [
  {
    label: "Int",
    value: VARIABLE_TYPE.INT,
  },
  {
    label: "Float",
    value: VARIABLE_TYPE.FLOAT,
  },
  {
    label: "String",
    value: VARIABLE_TYPE.STRING,
  },
  {
    label: "Boolean",
    value: VARIABLE_TYPE.BOOLEAN,
  },
  {
    label: "Null",
    value: VARIABLE_TYPE.NULL,
  },
  {
    label: "Object",
    value: VARIABLE_TYPE.OBJECT,
  },
  {
    label: "String Array",
    value: VARIABLE_TYPE.STRING_ARRAY,
  },
  {
    label: "Int Array",
    value: VARIABLE_TYPE.INTEGER_ARRAY,
  },
  {
    label: "Float Array",
    value: VARIABLE_TYPE.NUMBER_ARRAY,
  },
  {
    label: "Boolean Array",
    value: VARIABLE_TYPE.BOOLEAN_ARRAY,
  },
  {
    label: "Null Array",
    value: VARIABLE_TYPE.NULL_ARRAY,
  },
  {
    label: "Object Array",
    value: VARIABLE_TYPE.OBJECT_ARRAY,
  },
]
