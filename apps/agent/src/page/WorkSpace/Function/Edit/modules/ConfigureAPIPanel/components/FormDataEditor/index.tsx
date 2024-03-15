// import { Select } from "antd"
// import { FC } from "react"
// import { useTranslation } from "react-i18next"
// import { Params } from "@illa-public/record-editor"
// import { CodeEditor } from "@/components/CodeEditor"
// import { CODE_LANG } from "@/components/CodeEditor/CodeMirror/extensions/interface"
// import {
//   formDataEditorContainerStyle,
//   keyEditorStyle,
//   valueEditorStyle,
// } from "./style"

// const FormDataEditor: FC<IFormDataEditorProps> = (props) => {
//   const { t } = useTranslation()
//   const {
//     flowActionID,
//     actionContent,
//     handleUpdateActionContent,
//     calcContext,
//   } = props

//   const handleUpdateFormDataValue = (
//     index: number,
//     value: string,
//     key: string,
//   ) => {
//     const newBody = [...(actionContent.body as Params[])]
//     newBody[index] = {
//       ...newBody[index],
//       [key]: value,
//     }
//     handleUpdateActionContent({ body: newBody }, flowActionID)
//   }

//   return (actionContent.body as Params[]).map((param, index) => {
//     return (
//       <div key={index} css={formDataEditorContainerStyle}>
//         <CodeEditor
//           value={param.key}
//           singleLine
//           height="32px"
//           onChange={(val) => handleUpdateFormDataValue(index, val, "key")}
//           lang={CODE_LANG.JAVASCRIPT}
//           placeholder="key"
//           wrapperCss={keyEditorStyle}
//           completionOptions={calcContext}
//         />
//         <Select
//           showSearch={true}
//           defaultValue={param.type}
//           value={param.type}
//           onChange={(val) =>
//             handleUpdateFormDataValue(index, val as string, "type")
//           }
//           options={[
//             {
//               label: t(
//                 "editor.action.panel.label.option.restapi.body_type.text",
//               ),
//               value: "text",
//             },
//             {
//               label: t(
//                 "editor.action.panel.label.option.restapi.body_type.file",
//               ),
//               value: "file",
//             },
//           ]}
//         />
//         <CodeEditor
//           singleLine
//           value={param.value}
//           wrapperCss={valueEditorStyle}
//           height="32px"
//           lang={CODE_LANG.JAVASCRIPT}
//           placeholder={
//             param.type === "file"
//               ? t("editor.action.panel.placeholder.restapi.body_type.file")
//               : "value"
//           }
//           completionOptions={calcContext}
//           onChange={(val) => handleUpdateFormDataValue(index, val, "value")}
//         />
//       </div>
//     )
//   })
// }

// FormDataEditor.displayName = "FormDataEditor"

// export default FormDataEditor
