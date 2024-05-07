import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material"
import { Typography } from "antd"
import { memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import { MarkdownMessageProps } from "@/page/WorkSpace/AI/components/MarkdownMessage/interface"
import {
  cellStyle,
  headStyle,
  listStyle,
  markdownMessageContainerStyle,
  markdownMessageStyle,
  rowStyle,
  tableStyle,
  thStyle,
} from "@/page/WorkSpace/AI/components/MarkdownMessage/style"
import CustomAnchor from "./components/CustomAnchor"
import CustomCode from "./components/CustomCode"
import CustomImage from "./components/CustomImage"
import { handleParseText } from "./utils"

export const MarkdownMessage = memo((props: MarkdownMessageProps) => {
  const { children, isOwnMessage, codeStatus, disableTrigger } = props

  return (
    <div css={markdownMessageContainerStyle}>
      <ReactMarkdown
        css={markdownMessageStyle}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          pre: ({ children }) => <Typography>{children}</Typography>,
          h1: ({ children }) => (
            <Typography.Title level={1} style={{ margin: "20px 0" }}>
              {children}
            </Typography.Title>
          ),
          ol: ({ children }) => <ol css={listStyle}>{children}</ol>,
          ul: ({ children }) => <ul css={listStyle}>{children}</ul>,
          h2: ({ children }) => (
            <Typography.Title level={2} style={{ margin: "18px 0" }}>
              {children}
            </Typography.Title>
          ),
          h3: ({ children }) => (
            <Typography.Title level={3} style={{ margin: "18px 0" }}>
              {children}
            </Typography.Title>
          ),
          h4: ({ children }) => (
            <Typography.Title level={4} style={{ margin: "18px 0" }}>
              {children}
            </Typography.Title>
          ),
          h5: ({ children }) => (
            <Typography.Title level={5} style={{ margin: "20px 0" }}>
              {children}
            </Typography.Title>
          ),
          a: ({ href, children }) => (
            <CustomAnchor href={href}>{children}</CustomAnchor>
          ),
          p: ({ children }) => (
            <Typography.Paragraph style={{ margin: 0 }}>
              {children}
            </Typography.Paragraph>
          ),
          tr: ({ children }) => <TableRow css={rowStyle}>{children}</TableRow>,
          th: ({ children }) => (
            <TableCell align="center" css={thStyle}>
              {children}
            </TableCell>
          ),
          td: ({ children }) => (
            <TableCell align="left" css={cellStyle}>
              {children}
            </TableCell>
          ),
          thead: ({ children }) => (
            <TableHead css={headStyle}>{children}</TableHead>
          ),
          tbody: ({ children }) => <TableBody>{children}</TableBody>,
          tfoot: ({ children }) => <TableFooter>{children}</TableFooter>,
          table: ({ children }) => (
            <TableContainer component={Paper} css={tableStyle}>
              <Table sx={{ minWidth: 650 }}>{children}</Table>
            </TableContainer>
          ),
          code: (props) => (
            <CustomCode
              {...props}
              codeStatus={codeStatus}
              disableTrigger={disableTrigger}
            />
          ),
          img: ({ src, alt }) => <CustomImage src={src} alt={alt} />,
        }}
      >
        {handleParseText(children ?? "", isOwnMessage)}
      </ReactMarkdown>
    </div>
  )
})

MarkdownMessage.displayName = "MarkdownMessage"
export default MarkdownMessage
