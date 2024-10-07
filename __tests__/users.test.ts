import supertest from "supertest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { createServer } from "../utils/server"
import mongoose from "mongoose"

const app = createServer()

const userPayload = {
    name: "testuser99",
    password: "Strong111",
    email: "w@l.com",
    _id: null,
    nameOrEmail: "w@l.com",
    //next two fields require periodic change
    testuserId: "6702f3ca9fcea3f944c54bfa",
    testuserToken: "",
    adminToken: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDJmMzlkOWZjZWEzZjk0NGM1NGJmNiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcyODI0NjY4NSwiZXhwIjoxNzI4NTA1ODg1fQ.fT51nhLUl162VerRuSvoST2FuiiSOn8JVsTc5KBzNRA",
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

    describe("get user route", () => {
        describe("given the user exsits", () => {
            it("should return 200", async () => {
                const _id = userPayload.testuserId
                await supertest(app).get(`/users/${_id}`).expect(200)
            })
        })
        describe("given the user does not exsit", () => {
            it("should return 500", async () => {
                const _id = "123"
                await supertest(app).get(`/users/${_id}`).expect(500)
            })
        })
    })
    describe("post create user route", () => {
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
                userPayload._id = body._id
                userPayload.testuserToken = "Bearer " + body.token
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
    describe("post authorise user route", () => {
        describe("given password is not valid", () => {
            it("should return 400 and invalid data", async () => {
                const password = "123"
                const { statusCode, body } = await supertest(app)
                    .post(`/users/authorise`)
                    .send({ ...userPayload, password })
                expect(statusCode).toBe(400)
                expect(body).toBe("Invalid name, email or password")
            })
        })
        describe("given authorization data is ok", () => {
            it("should return 200", async () => {
                const { statusCode, body } = await supertest(app).post(`/users/authorise`).send(userPayload)
                expect(statusCode).toBe(200)
                userPayload._id = body._id
            })
        })
    })
    describe("put user route", () => {
        describe("given password is not valid", () => {
            it("should return 400 and invalid password", async () => {
                const password = "123"
                const { statusCode, body } = await supertest(app)
                    .put(`/users/${userPayload._id}`)
                    .set("Authorization", userPayload.testuserToken)
                    .send({ ...userPayload, password })
                expect(statusCode).toBe(400)
                expect(body).toBe("Invalid password")
            })
        })
        describe("given email is not valid", () => {
            it("should return 400 and invalid email", async () => {
                const email = "wl.com"
                const { statusCode, body } = await supertest(app)
                    .put(`/users/${userPayload._id}`)
                    .set("Authorization", userPayload.testuserToken)
                    .send({ ...userPayload, email })
                expect(statusCode).toBe(400)
                expect(body).toBe("Invalid email")
            })
        })
        describe("given creation data is ok", () => {
            it("should return 200", async () => {
                const { statusCode, body } = await supertest(app).put(`/users/${userPayload._id}`).set("Authorization", userPayload.testuserToken).send(userPayload)
                expect(statusCode).toBe(200)
                expect(userPayload.email === body.email).toBe(true)
            })
        })
    })
    describe("delete user route", () => {
        describe("given user is permitted to delete", () => {
            it("should return 200", async () => {
                const { statusCode } = await supertest(app).delete(`/users/${userPayload._id}`).set("Authorization", userPayload.adminToken)
                expect(statusCode).toBe(200)
            })
        })
        describe("given user is deleted", () => {
            it("should return null in body", async () => {
                const { body } = await supertest(app).get(`/users/${userPayload._id}`)
                expect(body).toBe(null)
            })
        })
    })
    describe("get users route", () => {
        it("should return 200 and users array", async () => {
            const { body, statusCode } = await supertest(app).get(`/users/`)
            expect(statusCode).toBe(200)
            expect(Array.isArray(body)).toBe(true)
        })
    })
})
