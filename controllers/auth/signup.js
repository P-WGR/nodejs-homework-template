const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const User = require("../../models/user");
const sendVerificationEmail = require("../../services/email");

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const { JWT_SECRET } = process.env;

const signup = async (req, res, next) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
    const verificationToken = nanoid();

    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription || "starter",
        avatarURL: newUser.avatarURL,
      },
      message: "Verification email sent",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = signup;
