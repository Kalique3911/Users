import { SortOrder } from "mongoose"
import { userModel } from "../models/userModel"
import { Request, Response } from "express"

const createUser = async (req: Request, res: Response | any) => {
    try {
        let { name, password, email } = req.body

        if (!name || !password || !email) {
            return res.status(400).json("All fields are required") //reason for 'any'
        }

        let user = await userModel.findOne({ name })
        if (user) {
            return res.status(400).json("This name is already associated with an account") //reason for 'any'
        }
        user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).json("This email is already associated with an account") //reason for 'any'
        }

        let passwordRegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,1024}$/
        let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if (!passwordRegExp.test(password)) {
            return res.status(400).json("Invalid password") //reason for 'any'
        }
        if (!emailRegExp.test(email)) {
            return res.status(400).json("Invalid email") //reason for 'any'
        }

        user = new userModel({ name, password, email })

        await user.save()

        res.status(200).json({ id: user._id, name, email })
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
            return res.status(400).json("Invalid name, email or password") //reason for 'any'
        }

        const isValidPassword = password === user.password
        if (!isValidPassword) {
            return res.status(400).json("Invalid name, email or password") //reason for 'any'
        }

        res.status(200).json({ id: user._id, passwordOrEmail })
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
            return res.status(400).json("All fields are required") //reason for 'any'
        }

        let user = await userModel.findOne({ name })
        if (user && user._id.toString() !== userId) {
            return res.status(400).json("This name is already associated with an account") //reason for 'any'
        }
        user = await userModel.findOne({ email })
        if (user && user._id.toString() !== userId) {
            return res.status(400).json("This email is already associated with an account") //reason for 'any'
        }

        let passwordRegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,1024}$/
        let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if (!passwordRegExp.test(password)) {
            return res.status(400).json("Invalid password") //reason for 'any'
        }
        if (!emailRegExp.test(email)) {
            return res.status(400).json("Invalid email") //reason for 'any'
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
        let user = await userModel.findByIdAndDelete(userId)
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const findUser = async (req: Request, res: Response) => {
    try {
        let userId = req.params.userId

        let user = await userModel.findById(userId)
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
            return res.status(400).json("Invalid order")
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
