require("dotenv").config();

const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

const usersRouter = require('./routes/api/users');
const contactsRouter = require('./routes/api/contacts');
const authRouter = require('./routes/api/auth');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
