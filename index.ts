require("dotenv").config()
import mongoose from "mongoose"
import { createServer } from "./utils/server"

const port = process.env.PORT || 5000
const uri = process.env.URI!

const app = createServer()

app.listen(port, () => {
    console.log(`Server is working on port ${port}`)
})

mongoose
    .connect(uri)
    .then(() => console.log("MongoDB connection established"))
    .catch((error) => console.log("MongoDB connection failed:" + error.message))
