import express from "express"
import cors from "cors"
import { userRoutes } from "../routes/usersRoutes"
import { taskRoutes } from "../routes/tasksRoutes"

export const createServer = () => {
    const app = express()
    app.use(cors())
    app.use(express.json())

    app.use("/users", userRoutes)
    app.use("/tasks", taskRoutes)

    return app
}
