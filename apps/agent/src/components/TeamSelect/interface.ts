export interface TeamSelectProps {
  openCreateModal?: () => void
  showCreateTeamButton?: boolean
  onChangeTeam?: (currentId: string, currentIdentifier: string) => void
}
