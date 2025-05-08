const multer = require('multer');
const path = require('path');

const tmpDir = path.join(__dirname, '../tmp');

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname); // tymczasowa nazwa
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
