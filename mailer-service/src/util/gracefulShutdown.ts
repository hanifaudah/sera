import { stopServices } from "../service"

export const gracefulShutdown = () => {
  const signals = ['SIGTERM', 'SIGINT']

  for (const signal of signals) {
    process.on(signal, async () => {
      await stopServices()
      process.exit(0)
    })
  }
}