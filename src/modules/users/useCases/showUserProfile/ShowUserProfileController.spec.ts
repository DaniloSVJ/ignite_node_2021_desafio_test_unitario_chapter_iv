import "reflect-metadata"
import request from 'supertest'
import createConnection from "../../../../database"
import { Connection } from "typeorm"
import {hash} from "bcrypt"
import {v4 as uuidV4} from "uuid"
import { app } from "../../../../app"
let connection: Connection


describe("Create User Controller", ()=>{
    beforeAll(async()=>{
        connection = await createConnection()
        await connection.runMigrations()
        const id = uuidV4()
        const password= await hash('admin',5)
        await connection.query(`
        INSERT INTO USERS(id,name,email,password,created_at,updated_at)
        VALUES ('${id}','admin','admin@fin_api.com','${password}', 'now()','now()')
        `)
    })
    afterAll(async()=>{
        await connection.dropDatabase()
        await connection.close()

    })
    it("should be able to authenticate user ",async()=>{


        const responseToken = await request(app).post("/api/v1/sessions").send({


          email: "admin@fin_api.com",
          password: "admin"
          })
        const {token} = responseToken.body
        const response = await request(app)
          .get("/api/v1/profile")
          .set({
            Authorization: `Bearer ${token}`
          })


        console.log(response.body)
        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("name")
        expect(response.body).toHaveProperty("email")

    })
    // it("should not be able to create a new category with name exists",async()=>{
    //     const responseToken = await request(app).post("/sessions")
    //     .send({
    //         email:"admin@rentx22.com",
    //         password: "admin"
    //     })
    //     const {token} = responseToken.body


    //     const response = await request(app).post("/categories").send({
    //         name: "Category Supertest",
    //         description: "Category Supertest"
    //     })
    //     .set({
    //         Authorization: `Bearer ${token}`
    //     })
    //     expect(response.status).toBe(400)
    // })

})
