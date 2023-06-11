import { Router } from 'express'
import checkAuth from '../utils/checkAuth.js'
import MeetingsController from '../Controllers/MeetingsController.js'
import checkAdmin from '../utils/checkAdmin.js'

const meetingsRouter = new Router()

meetingsRouter.get('/days/:day', MeetingsController.getDay)
meetingsRouter.get('/admin/:day', checkAuth, checkAdmin, MeetingsController.getDayAdmin)
meetingsRouter.get('/meetings-list', checkAuth, MeetingsController.getMeetingsUser)

meetingsRouter.post('/booking-meeting', checkAuth, MeetingsController.bookingMeeting)
meetingsRouter.post('/cancel-meeting', checkAuth, MeetingsController.cancelBookinMeeting)

export default meetingsRouter
