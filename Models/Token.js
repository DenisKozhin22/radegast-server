import mongoose from 'mongoose'

const TokenShema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	refreshToken: {
		type: String,
		required: true,
	},
})

mongoose.set('strictQuery', true)
export default mongoose.model('Token', TokenShema)
