const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/refresh_token', userCtrl.getAccessToken)


module.exports = router