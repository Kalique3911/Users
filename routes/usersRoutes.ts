import express from "express"
import { createUser, authoriseUser, updateUser, deleteUser, findUser, getUsers } from "../controllers/userController"
import { checkIsAdmin } from "../utils/checkIsAdmin"

const router = express.Router()

router.post("/create", createUser)
router.post("/authorise", authoriseUser)
router.put("/:userId", updateUser)
router.delete("/:userId", checkIsAdmin, deleteUser)
router.get("/:userId", findUser)
router.get("/", getUsers)

const userRoutes = router
export { userRoutes }
