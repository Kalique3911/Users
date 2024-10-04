import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 30, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 1024 },
    email: { type: String, required: true, validate: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, unique: true },
})

export const userModel = mongoose.model("User", userSchema)
