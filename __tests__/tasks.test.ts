import supertest from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { createServer } from "../utils/server"
import mongoose from "mongoose"

const app = createServer()

const taskPayload = {
    name: "testtask",
    creatorId: "1324",
    text: "testtexttesttext",
    id: null,
}

describe("users", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()

        await mongoose.connect(mongoServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe("get tasks route", () => {
        describe("given task data is missing creator", () => {
            it("should return 400 and no creator", async () => {
                const { body, statusCode } = await supertest(app).post(`/tasks/create`).send({ taskPayload, creatorId: null })
                expect(statusCode).toBe(400)
                expect(body).toBe("All fields are required")
            })
        })
        describe("given task data is ok", () => {
            it("should return 200 and task with id", async () => {
                const { body, statusCode } = await supertest(app).post(`/tasks/create`).send(taskPayload)
                taskPayload.id = body.id
                expect(statusCode).toBe(200)
                expect(body.id.length > 2).toBe(true)
            })
        })
        describe("given user tasks", () => {
            it("should return 200 and tasks array", async () => {
                const userId = "67007c9405f77bd36075f876"
                const { body, statusCode } = await supertest(app).get(`/tasks/${userId}`)
                expect(statusCode).toBe(200)
                expect(Array.isArray(body)).toBe(true)
            })
        })
        describe("given new task data is ok", () => {
            it("should return 200 and task with previous id", async () => {
                const { body, statusCode } = await supertest(app).put(`/tasks/${taskPayload.id}`).send(taskPayload)
                expect(statusCode).toBe(200)
                expect(taskPayload.id === body.id).toBe(true)
                expect(taskPayload.creatorId === body.creatorId).toBe(true)
            })
        })
        describe("given new task data is not ok", () => {
            it("should return 400 and no creator", async () => {
                const name = ""
                const { body, statusCode } = await supertest(app)
                    .put(`/tasks/${taskPayload}`)
                    .send({ ...taskPayload, name })
                expect(statusCode).toBe(400)
                expect(body).toBe("All fields are required")
            })
        })
        describe("given task is permitted to delete", () => {
            it("should return 200", async () => {
                await supertest(app).delete(`/tasks/${taskPayload.id}`).expect(200)
            })
        })
    })
})
