'use client';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { decrypt } from '@/utils/crypto';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import SpotlightCard from './SpotlightCard';

interface StudentListProps {
  onEdit: (student: any) => void;
}

const StudentList: React.FC<StudentListProps> = ({ onEdit }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      const decryptedData = response.data.map((student: any) => {
        const result: any = { _id: student._id };
        for (const key in student) {
          if (key !== '_id' && typeof student[key] === 'string') {
            try {
              result[key] = decrypt(student[key]);
            } catch {
              result[key] = student[key];
            }
          } else {
            result[key] = student[key];
          }
        }
        return result;
      });
      setStudents(decryptedData);

      // Verify if currently logged-in student still exists
      const currentStudentId = localStorage.getItem('studentId');
      if (currentStudentId) {
        const exists = decryptedData.some((s: any) => s._id === currentStudentId);
        if (!exists) {
          toast.error('Your account has been deleted or is inactive. Session terminated.');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('studentId');
          window.location.href = '/login';
          return;
        }
      }
    } catch (err: any) {
      setError('System unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    if (typeof window !== 'undefined') {
      setCurrentStudentId(localStorage.getItem('studentId'));
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Confirm student record deletion?')) {
      try {
        await api.delete(`/student/${id}`);
        toast.success('Record revoked successfully');

        const currentStudentId = localStorage.getItem('studentId');
        if (currentStudentId === id) {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('studentId');
          toast.info('Your account has been deleted. Logging out...');
          window.location.href = '/login';
          return;
        }

        fetchStudents();
      } catch (err: any) {
        toast.error('Deletion failed');
        setError('Authorization failed or network error.');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
    </div>
  );

  return (
    <SpotlightCard className="w-full p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Encrypted Records</h2>
        {error && <span className="text-red-400 text-sm">{error}</span>}
      </div>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Identity</th>
              <th>System Email</th>
              <th>Curriculum</th>
              <th>Contact</th>
              <th className="text-right">Action Control</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <motion.tr 
                key={student._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td className="font-semibold text-indigo-600 dark:text-indigo-300">{student.fullName}</td>
                <td className="opacity-70">{student.email}</td>
                <td className="opacity-90">{student.courseEnrolled}</td>
                <td className="opacity-70">{student.phoneNumber}</td>
                <td className="text-right space-x-2">
                  <button className="edit-btn" onClick={() => onEdit(student)}>Modify</button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(student._id)}
                    disabled={student._id === currentStudentId}
                    title={student._id === currentStudentId ? "You cannot delete your own record" : ""}
                  >
                    Revoke
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </SpotlightCard>
  );
};

export default StudentList;
