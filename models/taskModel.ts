import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    taskName: String,
    creatorId: String,
    text: String,
})

export const taskModel = mongoose.model("Message", messageSchema)
