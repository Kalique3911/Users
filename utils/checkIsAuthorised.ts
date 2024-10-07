import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IGetUserAuthInfoRequest } from "../types"
import { ErrorHandler } from "./errorHandling"

export const checkIsAuthorised = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        let token = req.headers.authorization?.split(" ")[1] //recieving token
        if (!token) {
            throw new ErrorHandler(403, "User is not authorised")
        }
        let decodedToken = jwt.verify(token, "SUPER_SECRET_KEY") as JwtPayload
        ;(req as IGetUserAuthInfoRequest).user = decodedToken //passing data to other funtions
        next()
    } catch (error) {
        ;(req as IGetUserAuthInfoRequest).error = error as ErrorHandler
        next()
    }
}
