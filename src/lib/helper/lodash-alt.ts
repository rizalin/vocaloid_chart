export function chunk<T>(arr: T[], chunkSize = 1): T[][] {
  const res: T[][] = []
  while (arr.length > 0) {
    const chunk = arr.splice(0, chunkSize)
    res.push(chunk)
  }
  return res
}
