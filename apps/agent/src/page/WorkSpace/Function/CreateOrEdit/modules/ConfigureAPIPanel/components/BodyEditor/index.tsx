// import { Select } from "antd"
// import { FC } from "react"
// import { Controller, useFormContext, useWatch } from "react-hook-form"
// import { useTranslation } from "react-i18next"
// import { RestAPIRawBodyInitial } from "@illa-public/public-configs"
// import {
//   IAIFunctionRawBody,
//   IAIFunctionResource,
//   RestAPIBodyType,
//   RestAPIRawBody,
//   RestAPIRawBodyType,
// } from "@illa-public/public-types"
// import { Params } from "@illa-public/record-editor"
// import ColumnLayoutContainer from "@/Layout/AIFunction/FormLayoutContainer/columnLayoutContainer"
// import { CodeEditor } from "@/components/CodeEditor"
// import { CODE_LANG } from "@/components/CodeEditor/CodeMirror/extensions/interface"
// import { RecordEditor } from "@/components/CodeMirrorRecordEditor"
// import FormDataEditor from "../FormDataEditor"
// import { bodySelectorStyle } from "./style"

// const RestAPIBodyEditor: FC = () => {
//   const { control } = useFormContext<IAIFunctionResource<IAIFunctionRawBody>>()
//   const { t } = useTranslation()
//   const [bodyType, body] = useWatch({
//     control,
//     name: ["content.bodyType", "content.body"],
//   })

//   let mode: CODE_LANG = CODE_LANG.JAVASCRIPT
//   if (bodyType === "raw") {
//     switch ((body as RestAPIRawBody).type) {
//       case "text":
//         mode = CODE_LANG.JAVASCRIPT
//         break
//       case "json":
//         mode = CODE_LANG.JSON
//         break
//       case "xml":
//         mode = CODE_LANG.XML
//         break
//       case "javascript":
//         mode = CODE_LANG.JAVASCRIPT
//         break
//       case "html":
//         mode = CODE_LANG.HTML
//         break
//     }
//   }

//   const handleActionTypeChange = (value: string) => {
//     let newBody = null
//     switch (value) {
//       case "none":
//         newBody = null
//         break
//       case "x-www-form-urlencoded":
//         newBody = [{ key: "", value: "" }] as Params[]
//         break
//       case "form-data":
//         newBody = [{ key: "", type: "", value: "" }] as Params[]
//         break
//       case "raw":
//         newBody = RestAPIRawBodyInitial
//         break
//       case "binary":
//         newBody = ""
//         break
//     }
//     handleUpdateActionContent(
//       {
//         bodyType: value as RestAPIBodyType,
//         body: newBody,
//       },
//       flowActionID,
//     )
//   }

//   return (
//     <>
//       <ColumnLayoutContainer
//         labelName={t("editor.action.resource.restapi.label.body")}
//       >
//         <div css={bodySelectorStyle}>
//           <Controller
//             control={control}
//             name="content.bodyType"
//             render={(field) => (
//               <Select
//                 {...field}
//                 options={[
//                   {
//                     label: "none",
//                     value: "none",
//                   },
//                   {
//                     label: "form-data",
//                     value: "form-data",
//                   },
//                   {
//                     label: "x-www-form-urlencoded",
//                     value: "x-www-form-urlencoded",
//                   },
//                   {
//                     label: "raw",
//                     value: "raw",
//                   },
//                   {
//                     label: "binary",
//                     value: "binary",
//                   },
//                 ]}
//                 // onChange={(v) => handleActionTypeChange(v as string)}
//               />
//             )}
//           />

//           {bodyType === "raw" && (
//             <Controller
//               control={control}
//               name="content.body.type"
//               render={(field) => (
//                 <Select
//                   {...field}
//                   options={[
//                     {
//                       label: "text",
//                       value: "text",
//                     },
//                     {
//                       label: "json",
//                       value: "json",
//                     },
//                     {
//                       label: "xml",
//                       value: "xml",
//                     },
//                     {
//                       label: "javascript",
//                       value: "javascript",
//                     },
//                     {
//                       label: "html",
//                       value: "html",
//                     },
//                   ]}
//                   // onChange={(value) => {
//                   //   handleUpdateActionContent(
//                   //     {
//                   //       body: {
//                   //         ...(actionContent.body as RestAPIRawBody),
//                   //         type: value as RestAPIRawBodyType,
//                   //       },
//                   //     },
//                   //     flowActionID,
//                   //   )
//                   // }}
//                 />
//               )}
//             />
//           )}
//         </div>
//       </ColumnLayoutContainer>
//       {bodyType === "form-data" && (
//         <ColumnLayoutContainer>
//           <FormDataEditor
//             flowActionID={flowActionID}
//             actionContent={actionContent}
//             calcContext={calcContext}
//             handleUpdateActionContent={handleUpdateActionContent}
//           />
//         </ColumnLayoutContainer>
//       )}

//       {bodyType === "x-www-form-urlencoded" && (
//         <ColumnLayoutContainer>
//           <RecordEditor
//             completionOptions={calcContext}
//             records={actionContent.body as Params[]}
//             onAdd={() => {
//               handleUpdateActionContent(
//                 {
//                   body: (actionContent.body as Params[]).concat({
//                     key: "",
//                     value: "",
//                   }),
//                 },
//                 flowActionID,
//               )
//             }}
//             onChangeKey={(index, key) => {
//               const newBody = [...(actionContent.body as Params[])]
//               newBody[index] = {
//                 ...newBody[index],
//                 key: key,
//               }
//               handleUpdateActionContent(
//                 {
//                   body: newBody,
//                 },
//                 flowActionID,
//               )
//             }}
//             onChangeValue={(index, _, value) => {
//               const newBody = [...(actionContent.body as Params[])]
//               newBody[index] = {
//                 ...newBody[index],
//                 value: value,
//               }
//               handleUpdateActionContent(
//                 {
//                   body: newBody,
//                 },
//                 flowActionID,
//               )
//             }}
//             onDelete={(index) => {
//               const newBody = [...(actionContent.body as Params[])].filter(
//                 (_, i) => i !== index,
//               )

//               handleUpdateActionContent(
//                 {
//                   body: newBody,
//                 },
//                 flowActionID,
//               )
//             }}
//             label={""}
//           />
//         </ColumnLayoutContainer>
//       )}

//       {(bodyType === "binary" || bodyType === "raw") && (
//         <ColumnLayoutContainer>
//           <CodeEditor
//             completionOptions={calcContext}
//             lang={mode}
//             showLineNumbers
//             height="88px"
//             maxHeight="88px"
//             value={
//               bodyType === "raw"
//                 ? (body as RestAPIRawBody).content
//                 : (body as string)
//             }
//             onChange={(value) => {
//               if (bodyType === "raw") {
//                 handleUpdateActionContent(
//                   {
//                     body: {
//                       ...(actionContent.body as RestAPIRawBody),
//                       content: value,
//                     },
//                   },
//                   flowActionID,
//                 )
//               } else {
//                 handleUpdateActionContent({ body: value }, flowActionID)
//               }
//             }}
//             canExpand
//           />
//         </ColumnLayoutContainer>
//       )}
//     </>
//   )
// }

// RestAPIBodyEditor.displayName = "RestAPIBodyEditor"

// export default RestAPIBodyEditor
