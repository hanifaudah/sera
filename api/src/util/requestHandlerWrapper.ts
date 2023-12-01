import { Request, Response, RequestHandler, NextFunction } from 'express'

export const requestHandlerWrapper = (requestHandler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json
    try {
      res.json = function (body: any) {
        return originalJson.call(this, {
          status: 200,
          data: body
        })
      }
      await requestHandler(req, res, next)
      next()
    } catch (error) {
      res.json = originalJson
      next(error)
    }
  }
}