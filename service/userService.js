import UserModel from '../Models/User.js'
import tokenService from './tokenService.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserDto } from '../dtos/userDto.js'

class userService {
	async register(data) {
		// User data
		const { name, email, password } = data
		const candidate = await UserModel.findOne({
			email,
		})

		// Is candidate
		if (candidate) {
			throw new Error(`Пользователь с таким почтовым адресом ${email} уже существует`)
		}

		// Hash passoword
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		// Save user model
		const doc = new UserModel({
			name,
			email,
			passwordHash: hash,
			isAdmin: false,
		})
		doc.save()
		// User DTO
		const userDto = new UserDto(doc)
		const tokens = tokenService.generateToken({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}
	async login(data) {
		const { email, password } = data

		// Find user
		const user = await UserModel.findOne({
			email,
		})

		if (!user) {
			throw new Error(`Пользователь не найден`)
		}

		// Is valid password
		const validPassword = bcrypt.compareSync(password, user.passwordHash)
		if (!validPassword) {
			res.status(400).json({
				message: 'Неверный пароль',
			})
		}

		// User DTO
		const userDto = new UserDto(user)
		const tokens = tokenService.generateToken({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}
	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}
	async refresh(refreshToken) {
		// User token
		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDB = await tokenService.findToken(refreshToken)
		if (!userData || !tokenFromDB) {
			res.status(400).json({
				message: 'Пользователь не авторизирован',
			})
		}

		const user = await UserModel.findById(userData.id)
		const userDto = new UserDto(user)
		const tokens = tokenService.generateToken({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}
	async getUser(refreshToken) {
		const userData = tokenService.validateRefreshToken(refreshToken)
		const user = await UserModel.findOne({
			_id: userData.id,
		})

		return user
	}
}

export default new userService()
