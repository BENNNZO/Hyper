const router = require('express').Router();
const { getUsers, createUser, findUser, deleteUser, editUser, findUsersFriends, requestUserFriends, acceptFriendRequest, rejectFriendRequest } = require('../../controllers/userContoller')

/* ------------------------------- USER ROUTES ------------------------------ */

router.route('/')
    .get(getUsers)
    .post(createUser)

router.route('/:id')
    .get(findUser)
    .put(editUser)
    .delete(deleteUser)

/* ------------------------------ FRIEND ROUTES ----------------------------- */

router.route('/friends/:id')
    .get(findUsersFriends)

router.route('/friends/request/:id')
    .post(requestUserFriends)

router.route('/friends/request/accept/:id')
    .post(acceptFriendRequest)

router.route('/friends/request/reject/:id')
    .post(rejectFriendRequest)

module.exports = router