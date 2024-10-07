import { NextFunction, Request, Response } from "express"

export class ErrorHandler extends Error {
    constructor(public statusCode: number, public message: string) {
        super()
        this.statusCode = statusCode
        this.message = message
    }
}

export const handleError = (err: ErrorHandler | any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.statusCode, err.message)
    const { statusCode, message } = err
    res.status(statusCode).json(message)
}
