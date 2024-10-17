import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title: String,
    creatorId: String,
    text: String,
})

export const taskModel = mongoose.model("Task", taskSchema)
