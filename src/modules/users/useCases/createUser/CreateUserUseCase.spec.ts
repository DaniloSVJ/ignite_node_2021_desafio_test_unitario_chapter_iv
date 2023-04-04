import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe("create User",()=>{

  beforeEach(()=>{
    usersRepositoryInMemory= new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it("should be able to create a new user",async ()=>{


    const user = await createUserUseCase.execute({
      name: "User Testd",
      email: "usertested@test.com",
      password: "123d"
    })

    expect(user).toHaveProperty("id")


  })

})
