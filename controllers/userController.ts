import { SortOrder } from "mongoose"
import { userModel } from "../models/userModel"
import { Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

const generateToken = (id: any, role: string) => {
    //'any' because imported ObjectId is not assignable to needed Object id
    const payload = {
        id,
        role,
    }

    return jwt.sign(payload, "SUPER_SECRET_KEY", { expiresIn: "3d" })
}

const createUser = async (req: Request, res: Response) => {
    try {
        let { name, password, email } = req.body
        let role: string
        if (name === "ADMIN") {
            role = "ADMIN"
        } else {
            role = "USER"
        }

        if (!name || !password || !email) {
            res.status(400).json("All fields are required")
            return
        }
        let user = await userModel.findOne({ name })
        if (user) {
            res.status(400).json("This name is already associated with an account") //reason for 'any'
            return
        }
        user = await userModel.findOne({ email })
        if (user) {
            res.status(400).json("This email is already associated with an account") //reason for 'any'
            return
        }

        let passwordRegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,1024}$/
        let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if (!passwordRegExp.test(password)) {
            res.status(400).json("Invalid password")
            return
        }
        if (!emailRegExp.test(email)) {
            res.status(400).json("Invalid email")
            return
        }

        user = await new userModel({ name, password, email, role }).save()

        const token = generateToken(user._id, user.role)

        res.status(200).json({ _id: user._id, name: user.name, email: user.email, token })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const authoriseUser /*N/I*/ = async (req: Request, res: Response | any) => {
    try {
        let { passwordOrEmail, password } = req.body
        let user = await userModel.findOne({ passwordOrEmail })

        if (!user) {
            res.status(400).json("Invalid name, email or password")
            return
        }

        const isValidPassword = password === user.password
        if (!isValidPassword) {
            res.status(400).json("Invalid name, email or password")
            return
        }

        const token = generateToken(user._id, user.role)

        res.status(200).json({ _id: user._id, name: user.name, email: user.email, token })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const updateUser = async (req: Request, res: Response | any) => {
    try {
        let userId = req.params.userId
        let { name, password, email } = req.body

        if (!name || !password || !email) {
            res.status(400).json("All fields are required")
            return
        }

        let user = await userModel.findOne({ name })
        if (user && user._id.toString() !== userId) {
            res.status(400).json("This name is already associated with an account") //reason for 'any'
            return
        }
        user = await userModel.findOne({ email })
        if (user && user._id.toString() !== userId) {
            res.status(400).json("This email is already associated with an account") //reason for 'any'
            return
        }

        let passwordRegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,1024}$/
        let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if (!passwordRegExp.test(password)) {
            res.status(400).json("Invalid password")
            return
        }
        if (!emailRegExp.test(email)) {
            res.status(400).json("Invalid email")
            return
        }

        user = await userModel.findByIdAndUpdate(userId, { name, password, email }, { new: true })
        res.status(200).json({ name, password, email, id: user!._id })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        let { userId } = req.params
        let user = await userModel.findByIdAndDelete(userId).select("name email")
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const findUser = async (req: Request, res: Response) => {
    try {
        let userId = req.params.userId

        let user = await userModel.findById(userId).select("name email")
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getUsers = async (req: Request, res: Response | any) => {
    try {
        let { page, name, order } = req.query
        let sortOrder: SortOrder

        if (!order) {
            order = "1"
        } else if (order !== "-1" && order !== "1") {
            res.status(400).json("Invalid order")
            return
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
        console.log(error)
        res.status(500).json(error)
    }
}

export { createUser, authoriseUser, updateUser, deleteUser, findUser, getUsers }
