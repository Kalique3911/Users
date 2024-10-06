import express from "express"
import { createTask, getUserTasks, updateTask, deleteTask } from "../controllers/taskController"
import { checkIsAuthorised } from "../utils/checkIsAuthorised"

const router = express.Router()

router.post("/create", checkIsAuthorised, createTask)
router.get("/:creatorId", checkIsAuthorised, getUserTasks)
router.put("/:taskId", checkIsAuthorised, updateTask)
router.delete("/:taskId", checkIsAuthorised, deleteTask)

const taskRoutes = router
export { taskRoutes }
