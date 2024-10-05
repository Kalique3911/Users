import express from "express"
import { createTask, getUserTasks, updateTask, deleteTask } from "../controllers/taskController"
const router = express.Router()

router.post("/create", createTask)
router.get("/:creatorId", getUserTasks)
router.put("/:taskId", updateTask)
router.delete("/:taskId", deleteTask)

const taskRoutes = router
export { taskRoutes }
