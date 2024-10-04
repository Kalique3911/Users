import { taskModel } from "../models/taskModel"
import { Request, Response } from "express"

const createTask = async (req: Request, res: Response) => {
    const { taskName, creatorId, text } = req.body

    const message = new taskModel({
        taskName,
        creatorId,
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

const getUserTasks = async (req: Request, res: Response) => {
    const { creatorId } = req.params

    try {
        const messages = await taskModel.find({ creatorId })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export { createTask, getUserTasks }
