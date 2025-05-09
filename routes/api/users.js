const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");
const updateAvatar = require("../../controllers/users/updateAvatar");

router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

module.exports = router;
