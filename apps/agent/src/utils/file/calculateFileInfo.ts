export const getFileExtensionFromBase64 = (base64: string) => {
  return base64.split(";")[0].split("/")[1]
}

export const base642Blob = async (base64: string) => {
  const result = await fetch(base64)
  return result.blob()
}
