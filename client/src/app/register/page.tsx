'use client';

import StudentForm from '@/components/StudentForm';
import LightPillar from '@/components/LightPillar';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ShinyText from '@/components/ShinyText';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LightPillar 
          topColor="#EAB308"
          bottomColor="#d50021"
          intensity={0.8}
          rotationSpeed={0.2}
          pillarWidth={4}
          pillarHeight={0.3}
          glowAmount={0.002}
          noiseIntensity={0.4}
          pillarRotation={-15}
          interactive={false}
          quality="high"
        />
      </div>
      
      <div className="app-container">
        <header className="border-none mb-12">
          <div className="flex flex-col gap-4">
            <Link href="/login" className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
              <ArrowLeft size={16} /> Back to Login
            </Link>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ShinyText text="Join the Portal" className="text-4xl" />
            </motion.h1>
          </div>
        </header>

        <main className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StudentForm onSuccess={handleSuccess} onCancel={() => router.push('/login')} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
