import { JwtPayload } from "jsonwebtoken"
import { Request } from "express"
import { ErrorHandler } from "./src/utils/errorHandling"

export interface IGetUserAuthInfoRequest extends Request {
    user: JwtPayload
    error: ErrorHandler
}
