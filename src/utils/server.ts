import express from "express"
import cors from "cors"
import fileUpload from "express-fileupload"
import { userRoutes } from "../routes/usersRoutes"
import { taskRoutes } from "../routes/tasksRoutes"

export const createServer = () => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use(express.static("static"))
    app.use(fileUpload({}))

    app.use("/users", userRoutes)
    app.use("/tasks", taskRoutes)

    return app
}
