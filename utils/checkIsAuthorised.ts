import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IGetUserAuthInfoRequest } from "../types"

export const checkIsAuthorised = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        let token = req.headers.authorization?.split(" ")[1] //recieving token
        if (!token) {
            res.status(403).json("User is not authorised")
            return
        }
        let decodedToken = jwt.verify(token, "SUPER_SECRET_KEY") as JwtPayload
        ;(req as IGetUserAuthInfoRequest).user = decodedToken //passing data to other funtions
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
