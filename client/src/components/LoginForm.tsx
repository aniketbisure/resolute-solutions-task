'use client';
import React, { useState } from 'react';
import api from '@/utils/api';
import { encrypt } from '@/utils/crypto';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import StarBorder from './StarBorder';

interface LoginFormProps {
  onLoginSuccess: (studentId: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const encryptedEmail = encrypt(email);
      const encryptedPassword = encrypt(password);

      const response = await api.post('/login', {
        email: encryptedEmail,
        password: encryptedPassword,
      });

      toast.success('Access Granted');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('studentId', response.data.studentId);
      onLoginSuccess(response.data.studentId);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      toast.error(message);
      setError(message);
    }
  };

  return (
    <StarBorder>
      <SpotlightCard className="w-full p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-primary">Secure Access</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label>Institutional Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@university.edu"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none hover:bg-white/10 rounded-md transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} className="opacity-60" /> : <Eye size={18} className="opacity-60" />}
              </button>
            </div>
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
            >
              {error}
            </motion.p>
          )}
          <button type="submit" className="w-full py-3">Authenticate</button>
        </form>
      </SpotlightCard>
    </StarBorder>
  );
};

export default LoginForm;
