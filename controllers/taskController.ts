import { taskModel } from "../models/taskModel"
import { Request, Response } from "express"

const createTask = async (req: Request, res: Response) => {
    const { chatId, senderId, text } = req.body

    const message = new taskModel({
        chatId,
        senderId,
        text,
    })

    try {
        const response = await message.save()
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getTasks = async (req: Request, res: Response) => {
    const { chatId } = req.params

    try {
        const messages = await taskModel.find({ chatId })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export { createTask, getTasks }
