import mongoose from 'mongoose'

const UserShema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
	},
})
mongoose.set('strictQuery', true)
export default mongoose.model('User', UserShema)
