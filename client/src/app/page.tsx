'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentForm from '@/components/StudentForm';
import StudentList from '@/components/StudentList';
import ShinyText from '@/components/ShinyText';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [view, setView] = useState<'list' | 'register'>('list');
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const studentId = localStorage.getItem('studentId');
    if (!loggedIn || !studentId) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('studentId');
      router.push('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('studentId');
    setIsLoggedIn(false);
    router.push('/login');
  };

  if (isLoggedIn === null) return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="app-container">
        <header>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ShinyText text="Management Console" className="text-4xl" />
          </motion.h1>

          <motion.div
            className="nav-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button onClick={() => { setView('list'); setEditingStudent(null); }}>Records</button>
            <button onClick={() => setView('register')}>Enroll New</button>
            <button onClick={handleLogout} className="logout-btn">Sign Out</button>
          </motion.div>
        </header>

        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={view + (editingStudent ? 'edit' : 'view')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "backOut" }}
            >
              {view === 'register' || editingStudent ? (
                <div className="max-w-3xl mx-auto">
                  <StudentForm
                    student={editingStudent}
                    onSuccess={() => {
                      setView('list');
                      setEditingStudent(null);
                    }}
                    onCancel={() => {
                      setView('list');
                      setEditingStudent(null);
                    }}
                  />
                </div>
              ) : (
                <StudentList onEdit={(student) => setEditingStudent(student)} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
