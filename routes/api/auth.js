const express = require("express");
const router = express.Router();

const signup = require("../../controllers/auth/signup");
const login = require("../../controllers/auth/login");
const getCurrentUser = require("../../controllers/auth/getCurrentUser");

const auth = require("../../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);

router.get("/current", auth, getCurrentUser);

module.exports = router;
