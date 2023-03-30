import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";



enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


let userInMemoryRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let statementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("User balance accont",()=>{

  beforeEach(()=>{
    userInMemoryRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userInMemoryRepository)
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(userInMemoryRepository,statementsRepository)
    authenticateUserUseCase = new  AuthenticateUserUseCase(userInMemoryRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(userInMemoryRepository,statementsRepository)

  })

  it("should be able to return the found deposit operation information",async ()=>{

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


    const deposit_operation = await createStatementUseCase.execute({
      user_id: user_id,
      amount: 50,
      description: "deposito",
      type: OperationType.DEPOSIT

    })
    const statement_id = deposit_operation.id as string
    const operation = await getStatementOperationUseCase.execute({user_id,statement_id})



    expect(operation).toHaveProperty("id")


  })

  it("should be able to return the found withdrawal operation information",async ()=>{

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
    const withdraw =   await createStatementUseCase.execute({
      user_id: user_id,
      amount: 41,
      description: "saque",
      type: OperationType.WITHDRAW

    })
    const statement_id = withdraw.id as string
    const operation = await getStatementOperationUseCase.execute({user_id,statement_id})




    expect(operation).toHaveProperty("id")


  })



})
