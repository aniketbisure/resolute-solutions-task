import mongoose from 'mongoose';
import Student from './models/Student.js';
import { encrypt as backendEncrypt } from './utils/crypto.js';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const FRONTEND_SECRET = process.env.FRONTEND_SECRET || 'xcvbhjiop';

const frontendEncrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, FRONTEND_SECRET).toString();
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_task';

const seedStudents = [
  {
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    dob: '2000-01-01',
    gender: 'Male',
    address: '123 Main St, New York',
    courseEnrolled: 'Computer Science',
    password: 'password123',
  },
  {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: '0987654321',
    dob: '1999-05-15',
    gender: 'Female',
    address: '456 Oak Ave, Los Angeles',
    courseEnrolled: 'Data Science',
    password: 'password456',
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    await Student.deleteMany({});

    for (const studentData of seedStudents) {
      const doubleEncryptedData: any = {};
      for (const key in studentData) {
        const value = (studentData as any)[key];
        const firstLevel = frontendEncrypt(value);
        const secondLevel = backendEncrypt(firstLevel);
        doubleEncryptedData[key] = secondLevel;
      }

      const student = new Student(doubleEncryptedData);
      await student.save();
    }

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seed();
