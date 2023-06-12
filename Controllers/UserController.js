import userService from '../service/userService.js'

class UserController {
	async register(req, res, next) {
		try {
			// Get user data
			const userData = await userService.register(req.body)

			// Create token
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})
			res.cookie('accessToken', userData.accessToken, {
				maxAge: 30 * 60 * 1000,
			})

			// Return user data
			return res.json(userData)
		} catch (error) {
			console.log(error)
			res.status(400).json({
				message: 'Не удалось зарегистрироваться',
			})
		}
	}
	async login(req, res, next) {
		try {
			// Get user data
			const userData = await userService.login(req.body)

			// Create token
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			res.cookie('accessToken', userData.accessToken, {
				maxAge: 30 * 60 * 1000,
				httpOnly: true,
			})

			// Return user data
			return res.json(userData)
		} catch (error) {
			console.log(error)
			res.status(400).json({
				message: 'Не удалось войти в профиль',
			})
		}
	}
	async logout(req, res, next) {
		try {
			// Get token
			const { refreshToken } = req.cookies

			// Logout
			const token = await userService.logout(refreshToken)

			// Clear cookie
			res.clearCookie('refreshToken')
			res.clearCookie('accessToken')

			return res.status(200).json(token)
		} catch (error) {}
	}
	async refresh(req, res, next) {
		try {
			// Get refresh token
			const { refreshToken } = req.cookies

			if (!refreshToken) {
				res.status(400).json({
					message: 'Пользователь не авторизирован',
				})
			}
			// Return user token
			const userData = await userService.refresh(refreshToken)
			res.cookie('accessToken', userData.accessToken, {
				maxAge: 30 * 60 * 1000,
			})
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})
			res.json(userData)
		} catch (error) {}
	}
	async getUser(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const user = await userService.getUser(refreshToken)
			res.json(user)
		} catch (error) {
			console.log(error)
			res.status(400).json({
				message: 'не удалось загрузить профиль',
			})
		}
	}
}

export default new UserController()
