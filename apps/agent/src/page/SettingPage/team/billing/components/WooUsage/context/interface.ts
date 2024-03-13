import { ReactNode } from "react"

interface Datasets {
  data: number[]
  backgroundColor: string[]
}

export interface UsageData {
  labels: string[]
  datasets: Datasets[]
}

export interface UsageContextProps {
  allNum: number
  usageData: UsageData
  percentNum: number[]
  dataNums: number[]
  loading: boolean
  handleDateChange: (date: string | undefined) => void
}

export interface UsageContextProviderProps {
  children: ReactNode
}
