type Option = {
  enable: boolean
  query?: string
  max?: number
}

let errorHandler: (() => void) | undefined = undefined

export function limitConsoleMaxError(
  { enable, query = 'maxError', max = 10 }: Option,
  errorCount = 0,
) {
  if (!enable || errorHandler) return

  const urlParams = new URLSearchParams(location.search)
  const maxErrors = parseInt(urlParams.get(query) || `${max}`, 10)

  errorHandler = () => {
    errorCount++
    if (errorCount >= maxErrors) {
      console.warn(`⚠️ 报错已达限制次数 (${maxErrors}次)，触发暂停！`)
      debugger
      while (true) {}
    }
  }
  addEventListener('error', errorHandler)
}
