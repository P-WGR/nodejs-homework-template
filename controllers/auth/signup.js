const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const User = require("../../models/user");

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const { JWT_SECRET } = process.env;  // Pamiętaj, żeby mieć zmienną JWT_SECRET w .env

const signup = async (req, res, next) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { email, password } = req.body;

    // Sprawdzamy, czy użytkownik już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Haszowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzymy nowego użytkownika
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Tworzymy token JWT
    const payload = { id: newUser._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // Zapisujemy token w bazie danych
    newUser.token = token;
    await newUser.save();

    // Zwracamy odpowiedź z tokenem i danymi użytkownika
    res.status(201).json({
      token,
      user: {
        email: newUser.email,
        subscription: newUser.subscription || "starter",  // Domyślny abonament
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = signup;
