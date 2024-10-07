import { JwtPayload } from "jsonwebtoken"
import { Request } from "express"
import { ErrorHandler } from "./utils/errorHandling"

export interface IGetUserAuthInfoRequest extends Request {
    user: JwtPayload
    error: ErrorHandler
}
