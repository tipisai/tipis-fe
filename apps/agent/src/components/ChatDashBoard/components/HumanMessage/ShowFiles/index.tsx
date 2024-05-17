// import Icon from "@ant-design/icons"
// import { Button, Tooltip } from "antd"
// import { FC, useRef, useState } from "react"
// import { DownloadIcon } from "@illa-public/icon"
// import { IMessageFileVO } from "@/components/ChatDashBoard/interface"
// import { handleDownloadFiles } from "@/utils/drive/download"
// import FileContent from "../FileContent"
// import { containerStyle, fileContainerStyle } from "./style"

// interface ShowFilesProps {
//   fileList: IMessageFileVO[]
// }

// const SingleFile: FC<
//   Pick<IMessageFileVO, "download_url" | "file_name" | "content_type">
// > = ({ download_url, file_name, content_type }) => {
//   const [isExpired, setIsExpired] = useState(false)
//   const [disabled, setDisabled] = useState(false)
//   const containerRef = useRef<HTMLDivElement>(null)
//   const handleDownload = (file_name: string, download_url: string) => {
//     if (!download_url || !file_name) {
//       return
//     }
//     const fileInfo = {
//       name: file_name,
//       download_url: download_url,
//     }
//     setDisabled(true)
//     handleDownloadFiles([fileInfo])
//       .catch(() => {
//         setIsExpired(true)
//       })
//       .finally(() => {
//         setDisabled(false)
//       })
//   }

//   return isExpired ? (
//     <FileContent content_type={content_type} file_name={file_name} isExpired />
//   ) : (
//     <Tooltip
//       key={file_name}
//       color="transparent"
//       overlayInnerStyle={{
//         padding: 0,
//         height: 24,
//         width: 24,
//         boxShadow: "none",
//       }}
//       title={
//         <Button
//           icon={<Icon component={DownloadIcon} />}
//           disabled={disabled}
//           onClick={() => handleDownload(file_name, download_url!)}
//           size="small"
//         />
//       }
//       align={{
//         offset: [-40, 4],
//       }}
//       placement="right"
//       getTooltipContainer={() => containerRef.current!}
//     >
//       <div css={fileContainerStyle} ref={containerRef}>
//         <FileContent content_type={content_type} file_name={file_name} />
//       </div>
//     </Tooltip>
//   )
// }
// const ShowFiles: FC<ShowFilesProps> = ({ fileList }) => {
//   return (
//     <div css={containerStyle}>
//       {fileList.map((item) =>
//         item.file_name && item.download_url ? (
//           <SingleFile
//             key={item.file_name}
//             content_type={item.content_type}
//             file_name={item.file_name}
//             download_url={item.download_url}
//           />
//         ) : (
//           <FileContent
//             key={item.file_name}
//             content_type={item.content_type}
//             file_name={item.file_name}
//           />
//         ),
//       )}
//     </div>
//   )
// }

// export default ShowFiles

export {}
