import { body } from 'express-validator'

export const registerValidation = [
	body('name', 'Имя не может быть короче 3 символов').isLength({
		min: 3,
	}),
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть минимум 5 символов').isLength({
		min: 5,
	}),
]

export const loginValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть минимум 5 символов').isLength({
		min: 5,
	}),
]
