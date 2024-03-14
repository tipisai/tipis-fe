export const getExploreTipisPath = (teamIdentifier: string) => {
  return `/workspace/${teamIdentifier}/tipis`
}

export const getCreateTipiPath = (teamIdentifier: string, tipiID: string) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/create`
}

export const getEditTipiPath = (teamIdentifier: string, tipiID: string) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/edit`
}

export const getRunTipiPath = (teamIdentifier: string, tipiID: string) => {
  return `/workspace/${teamIdentifier}/tipi/${tipiID}/run`
}

export const getExploreFunctionsPath = (teamIdentifier: string) => {
  return `/workspace/${teamIdentifier}/functions`
}

export const getCreateFunctionPath = (
  teamIdentifier: string,
  functionID: string,
) => {
  return `/workspace/${teamIdentifier}/function/${functionID}/create`
}

export const getEditFunctionPath = (
  teamIdentifier: string,
  functionID: string,
) => {
  return `/workspace/${teamIdentifier}/function/${functionID}/edit`
}

export const getRunFunctionPath = (
  teamIdentifier: string,
  functionID: string,
) => {
  return `/workspace/${teamIdentifier}/function/${functionID}/run`
}

export const getFunctionDetailPath = (
  teamIdentifier: string,
  functionID: string,
) => {
  return `/workspace/${teamIdentifier}/function/${functionID}/detail`
}
