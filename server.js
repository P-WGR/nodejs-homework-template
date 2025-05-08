require('dotenv').config();

const connectDB = require('./db');
const app = require('./app');

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
