import mongoose from 'mongoose'

const MeetingShema = new mongoose.Schema({
	day: Date,
	timeSlots: [
		{
			start: Number,
			end: Number,
			clientName: String,
			clientID: String,
			email: String,
			isAvailable: Boolean,
		},
	],
})

mongoose.set('strictQuery', true)
export default mongoose.model('Meeting', MeetingShema)
