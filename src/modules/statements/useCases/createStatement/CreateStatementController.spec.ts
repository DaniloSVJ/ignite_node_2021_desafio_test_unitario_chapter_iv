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
        const id = uuidV4();
        const password = await hash("admin", 8);

        await connection.query(
          `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
          values('${id}', 'admin', 'admin1@finapi.com.br', '${password}', 'now()', 'now()')`
        );
    })
    afterAll(async()=>{
        await connection.dropDatabase()
        await connection.close()

    })
    it("should be able to create deposit statement ",async()=>{


        const responseToken = await request(app).post("/api/v1/sessions").send({

          email: "admin1@finapi.com.br",
          password: "admin"
          })
        const {token} = responseToken.body
        const response = await request(app)
          .post("/api/v1/statements/deposit")
          .send({
            amount:50,
            description: "deposito"
          })
          .set({
            Authorization: `Bearer ${token}`
          })


        console.log(response.body)
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id");
        expect(response.body.amount).toBe(50);
        // expect(response.body).toHaveProperty("balance")
        // expect(response.body).toHaveProperty("email")

    })
    it("should be able to create withdraw statement ",async()=>{
      await request(app).post("/api/v1/users/").send({
        name: "Test",
        email: "usertest@fin_api.com",
        password: "123"
    })





      const responseToken = await request(app).post("/api/v1/sessions").send({

        email:'usertest@fin_api.com',
        password: "123"
        })


      const {token} = responseToken.body
      console.log('Token: =>>'+token)
      await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount:50,
        description: "deposito"
      })
      .set({
        Authorization: `Bearer ${token}`
      })
      const response = await request(app)
        .post("/api/v1/statements/withdraw")
        .send({
          amount:45,
          description: "deposito"
        })
        .set({
          Authorization: `Bearer ${token}`
        })

      console.log(response.body)
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty("id");
      expect(response.body.amount).toBe(45);
      // expect(response.body).toHaveProperty("balance")
      // expect(response.body).toHaveProperty("email")

  })
  it("should be able to create withdraw statement without balance",async()=>{


    const responseToken = await request(app).post("/api/v1/sessions").send({

      email: "admin1@finapi.com.br",
      password: "admin"
      })
    const {token} = responseToken.body

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount:520,
        description: "deposito"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    console.log(response.body)
    expect(response.status).toBe(400)

    // expect(response.body).toHaveProperty("balance")
    // expect(response.body).toHaveProperty("email")

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
