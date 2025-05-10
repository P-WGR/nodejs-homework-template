const User = require("../../models/user");
const sendVerificationEmail = require("../../services/email");

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    
    if (!verificationToken) {
      return res.status(400).json({ message: "missing required field verificationToken" });
    }

    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res.status(400).json({ message: "Verification has already been passed" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Verification successful" });
  } catch (err) {
    next(err);
  }
};

module.exports = verifyEmail;
