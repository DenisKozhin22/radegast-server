export default async (req, res, next) => {
	try {
		const user = req.user

		if (!user.isAdmin) {
			return res.status(403).json({
				message: 'У вас нет доступа',
			})
		}
		next()
	} catch (error) {
		console.log(error)
		res.json({
			message: 'Произошла ошибка',
		})
	}
}
