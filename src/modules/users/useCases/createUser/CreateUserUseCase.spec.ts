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
      name: "User Test",
      email: "userteste@test.com",
      password: "123"
    })

    expect(user).toHaveProperty("id")


  })

})
