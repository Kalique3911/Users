import express from "express"
import { createTask, getUserTasks } from "../controllers/taskController"
const router = express.Router()

router.post("/", createTask)
router.get("/:creatorId", getUserTasks)

const taskRoutes = router
export { taskRoutes }
