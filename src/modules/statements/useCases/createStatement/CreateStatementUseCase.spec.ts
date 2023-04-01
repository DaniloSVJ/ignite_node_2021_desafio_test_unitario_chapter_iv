import {CreateStatementError} from "./CreateStatementError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";

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
let authenticateUserUseCase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let statementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase


describe("User balance accont",()=>{

  beforeEach(()=>{
    userInMemoryRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userInMemoryRepository)
    statementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(userInMemoryRepository,statementsRepository)
    authenticateUserUseCase = new  AuthenticateUserUseCase(userInMemoryRepository)
    getBalanceUseCase= new GetBalanceUseCase(statementsRepository,userInMemoryRepository)

  })

  it("should be able to log the deposit operation of the amount and return the deposit information",async ()=>{

    const user = {
      name: "User Test5555",
      email: "userteste5@testee.com",
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



    expect(deposit_operation).toHaveProperty("id")


  })

  it("should be able to record the withdrawal operation of the amount (if the user has a valid balance) and return the withdrawal information",async ()=>{

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


    const withdraw =   await createStatementUseCase.execute({
      user_id: user_id,
      amount: 50,
      description: "deposito",
      type: OperationType.DEPOSIT

    })
    expect(withdraw).toHaveProperty("id")


  })

  it("should be able to not withdraw if balance is insufficient",async ()=>{

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

    expect(async () => {
      await createStatementUseCase.execute({
          user_id: user_id,
          type: OperationType.WITHDRAW,
          amount: 60,
          description: "Saque $60",
      })
  }).rejects.toEqual(new CreateStatementError.InsufficientFunds())

  })

})
