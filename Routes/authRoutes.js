import { Router } from 'express'
import { loginValidation, registerValidation } from '../validations.js'
import handleValidation from '../utils/handleValidation.js'
import checkAuth from '../utils/checkAuth.js'
import UserController from '../Controllers/UserController.js'

const authRouter = new Router()
authRouter.post('/register', registerValidation, handleValidation, UserController.register)
authRouter.post('/login', loginValidation, UserController.login)
authRouter.post('/logout', UserController.logout)
authRouter.get('/refresh', UserController.refresh)
authRouter.get('/user', checkAuth, UserController.getUser)

export default authRouter
