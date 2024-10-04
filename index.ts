import express from "express"
require("dotenv").config()
import mongoose from "mongoose"
import cors from "cors"
import { userRoutes } from "./routes/userRoutes"
import { taskRoutes } from "./routes/taskRoutes"

const port = process.env.PORT || 5000
const uri = process.env.URI || ""

const app = express()
app.use(cors())
app.use(express.json())

app.use("/users", userRoutes)
app.use("/tasks", taskRoutes)

app.listen(port, () => {
    console.log(`Server is working on port ${port}`)
})

mongoose
    .connect(uri)
    .then(() => console.log("MongoDB connection established"))
    .catch((error) => console.log("MongoDB connection failed:" + error.message))
