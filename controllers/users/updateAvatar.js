const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const User = require('../../models/user');

const avatarsDir = path.join(__dirname, '../../public/avatars');

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path: tempUpload, originalname } = req.file;
    const { _id } = req.user;

    const ext = path.extname(originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png'];

    if (!allowedExts.includes(ext)) {
      await fs.unlink(tempUpload);
      return res.status(400).json({ message: 'Invalid file type. Only jpg, jpeg, and png are allowed.' });
    }

    const fileName = `${_id}${ext}`;
    const finalPath = path.join(avatarsDir, fileName);

    const image = await Jimp.read(tempUpload);
    await image.resize(250, 250).writeAsync(tempUpload);

    await fs.rename(tempUpload, finalPath);

    const avatarURL = `/avatars/${fileName}`;

    await User.findByIdAndUpdate(_id, { avatarURL }, { new: true });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = updateAvatar;
