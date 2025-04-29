const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URL;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection successful'))
  .catch((error) => {
    console.error('Database connection error:', error.message);
    process.exit(1);
  });