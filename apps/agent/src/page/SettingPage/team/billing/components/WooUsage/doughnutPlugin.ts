import { Chart } from "chart.js"
import { toThousands } from "@/utils/billing/toThousands"

const doughnutDraw = (
  chart: Chart,
  _: Record<string, never>,
  options: Record<string, any>,
) => {
  const { title, total } = options
  const ctx = chart.ctx
  const { top, left, width, height } = chart.chartArea
  ctx.font = "600 14px sans-serif"
  ctx.fillStyle = "#1D2129"
  ctx.textAlign = "center"
  const totalX = left + width / 2
  const totalY = title ? top + height / 2 : top + height / 2 + 7
  ctx.fillText(toThousands(total), totalX, totalY)
  if (title) {
    ctx.font = "400 12px sans-serif"
    ctx.fillStyle = "#787E85"
    const titleX = left + width / 2
    const titleY = totalY + 22
    ctx.fillText(title, titleX, titleY)
  }
}

export const DoughnutPlugin = {
  id: "doughnutPlugin",
  beforeDraw: doughnutDraw,
}
