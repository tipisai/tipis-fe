import { useCallback } from "react"
import { CollaboratorsInfo, SenderType } from "../interface"

export const useUpdateAnonymousAvatar = () => {
  const updateLocalIcon = useCallback(
    (icon: string, newRoomUsers: CollaboratorsInfo[]) => {
      const updateRoomUsers = [...newRoomUsers]
      let index = updateRoomUsers.findIndex(
        (user) => user.roomRole === SenderType.ANONYMOUS_AGENT,
      )
      if (index != -1) {
        updateRoomUsers[index].avatar = icon
      }
      return updateRoomUsers
    },
    [],
  )

  return updateLocalIcon
}

export const useUpdateAnonymousName = () => {
  const updateLocalName = useCallback(
    (name: string, newRoomUsers: CollaboratorsInfo[]) => {
      const updateRoomUsers = [...newRoomUsers]
      let index = updateRoomUsers.findIndex(
        (user) => user.roomRole === SenderType.ANONYMOUS_AGENT,
      )
      if (index != -1) {
        updateRoomUsers[index].nickname = name
      }
      return updateRoomUsers
    },
    [],
  )

  return updateLocalName
}
