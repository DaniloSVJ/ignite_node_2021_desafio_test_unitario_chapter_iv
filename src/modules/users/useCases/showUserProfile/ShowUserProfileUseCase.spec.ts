import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


interface IUser{
  id:string;
  name:string;
  email:string;
  password:string;

}
let userInMemoryRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("User Authenticate",()=>{

  beforeEach(()=>{
    userInMemoryRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userInMemoryRepository)
    showUserProfileUseCase = new  ShowUserProfileUseCase(userInMemoryRepository)
    authenticateUserUseCase= new  AuthenticateUserUseCase(userInMemoryRepository)

  })

  it("should be able to profile user ",async ()=>{

    const user = {


      name: "User Test",
      email: "userteste@test.com",
      password: "123"
    }

    const userC = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })


    // console.log(userC)
    const user_logged = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })


    const user_id  = user_logged.user.id as string

    const profile = await showUserProfileUseCase.execute(user_id)


    const user_p: IUser = {
      id:profile.id as string,
      email:profile.email as string,
      name:profile.name as string,
      password:user.password as string,

    }
    expect(profile).toHaveProperty("id")
    expect(profile).toHaveProperty("email")
    expect(profile).toHaveProperty("name")
    expect(profile).toHaveProperty("password")



  })
})
