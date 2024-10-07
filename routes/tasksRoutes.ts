import express from "express"
import { createTask, getUserTasks, updateTask, deleteTask } from "../controllers/taskController"
import { checkIsAuthorised } from "../utils/checkIsAuthorised"
import { handleError } from "../utils/errorHandling"

const router = express.Router()

router.post("/create", checkIsAuthorised, createTask, handleError)
router.get("/:creatorId", checkIsAuthorised, getUserTasks, handleError)
router.put("/:taskId", checkIsAuthorised, updateTask, handleError)
router.delete("/:taskId", checkIsAuthorised, deleteTask, handleError)

const taskRoutes = router
export { taskRoutes }
