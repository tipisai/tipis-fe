import localforage from "localforage"

const LOCAL_TEAM_DATA_DATABASE_NAME_PREFIX = "tipis-team-data"

export const teamDataDataBase = localforage.createInstance({
  name: LOCAL_TEAM_DATA_DATABASE_NAME_PREFIX,
})
