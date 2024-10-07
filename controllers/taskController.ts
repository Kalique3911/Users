import { SortOrder } from "mongoose"
import { taskModel } from "../models/taskModel"
import { NextFunction, Request, Response } from "express"
import { IGetUserAuthInfoRequest } from "../types"
import { ErrorHandler } from "../utils/errorHandling"

const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let authorizationError = (req as IGetUserAuthInfoRequest).error

        if (authorizationError) {
            throw new ErrorHandler(authorizationError.statusCode, authorizationError.message)
        }

        let { title, creatorId, text } = req.body

        if (!creatorId || !title || !text) {
            throw new ErrorHandler(400, "All fields are required")
        }

        let task = new taskModel({
            title,
            creatorId,
            text,
        })
        await task.save()
        res.status(200).json(task)
    } catch (error) {
        next(error)
    }
}

const getUserTasks = async (req: Request, res: Response, next: NextFunction) => {
    //'any' because cannot get 'user' from 'req'
    try {
        let authorizationError = (req as IGetUserAuthInfoRequest).error

        if (authorizationError) {
            throw new ErrorHandler(authorizationError.statusCode, authorizationError.message)
        }

        let { creatorId } = req.params
        let { page, title, order } = req.query
        let sortOrder: SortOrder
        let { id } = (req as IGetUserAuthInfoRequest).user

        if (creatorId !== id) {
            throw new ErrorHandler(403, "User is not authorised")
        }

        if (!order) {
            order = "1"
        } else if (order !== "-1" && order !== "1") {
            throw new ErrorHandler(400, "Invalid order")
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
        next(error)
    }
}

const updateTask = async (req: any, res: Response, next: NextFunction) => {
    //'any' because cannot get 'user' from 'req'
    try {
        let authorizationError = (req as IGetUserAuthInfoRequest).error

        if (authorizationError) {
            throw new ErrorHandler(authorizationError.statusCode, authorizationError.message)
        }

        let { taskId } = req.params
        let { title, creatorId, text } = req.body
        let { id } = req.user

        if (!creatorId || !title || !text) {
            throw new ErrorHandler(400, "All fields are required")
        }
        if (creatorId !== id) {
            throw new ErrorHandler(403, "User is not authorised")
        }

        let task = await taskModel.findByIdAndUpdate(taskId, { title, creatorId, text }, { new: true })
        res.status(200).json({ title, creatorId, text, id: task!._id })
    } catch (error) {
        next(error)
    }
}

const deleteTask = async (req: any, res: Response, next: NextFunction) => {
    //'any' because cannot get 'user' from 'req'
    try {
        let authorizationError = (req as IGetUserAuthInfoRequest).error

        if (authorizationError) {
            throw new ErrorHandler(authorizationError.statusCode, authorizationError.message)
        }

        let { taskId } = req.params
        let { creatorId } = req.body
        let { id } = req.user

        if (creatorId !== id) {
            throw new ErrorHandler(403, "User is not authorised")
        }

        let task = await taskModel.findByIdAndDelete(taskId)
        res.status(200).json(task)
        //todo delete all tasks with user
    } catch (error) {
        next(error)
    }
}

export { createTask, getUserTasks, updateTask, deleteTask }
