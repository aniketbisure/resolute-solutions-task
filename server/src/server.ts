import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_task';

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
    });
  })
  .catch((error) => {
  });
