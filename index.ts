import express from "express"
require("dotenv").config()
import mongoose from "mongoose"

const port = process.env.PORT || 5000
const uri = process.env.URI || ""

const app = express()

app.use(express.json())

//todo implement routes

app.post("/", (req, res) => {
    console.log(req.body)
    res.status(200).json("Server &&&")
})

app.listen(port, () => {
    console.log(`Server is working on port ${port}`)
})

mongoose
    .connect(uri)
    .then(() => console.log("MongoDB connection established"))
    .catch((error) => console.log("MongoDB connection failed:" + error.message))
