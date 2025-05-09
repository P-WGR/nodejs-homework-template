const express = require('express');
const router = express.Router();

const signup = require('../../controllers/auth/signup');
const login = require('../../controllers/auth/login');
const getCurrentUser = require('../../controllers/auth/getCurrentUser');
const updateAvatar = require('../../controllers/users/updateAvatar');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');

router.post('/signup', signup);

router.post('/login', login);

router.get('/current', auth, getCurrentUser);

router.patch('/avatars', auth, upload.single('avatar'), updateAvatar);

module.exports = router;
