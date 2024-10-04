import express from "express"
import { createTask, getTasks } from "../controllers/taskController"
const router = express.Router()

router.post("/", createTask)
router.get("/:chatId", getTasks)

export { router }
