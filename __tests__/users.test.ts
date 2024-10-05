import supertest from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { createServer } from "../utils/server"
import mongoose from "mongoose"

const app = createServer()

const userPayload = {
    name: "testuser99",
    password: "Strong111",
    email: "w@l.com",
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

    describe("get users route", () => {
        describe("given the user exsits", () => {
            it("should return 200", async () => {
                const id = "67007c9405f77bd36075f876"
                await supertest(app).get(`/users/${id}`).expect(200)
            })
        })
        describe("given the user does not exsit", () => {
            it("should return 500", async () => {
                const id = "123"
                await supertest(app).get(`/users/${id}`).expect(500)
            })
        })
        describe("given the creation data is not ok", () => {
            describe("given password is not valid", () => {
                it("should return 400 and invalid password", async () => {
                    const password = "123"
                    const { statusCode, body } = await supertest(app)
                        .post(`/users/create`)
                        .send({ ...userPayload, password })
                    expect(statusCode).toBe(400)
                    expect(body).toBe("Invalid password")
                })
            })
            describe("given email is not valid", () => {
                it("should return 400 and invalid email", async () => {
                    const email = "wl.com"
                    const { statusCode, body } = await supertest(app)
                        .post(`/users/create`)
                        .send({ ...userPayload, email })
                    expect(statusCode).toBe(400)
                    expect(body).toBe("Invalid email")
                })
            })
            describe("given creation data is ok", () => {
                it("should return 200", async () => {
                    const { statusCode, body } = await supertest(app).post(`/users/create`).send(userPayload)
                    expect(statusCode).toBe(200)
                    userPayload.id = body.id
                })
            })
            describe("given user already exists", () => {
                it("should return 400 and user already exists", async () => {
                    const email = "w@ll.com"
                    const { statusCode, body } = await supertest(app)
                        .post(`/users/create`)
                        .send({ ...userPayload, email })
                    expect(statusCode).toBe(400)
                    expect(body).toBe("This name is already associated with an account")
                })
            })
            describe("given email is already in use", () => {
                it("should return 400 and email is already in use", async () => {
                    const name = "testuser999"
                    const { statusCode, body } = await supertest(app)
                        .post(`/users/create`)
                        .send({ ...userPayload, name })
                    expect(statusCode).toBe(400)
                    expect(body).toBe("This email is already associated with an account")
                })
            })
        })
        describe("given user is permitted to delete", () => {
            it("should return 200", async () => {
                const { statusCode } = await supertest(app).delete(`/users/${userPayload.id}`)
                expect(statusCode).toBe(200)
            })
        })
        describe("given user is deleted", () => {
            it("should return null in body", async () => {
                const { body } = await supertest(app).get(`/users/${userPayload.id}`)
                expect(body).toBe(null)
            })
        })
    })
})
