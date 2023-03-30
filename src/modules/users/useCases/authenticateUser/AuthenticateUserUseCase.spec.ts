import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"



let userInMemoryRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
describe("User Authenticate",()=>{

  beforeEach(()=>{
    userInMemoryRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userInMemoryRepository)
    authenticateUserUseCase= new  AuthenticateUserUseCase(userInMemoryRepository)

  })

  it("should be able to authenticate an user ",async ()=>{

    const user = {
      name: "User Test",
      email: "userteste@test.com",
      password: "123"
    }
   // console.log(user)
    const userC =  await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })


  //  console.log(userC)

    const user_logged = await authenticateUserUseCase.execute({
      email: userC.email,
      password: user.password
    })

    expect(user_logged).toHaveProperty("user")
    expect(user_logged).toHaveProperty("token")



  })
})
