import { Request, Response } from 'express';
import Student from '../models/Student';
import { encrypt, decrypt } from '../utils/crypto';
import CryptoJS from 'crypto-js';

export const register = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const FRONTEND_SECRET = process.env.FRONTEND_SECRET || 'xcvbhjiop';
    
    const decryptFrontend = (cipherText: string): string => {
        const bytes = CryptoJS.AES.decrypt(cipherText, FRONTEND_SECRET);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    const newPlainEmail = decryptFrontend(data.email);

    // Check for duplicates
    const allStudents = await Student.find();
    const isDuplicate = allStudents.some((s: any) => {
        try {
            const feEncEmail = decrypt(s.email);
            const sPlainEmail = decryptFrontend(feEncEmail);
            return sPlainEmail === newPlainEmail;
        } catch {
            return false;
        }
    });

    if (isDuplicate) {
        return res.status(400).json({ error: 'A student with this email is already registered.' });
    }

    // Apply 2nd level encryption to all fields
    const encryptedData: any = {};
    for (const key in data) {
      if (key === '_id') continue;
      if (typeof data[key] === 'string') {
        encryptedData[key] = encrypt(data[key]);
      } else {
        encryptedData[key] = data[key];
      }
    }

    const newStudent = new Student(encryptedData);
    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find();
    // Decrypt one level (backend's level)
    const decryptedStudents = students.map((student: any) => {
      const studentObj = student.toObject();
      const result: any = { _id: studentObj._id };
      for (const key in studentObj) {
        if (key !== '_id' && key !== '__v' && typeof studentObj[key] === 'string') {
          try {
            result[key] = decrypt(studentObj[key]);
          } catch {
            result[key] = studentObj[key];
          }
        } else if (key !== '__v') {
          result[key] = studentObj[key];
        }
      }
      return result;
    });
    res.json(decryptedStudents);
  } catch (error: any) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.email) {
        const FRONTEND_SECRET = process.env.FRONTEND_SECRET || 'xcvbhjiop';
        const decryptFrontend = (cipherText: string): string => {
            const bytes = CryptoJS.AES.decrypt(cipherText, FRONTEND_SECRET);
            return bytes.toString(CryptoJS.enc.Utf8);
        };
        const newPlainEmail = decryptFrontend(data.email);

        const allStudents = await Student.find({ _id: { $ne: id as any } });
        const isDuplicate = allStudents.some((s: any) => {
            try {
                const feEncEmail = decrypt(s.email);
                const sPlainEmail = decryptFrontend(feEncEmail);
                return sPlainEmail === newPlainEmail;
            } catch {
                return false;
            }
        });

        if (isDuplicate) {
            return res.status(400).json({ error: 'This email is already in use by another student.' });
        }
    }

    const encryptedData: any = {};
    for (const key in data) {
      if (key === '_id') continue;
      if (typeof data[key] === 'string') {
        encryptedData[key] = encrypt(data[key]);
      } else {
        encryptedData[key] = data[key];
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, encryptedData, { returnDocument: 'after' });
    if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated successfully' });
  } catch (error: any) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const loggedInStudentId = req.headers['x-logged-in-user-id'];

    if (loggedInStudentId && loggedInStudentId === id) {
      return res.status(403).json({ error: 'You are not allowed to delete your own record.' });
    }

    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // Since encryption is non-deterministic, we need to decrypt both levels to compare plain text
        const FRONTEND_SECRET = process.env.FRONTEND_SECRET || 'xcvbhjiop';
        
        const decryptFrontend = (cipherText: string): string => {
            const bytes = CryptoJS.AES.decrypt(cipherText, FRONTEND_SECRET);
            return bytes.toString(CryptoJS.enc.Utf8);
        };

        const plainEmail = decryptFrontend(email);
        const plainPassword = decryptFrontend(password);

        const students = await Student.find();
        const student = students.find((s: any) => {
            try {
                const feEncEmail = decrypt(s.email);
                const feEncPass = decrypt(s.password);
                
                const sPlainEmail = decryptFrontend(feEncEmail);
                const sPlainPass = decryptFrontend(feEncPass);
                
                return sPlainEmail === plainEmail && sPlainPass === plainPassword;
            } catch {
                return false;
            }
        });

        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', studentId: student._id });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
}
