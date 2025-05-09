const express = require('express');
const router = express.Router();

const signup = require('../../controllers/auth/signup');
const login = require('../../controllers/auth/login');
const getCurrentUser = require('../../controllers/auth/getCurrentUser');
const updateAvatar = require('../../controllers/users/updateAvatar');
const verifyEmail = require('../../controllers/auth/verifyEmail');
const confirmEmail = require('../../controllers/auth/confirmEmail');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');

router.post('/signup', signup);
router.post('/login', login);
router.get('/current', auth, getCurrentUser);
router.patch('/avatars', auth, upload.single('avatar'), updateAvatar);

router.get('/verify/:verificationToken', confirmEmail);
router.post('/verify', verifyEmail);

module.exports = router;
