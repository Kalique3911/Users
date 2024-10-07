import express from "express"
import { createUser, authoriseUser, updateUser, deleteUser, findUser, getUsers, addPicture } from "../controllers/userController"
import { checkIsAdmin } from "../utils/checkIsAdmin"
import { checkIsAuthorised } from "../utils/checkIsAuthorised"
import { handleError } from "../utils/errorHandling"

const router = express.Router()

router.post("/create", createUser, handleError)
router.post("/authorise", authoriseUser, handleError)
router.put("/:userId", checkIsAuthorised, updateUser, handleError)
router.patch("/:userId", checkIsAuthorised, addPicture, handleError)
router.delete("/:userId", checkIsAdmin, deleteUser, handleError)
router.get("/:userId", findUser, handleError)
router.get("/", getUsers, handleError)

const userRoutes = router
export { userRoutes }
