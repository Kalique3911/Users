import supertest from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { createServer } from "../src/utils/server"
import mongoose from "mongoose"

const app = createServer()

const taskPayload = {
    title: "testtask",
    creatorId: "6702f3ca9fcea3f944c54bfa",
    text: "testtexttesttext",
    _id: null,
    //next two fields require periodic change
    testuserId: "6702f3ca9fcea3f944c54bfa",
    token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDJmM2NhOWZjZWEzZjk0NGM1NGJmYSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzI4MjQ2NzMwLCJleHAiOjE3Mjg1MDU5MzB9.SLRwLUxA4vXvnRBKPDEC1_k4ejOqRYPFshTI2kTilIY",
}

describe("tasks", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()

        await mongoose.connect(mongoServer.getUri())
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    describe("post tasks route", () => {
        describe("given task data is missing creator", () => {
            it("should return 400 and no creator", async () => {
                const { body, statusCode } = await supertest(app).post(`/tasks/create`).set("Authorization", taskPayload.token).send({ taskPayload, creatorId: null })
                expect(statusCode).toBe(400)
                expect(body).toBe("All fields are required")
            })
        })
        describe("given task data is ok", () => {
            it("should return 200 and task with id", async () => {
                const { body, statusCode } = await supertest(app).post(`/tasks/create`).set("Authorization", taskPayload.token).send(taskPayload)
                taskPayload._id = body._id
                expect(statusCode).toBe(200)
                expect(body._id.length > 2).toBe(true)
            })
        })
    })
    describe("get user tasks route", () => {
        it("should return 200 and tasks array", async () => {
            const userId = taskPayload.testuserId
            const { body, statusCode } = await supertest(app).get(`/tasks/${userId}`).set("Authorization", taskPayload.token)
            expect(statusCode).toBe(200)
            expect(Array.isArray(body)).toBe(true)
        })
    })
    describe("put task route", () => {
        describe("given new task data is ok", () => {
            it("should return 200 and task with previous id", async () => {
                const { body, statusCode } = await supertest(app).put(`/tasks/${taskPayload._id}`).set("Authorization", taskPayload.token).send(taskPayload)
                expect(statusCode).toBe(200)
                expect(taskPayload.creatorId === body.creatorId).toBe(true)
            })
        })
        describe("given new task data is not ok", () => {
            it("should return 400 and no creator", async () => {
                const title = ""
                const { body, statusCode } = await supertest(app)
                    .put(`/tasks/${taskPayload}`)
                    .set("Authorization", taskPayload.token)
                    .send({ ...taskPayload, title })
                expect(statusCode).toBe(400)
                expect(body).toBe("All fields are required")
            })
        })
    })
    describe("delete task route", () => {
        it("should return 200", async () => {
            await supertest(app).delete(`/tasks/${taskPayload._id}`).set("Authorization", taskPayload.token).send(taskPayload).expect(200)
        })
    })
})
