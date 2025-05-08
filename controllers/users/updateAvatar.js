const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

const User = require('../../models/user');

const avatarsDir = path.join(__dirname, '../../public/avatars');

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    const { _id } = req.user;

    const ext = path.extname(originalname);
    const fileName = `${_id}${ext}`;
    const finalPath = path.join(avatarsDir, fileName);

    const image = await Jimp.read(tempUpload);
    await image.resize(250, 250).writeAsync(tempUpload);

    await fs.rename(tempUpload, finalPath);

    const avatarURL = `/avatars/${fileName}`;

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = updateAvatar;
