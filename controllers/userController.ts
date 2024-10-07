import { SortOrder } from "mongoose"
import { userModel } from "../models/userModel"
import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IGetUserAuthInfoRequest } from "../types"
import { ErrorHandler } from "../utils/errorHandling"

const generateToken = (id: any, role: string) => {
    //'any' because imported ObjectId is not assignable to needed Object id
    const payload = {
        id,
        role,
    }

    return jwt.sign(payload, "SUPER_SECRET_KEY", { expiresIn: "3d" })
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, password, email } = req.body
        let role: string
        if (name === "ADMIN") {
            role = "ADMIN"
        } else {
            role = "USER"
        }

        if (!name || !password || !email) {
            throw new ErrorHandler(400, "All fields are required")
        }
        let user = await userModel.findOne({ name })
        if (user) {
            throw new ErrorHandler(400, "This name is already associated with an account") //reason for 'any'
        }
        user = await userModel.findOne({ email })
        if (user) {
            throw new ErrorHandler(400, "This email is already associated with an account") //reason for 'any'
        }

        let passwordRegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,1024}$/
        let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if (!passwordRegExp.test(password)) {
            throw new ErrorHandler(400, "Invalid password")
        }
        if (!emailRegExp.test(email)) {
            throw new ErrorHandler(400, "Invalid email")
        }

        user = await new userModel({ name, password, email, role }).save()

        const token = generateToken(user._id, user.role)

        res.status(200).json({ _id: user._id, name: user.name, email: user.email, token })
    } catch (error) {
        next(error)
    }
}

const authoriseUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { nameOrEmail, password } = req.body
        let user = await userModel.findOne({ $or: [{ name: nameOrEmail }, { email: nameOrEmail }] })

        if (!user) {
            throw new ErrorHandler(400, "Invalid name, email or password")
        }

        const isValidPassword = password === user.password
        if (!isValidPassword) {
            throw new ErrorHandler(400, "Invalid name, email or password")
        }

        const token = generateToken(user._id, user.role)

        res.status(200).json({ _id: user._id, name: user.name, email: user.email, token })
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let authorizationError = (req as IGetUserAuthInfoRequest).error

        if (authorizationError) {
            throw new ErrorHandler(authorizationError.statusCode, authorizationError.message)
        }

        let userId = req.params.userId
        let { name, password, email } = req.body

        if (!name || !password || !email) {
            throw new ErrorHandler(400, "All fields are required")
        }

        let user = await userModel.findOne({ name })
        if (user && user._id.toString() !== userId) {
            throw new ErrorHandler(400, "This name is already associated with an account")
        }
        user = await userModel.findOne({ email })
        if (user && user._id.toString() !== userId) {
            throw new ErrorHandler(400, "This email is already associated with an account")
        }

        let passwordRegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,1024}$/
        let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if (!passwordRegExp.test(password)) {
            throw new ErrorHandler(400, "Invalid password")
        }
        if (!emailRegExp.test(email)) {
            throw new ErrorHandler(400, "Invalid email")
        }

        user = await userModel.findByIdAndUpdate(userId, { name, password, email }, { new: true })
        res.status(200).json({ name, password, email, id: user!._id })
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let authorizationError = (req as IGetUserAuthInfoRequest).error

        if (authorizationError) {
            throw new ErrorHandler(authorizationError.statusCode, authorizationError.message)
        }

        let { userId } = req.params
        let user = await userModel.findByIdAndDelete(userId).select("name email")
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

const findUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = req.params.userId

        let user = await userModel.findById(userId).select("name email")
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { page, name, order } = req.query
        let sortOrder: SortOrder

        if (!order) {
            order = "1"
        } else if (order !== "-1" && order !== "1") {
            throw new ErrorHandler(400, "Invalid order")
        }

        order === "1" ? (sortOrder = 1) : (sortOrder = -1)

        let query: { name?: { $regex: string } } = {}

        if (name) {
            query.name = { $regex: name.toString() }
        }

        if (Number(page) < 0 || !page) {
            page = "0"
        }
        let usersPerPage = 5

        let users = await userModel
            .find(query)
            .select("name email")
            .limit(usersPerPage)
            .sort({ _id: sortOrder })
            .skip(Number(page) * usersPerPage)
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export { createUser, authoriseUser, updateUser, deleteUser, findUser, getUsers }
