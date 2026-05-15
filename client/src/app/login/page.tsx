'use client';

import LoginForm from '@/components/LoginForm';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ShinyText from '@/components/ShinyText';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="app-container flex flex-col items-center justify-center min-h-screen">
        <header className="w-full max-w-md border-none mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full"
          >
            <ShinyText text="Student Portal" className="text-5xl" />
          </motion.h1>
        </header>

        <main className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <LoginForm onLoginSuccess={handleLoginSuccess} />

            <div className="mt-8 text-center">
              <p className="text-sm opacity-60 mb-4">New student?</p>
              <Link href="/register">
                <button className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-8">
                  Create Account
                </button>
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
