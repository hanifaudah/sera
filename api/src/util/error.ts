type StandardErrorData = {
  status: number
}

export class StandardError extends Error {
  public data: StandardErrorData
  constructor(message: string, data: StandardErrorData) {
    super(message)
    this.data = data
  }
}