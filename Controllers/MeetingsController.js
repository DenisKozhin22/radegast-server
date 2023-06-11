import MeetingModel from '../Models/Meeting.js'
import moment from 'moment/moment.js'

const availableTimeSlots = Array.from({ length: 9 }, (_, i) => i + 9).map(start => ({
	start,
	end: start + 1,
	clientName: '',
	clientID: '',
	email: '',
	isAvailable: true,
}))

class MeetingsController {
	async getDay(req, res) {
		try {
			const day = new Date(req.params.day)
			const meeting = await MeetingModel.findOne({ day })
			if (!meeting) {
				const doc = new MeetingModel({
					day,
					timeSlots: availableTimeSlots,
				})
				await doc.save()
				const availableSlots = doc.timeSlots
					.filter(item => item.isAvailable)
					.map(item => ({
						start: item.start,
						end: item.end,
						id: item._id,
					}))
				return res.json(availableSlots)
			}

			const availableSlots = meeting.timeSlots
				.filter(item => item.isAvailable)
				.map(item => ({
					start: item.start,
					end: item.end,
					id: item._id,
				}))

			return res.json(availableSlots)
		} catch (error) {
			console.error(error)
			res.status(500).send(error.message)
		}
	}

	async getMeetingsUser(req, res) {
		try {
			const meetings = await MeetingModel.find({
				'timeSlots.clientID': req.user.id,
			})
			const resArray = []
			for (let i = 0; i < meetings.length; i++) {
				const filterArray = meetings[i].timeSlots
					.filter(timeSlot => timeSlot.clientID === req.user.id)
					.map(timeSlot => ({
						day: moment(meetings[i].day).format('YYYY-MM-DD'),
						start: timeSlot.start,
						end: timeSlot.end,
						id: timeSlot._id,
					}))

				filterArray.forEach(item => {
					resArray.push(item)
				})
			}

			res.json(resArray)
		} catch (error) {
			console.error(error)
			res.status(500).send(error.message)
		}
	}

	async bookingMeeting(req, res) {
		try {
			const day = new Date(req.body.day)
			const meeting = await MeetingModel.findOne({ day })

			// Создание встречи, если ее не существует

			if (!meeting) {
				const doc = new MeetingModel({
					day,
					timeSlots: availableTimeSlots,
				})
				const bookedTimeSlots = req.body.timeSlots

				bookedTimeSlots.forEach(bookedTimeSlot => {
					const timeSlot = doc.timeSlots.find(timeSlot => timeSlot._id === bookedTimeSlot.id)

					timeSlot.isAvailable = false
					timeSlot.clientName = req.user.name
					timeSlot.email = req.user.email
					timeSlot.clientID = req.user.id
				})
				await doc.save()
				const availableSlots = doc.timeSlots
					.filter(item => item.isAvailable)
					.map(item => ({
						start: item.start,
						end: item.end,
						id: item._id,
					}))
				return res.json(availableSlots)
			}

			const bookedTimeSlots = req.body.timeSlots

			// Проверка на занятые промежутки

			const bookedMeetings = []
			bookedTimeSlots.forEach(bookedTimeSlot => {
				const timeSlot = meeting.timeSlots.find(
					timeSlot => timeSlot._id === bookedTimeSlot.id && !timeSlot.isAvailable,
				)
				if (timeSlot) bookedMeetings.push(timeSlot)
			})
			if (bookedMeetings.length > 0) {
				console.log(bookedMeetings)
				return res.json({
					message: 'Выбранное время уже забронировано',
				})
			}

			// Бронирование времени

			bookedTimeSlots.forEach(bookedTimeSlot => {
				const timeSlot = meeting.timeSlots.find(timeSlot => timeSlot._id == bookedTimeSlot.id)
				timeSlot.isAvailable = false
				timeSlot.clientName = req.user.name
				timeSlot.email = req.user.email
				timeSlot.clientID = req.user.id
			})
			const availableSlots = meeting.timeSlots
				.filter(item => item.isAvailable)
				.map(item => ({
					start: item.start,
					end: item.end,
					id: item._id,
				}))
			await meeting.save()
			return res.json(availableSlots)
		} catch (error) {
			console.error(error)
			res.status(500).send(error.message)
		}
	}

	async cancelBookinMeeting(req, res) {
		try {
			const day = new Date(req.body.day)
			const id = req.body.id
			await MeetingModel.findOneAndUpdate(
				{
					day,
					'timeSlots._id': id,
				},
				{
					$set: {
						'timeSlots.$.isAvailable': true,
						'timeSlots.$.clientName': '',
						'timeSlots.$.clientID': '',
						'timeSlots.$.email': '',
					},
				},
				{
					returnDocument: 'after',
				},
			)

			return res.status(200).json({
				success: true,
			})
		} catch (error) {
			console.error(error)
			res.status(500).send(error.message)
		}
	}

	async getDayAdmin(req, res) {
		try {
			const day = new Date(req.params.day)
			const meeting = await MeetingModel.findOne({ day })
			if (!meeting) {
				const doc = new MeetingModel({
					day,
					timeSlots: availableTimeSlots,
				})
				await doc.save()
				const availableSlots = doc.timeSlots.map(meeting => ({
					start: meeting.start,
					end: meeting.end,
					clientName: meeting.clientName,
					email: meeting.email,
					isAvailable: meeting.isAvailable,
				}))
				return res.json(availableSlots)
			}

			const availableSlots = meeting.timeSlots.map(meeting => ({
				start: meeting.start,
				end: meeting.end,
				clientName: meeting.clientName,
				email: meeting.email,
				isAvailable: meeting.isAvailable,
			}))

			return res.json(availableSlots)
		} catch (error) {
			console.error(error)
			res.status(500).send(error.message)
		}
	}
}

export default new MeetingsController()
