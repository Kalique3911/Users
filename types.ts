import { JwtPayload } from "jsonwebtoken"
import { Request } from "express"

export interface IGetUserAuthInfoRequest extends Request {
    user: JwtPayload
}
