import { useCallback, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { IAgentForm } from "../../AIAgent/interface"
import { AgentWSContext } from "../../context/AgentWSContext"

export const useReRerunAgent = () => {
  const { reset } = useFormContext<IAgentForm>()

  const { reconnect } = useContext(AgentWSContext)

  const rerunAgent = useCallback(
    async (data: IAgentForm) => {
      reset(data)
      await reconnect()
    },
    [reconnect, reset],
  )

  return rerunAgent
}
