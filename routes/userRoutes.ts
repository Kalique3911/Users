import express from "express"
import { createUser, authoriseUser, findUser, getUsers } from "../controllers/userController"
const router = express.Router()

router.post("/create", createUser)
router.post("/authorise", authoriseUser)
router.get("/find/:userId", findUser)
router.get("/", getUsers)

export { router }
