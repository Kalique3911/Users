import { userModel } from "../models/userModel"
import { Request, Response } from "express"

const createUser = async (req: Request, res: Response | any) => {
    try {
        const { name, password, email } = req.body

        if (!name || !password || !email) {
            return res.status(400).json("All fields are required")
        }

        let user = await userModel.findOne({ name })
        if (user) {
            return res.status(400).json("This name is already associated with an account")
        }
        user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).json("This email is already associated with an account")
        }

        let passwordRegExp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,1024}$/
        let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        if (!passwordRegExp.test(password)) {
            return res.status(400).json("Invalid password")
        }
        if (!emailRegExp.test(email)) {
            return res.status(400).json("Invalid email")
        }

        user = new userModel({ name, password, email })

        await user.save()

        res.status(200).json({ id: user._id, name, email }) //returned object is reason for 'any'
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const authoriseUser /*N/I*/ = async (req: Request, res: Response | any) => {
    try {
        const { passwordOrEmail, password } = req.body
        let user = await userModel.findOne({ passwordOrEmail })

        if (!user) {
            return res.status(400).json("Invalid name or password")
        }

        const isValidPassword = password === user.password
        if (!isValidPassword) {
            return res.status(400).json("Invalid name or password")
        }

        res.status(200).json({ id: user._id, passwordOrEmail }) //returned object is reason for 'any'
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const findUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId
        const user = await userModel.findById(userId)
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userModel.find()
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export { createUser, authoriseUser, findUser, getUsers }
