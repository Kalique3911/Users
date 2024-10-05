import express from "express"
import { createUser, authoriseUser, updateUser, deleteUser, findUser, getUsers } from "../controllers/userController"
const router = express.Router()

router.post("/create", createUser)
router.post("/authorise", authoriseUser)
router.put("/:userId", updateUser)
router.delete("/:userId", deleteUser)
router.get("/:userId", findUser)
router.get("/", getUsers)

const userRoutes = router
export { userRoutes }
