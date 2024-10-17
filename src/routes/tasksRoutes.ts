import express from "express"
import { createTask, getUserTasks, updateTask, deleteTask } from "../controllers/taskController"
import { checkIsAuthorized } from "../utils/checkIsAuthorized"
import { handleError } from "../utils/errorHandling"

const router = express.Router()

router.post("/create", checkIsAuthorized, createTask, handleError)
router.put("/:taskId", checkIsAuthorized, updateTask, handleError)
router.delete("/:taskId", checkIsAuthorized, deleteTask, handleError)
router.get("/:creatorId", checkIsAuthorized, getUserTasks, handleError)

const taskRoutes = router
export { taskRoutes }
