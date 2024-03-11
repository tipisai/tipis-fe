const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

export const getStorageSize = (size: number) => {
  const index = size && Math.floor(Math.log(size) / Math.log(1024))
  const unit = units[index]
  const value = (size / Math.pow(1024, index)).toFixed(1)
  return `${value}${unit}`
}
