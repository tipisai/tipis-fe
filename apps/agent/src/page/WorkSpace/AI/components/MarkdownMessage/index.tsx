import Icon from "@ant-design/icons"
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
import { App, Tooltip, Typography } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import { CopyIcon } from "@illa-public/icon"
import { copyToClipboard } from "@illa-public/utils"
import { MarkdownMessageProps } from "@/page/WorkSpace/AI/components/MarkdownMessage/interface"
import {
  cellStyle,
  hoverCopyStyle,
  markdownMessageStyle,
  tableStyle,
} from "@/page/WorkSpace/AI/components/MarkdownMessage/style"
import Code from "./Code"
import { handleParseText } from "./utils"

export const MarkdownMessage: FC<MarkdownMessageProps> = (props) => {
  const { children, isOwnMessage, disableTrigger } = props
  const { t } = useTranslation()
  const { message: messageAPI } = App.useApp()

  const contentBody = (
    <div>
      <Typography>
        <ReactMarkdown
          css={markdownMessageStyle}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            h1: ({ children }) => (
              <Typography.Title level={1}>{children}</Typography.Title>
            ),
            h2: ({ children }) => (
              <Typography.Title level={2}>{children}</Typography.Title>
            ),
            h3: ({ children }) => (
              <Typography.Title level={3}>{children}</Typography.Title>
            ),
            h4: ({ children }) => (
              <Typography.Title level={4}>{children}</Typography.Title>
            ),
            h5: ({ children }) => (
              <Typography.Title level={5}>{children}</Typography.Title>
            ),
            a: ({ href, children }) => (
              <Typography.Link href={href} target="_blank">
                {children}
              </Typography.Link>
            ),
            p: ({ children }) => <Typography.Text>{children}</Typography.Text>,
            tr: ({ children }) => <TableRow>{children}</TableRow>,
            th: ({ children }) => (
              <TableCell align="center">{children}</TableCell>
            ),
            td: ({ children }) => (
              <TableCell align="left" css={cellStyle}>
                {children}
              </TableCell>
            ),
            thead: ({ children }) => <TableHead>{children}</TableHead>,
            tbody: ({ children }) => <TableBody>{children}</TableBody>,
            tfoot: ({ children }) => <TableFooter>{children}</TableFooter>,
            table: ({ children }) => (
              <TableContainer component={Paper} css={tableStyle}>
                <Table sx={{ minWidth: 650 }}>{children}</Table>
              </TableContainer>
            ),
            code: (props) => <Code {...props} />,
          }}
        >
          {handleParseText(children ?? "", isOwnMessage)}
        </ReactMarkdown>
      </Typography>
    </div>
  )

  return disableTrigger ? (
    contentBody
  ) : (
    <Tooltip
      color="transparent"
      overlayInnerStyle={{
        padding: 0,
        minHeight: "24px",
        minWidth: "24px",
        boxShadow: "none",
      }}
      title={
        <span
          css={hoverCopyStyle(isOwnMessage)}
          onClick={() => {
            copyToClipboard(children ?? "")
            messageAPI.success({
              content: t("copied"),
            })
          }}
        >
          <Icon component={CopyIcon} />
        </span>
      }
      placement={isOwnMessage ? "leftBottom" : "rightBottom"}
      showArrow={false}
      autoAdjustOverflow={false}
      trigger="hover"
    >
      {contentBody}
    </Tooltip>
  )
}

MarkdownMessage.displayName = "MarkdownMessage"
export default MarkdownMessage
