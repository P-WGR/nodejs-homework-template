require('dotenv').config();

const connectDB = require('./db');
connectDB();

const express = require('express');
const app = express();

app.use(express.json());

const contactsRouter = require('./routes/api/contacts');
app.use('/api/contacts', contactsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Contacts API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});

module.exports = app;
