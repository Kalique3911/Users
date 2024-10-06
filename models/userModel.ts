import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    role: { type: String, required: true },
})

export const userModel = mongoose.model("User", userSchema)
