import { SortOrder } from "mongoose"
import { taskModel } from "../models/taskModel"
import { Request, Response } from "express"
import { IGetUserAuthInfoRequest } from "../types"

const createTask = async (req: Request, res: Response) => {
    try {
        let { title, creatorId, text } = req.body

        if (!creatorId || !title || !text) {
            res.status(400).json("All fields are required")
            return
        }

        let task = new taskModel({
            title,
            creatorId,
            text,
        })
        await task.save()
        res.status(200).json(task)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const getUserTasks = async (req: Request, res: Response) => {
    //'any' because cannot get 'user' from 'req'
    try {
        let { creatorId } = req.params
        let { page, title, order } = req.query
        let sortOrder: SortOrder
        let { id } = (req as IGetUserAuthInfoRequest).user

        if (creatorId !== id) {
            res.status(403).json("User is not authorised")
            return
        }

        if (!order) {
            order = "1"
        } else if (order !== "-1" && order !== "1") {
            res.status(400).json("Invalid order")
            return
        }

        order === "1" ? (sortOrder = 1) : (sortOrder = -1)

        let query: { title?: { $regex: string }; creatorId: string } = { creatorId: creatorId }

        if (title) {
            query.title = { $regex: title.toString() }
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

const updateTask = async (req: any, res: Response) => {
    //'any' because cannot get 'user' from 'req'
    try {
        let { taskId } = req.params
        let { title, creatorId, text } = req.body
        let { id } = req.user

        if (!creatorId || !title || !text) {
            res.status(400).json("All fields are required")
            return
        }
        if (creatorId !== id) {
            res.status(403).json("User is not authorised")
            return
        }

        let task = await taskModel.findByIdAndUpdate(taskId, { title, creatorId, text }, { new: true })
        res.status(200).json({ title, creatorId, text, id: task!._id })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const deleteTask = async (req: any, res: Response) => {
    //'any' because cannot get 'user' from 'req'
    try {
        let { taskId } = req.params
        let { creatorId } = req.body
        let { id } = req.user

        if (creatorId !== id) {
            res.status(403).json("User is not authorised")
            return
        }

        let task = await taskModel.findByIdAndDelete(taskId)
        res.status(200).json(task)
        //todo delete all tasks with user
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export { createTask, getUserTasks, updateTask, deleteTask }
