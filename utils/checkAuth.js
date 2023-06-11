import tokenService from '../service/tokenService.js'

export default async (req, res, next) => {
	try {
		const authorizationHeader = req.headers.authorization
		const accessToken = authorizationHeader.split(' ')[1]
		const userData = tokenService.validateAccessToken(accessToken)

		if (!accessToken || !userData) {
			res.status(401).json({
				message: 'Пользователь не авторизирован',
			})
			return
		}
		req.user = userData
		next()
	} catch (error) {
		console.log(error)
		res.json({
			message: 'Произошла ошибка',
		})
	}
}
