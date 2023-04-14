const router = require('express').Router();
const { 
    getUsers, 
    createUser, 
    findUser, 
    deleteUser, 
    editUser, 
    findUsersFriends, 
    requestUserFriends, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    getFriendDM, 
    sendFriendDM,
    deleteFriendDM,
    loginUser,
    verifyUser,
    findUserByEmail
} = require('../../controllers/userContoller')

/* ------------------------------- USER ROUTES ------------------------------ */

router.route('/')
    .get(getUsers)
    .post(createUser)

router.route('/login')
    .post(loginUser)

router.route('/verify')
    .get(verifyUser)
    
router.route('/email/:email')
    .post(findUserByEmail)

router.route('/:id')
    .get(findUser)
    .put(editUser)
    .delete(deleteUser)

/* ------------------------------ FRIEND ROUTES ----------------------------- */

router.route('/friends/:id')
    .get(findUsersFriends)
    .post(requestUserFriends)
    .put(acceptFriendRequest)
    .delete(rejectFriendRequest)

/* ------------------------------- CHAT ROUTES ------------------------------ */

router.route('/dm/:id')
    .get(getFriendDM)
    .post(sendFriendDM)
    .delete(deleteFriendDM)

module.exports = router