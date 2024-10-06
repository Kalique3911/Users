import { SortOrder } from "mongoose"
import { taskModel } from "../models/taskModel"
import { Request, Response } from "express"

const createTask = async (req: Request, res: Response | any) => {
    try {
        let { name, creatorId, text } = req.body

        if (!creatorId || !name || !text) {
            return res.status(400).json("All fields are required")
        }

        let task = new taskModel({
            name,
            creatorId,
            text,
        })
        await task.save()
        res.status(200).json({ name, creatorId, text, id: task._id })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getUserTasks = async (req: Request, res: Response | any) => {
    try {
        let { creatorId } = req.params
        let { page, name, order } = req.query
        let sortOrder: SortOrder

        if (!order) {
            order = "1"
        } else if (order !== "-1" && order !== "1") {
            return res.status(400).json("Invalid order")
        }

        order === "1" ? (sortOrder = 1) : (sortOrder = -1)

        let query: { taskName?: { $regex: string }; creatorId: string } = { creatorId: creatorId }

        if (name) {
            query.taskName = { $regex: name.toString() }
        }

        if (Number(page) < 0 || !page) {
            page = "0"
        }
        let tasksPerPage = 1

        let tasks = await taskModel
            .find(query)
            .limit(tasksPerPage)
            .sort({ _id: sortOrder })
            .skip(Number(page) * tasksPerPage)
        res.status(200).json(tasks)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const updateTask = async (req: Request, res: Response | any) => {
    try {
        let { taskId } = req.params
        let { name, creatorId, text } = req.body

        if (!creatorId || !name || !text) {
            return res.status(400).json("All fields are required")
        }

        let task = await taskModel.findByIdAndUpdate(taskId, { name, creatorId, text }, { new: true })
        res.status(200).json({ name, creatorId, text, id: task!._id })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const deleteTask = async (req: Request, res: Response) => {
    try {
        let { taskId } = req.params
        let task = await taskModel.findByIdAndDelete(taskId)
        res.status(200).json(task)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export { createTask, getUserTasks, updateTask, deleteTask }
