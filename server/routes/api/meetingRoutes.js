const router = require('express').Router()
const { getToken, createMeeting, validateMeeting } = require('../../controllers/meetingController')

router.route('/get-token')
    .get(getToken)

router.route('/create-meeting')
    .post(createMeeting)

router.route('/validate-meeting/:meetingId')
    .post(validateMeeting)

module.exports = router