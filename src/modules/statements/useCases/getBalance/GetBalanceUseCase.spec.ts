import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../../../users/useCases/showUserProfile/ShowUserProfileUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

interface IUser{
  id:string;
  name:string;
  email:string;
  password:string;

}

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}
let userInMemoryRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let getBalanceUseCase: GetBalanceUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let statementsRepository: InMemoryStatementsRepository


describe("User balance accont",()=>{

  beforeEach(()=>{
    userInMemoryRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userInMemoryRepository)
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(userInMemoryRepository,statementsRepository)
    authenticateUserUseCase= new  AuthenticateUserUseCase(userInMemoryRepository)
    getBalanceUseCase= new GetBalanceUseCase(statementsRepository,userInMemoryRepository)
  })

  it("should be able to see all deposit and withdrawal operations and user account balance",async ()=>{

    const user = {
      name: "User Test",
      email: "userteste@test.com",
      password: "123"
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    })


    // console.log(userC)
    const user_logged = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })
    const user_id =  user_logged.user.id as string


    await createStatementUseCase.execute({
      user_id: user_id,
      amount: 50,
      description: "deposito",
      type: OperationType.DEPOSIT

    })

    const user_balance = await getBalanceUseCase.execute(
      {user_id}
    )


    expect(user_balance).toHaveProperty("statement")
    expect(user_balance).toHaveProperty("balance")
  })

})
