'use client';
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { encrypt } from '@/utils/crypto';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Check, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import StarBorder from './StarBorder';

interface StudentFormProps {
  student?: any;
  onSuccess: () => void;
  onCancel?: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = student ? 2 : 3;
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+91',
    dob: '',
    gender: '',
    address: '',
    courseEnrolled: '',
    password: '',
  });

  const countryCodes = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+61', name: 'Australia' },
    { code: '+86', name: 'China' },
    { code: '+971', name: 'UAE' },
    { code: '+81', name: 'Japan' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+7', name: 'Russia' },
  ];

  useEffect(() => {
    if (student) {
      let pNumber = student.phoneNumber || '';
      let cCode = '+91';

      for (const cc of countryCodes) {
        if (pNumber.startsWith(cc.code)) {
          cCode = cc.code;
          pNumber = pNumber.replace(cc.code, '');
          break;
        }
      }

      setFormData({
        ...student,
        phoneNumber: pNumber,
        countryCode: cCode,
        password: '',
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    // Basic validation before moving to next step
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.dob || !formData.gender) {
        toast.error('Please fill all required personal details');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.phoneNumber || !formData.address || !formData.courseEnrolled) {
        toast.error('Please fill all contact and course details');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student && !formData.password) {
      toast.error('Password is required');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(student ? 'Updating profile on Render server...' : 'Enrolling student on Render server...');

    try {
      const encryptedData: any = {};
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
      const dataToProcess = { ...formData, phoneNumber: fullPhoneNumber };
      delete (dataToProcess as any).countryCode;

      for (const key in dataToProcess) {
        if (key === '_id') continue;
        const value = (dataToProcess as any)[key];
        if (key !== 'password' && typeof value === 'string') {
          encryptedData[key] = encrypt(value);
        } else if (key === 'password' && value) {
          encryptedData[key] = encrypt(value);
        } else {
          encryptedData[key] = value;
        }
      }

      if (student) {
        await api.put(`/student/${student._id}`, encryptedData);
        toast.success('Profile updated successfully', { id: toastId });
      } else {
        await api.post('/register', encryptedData);
        toast.success('Enrollment successful', { id: toastId });
      }
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Operation failed';
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: 'Identity' },
    { id: 2, label: 'Enrollment' },
    ...(!student ? [{ id: 3, label: 'Security' }] : []),
  ];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <StarBorder>
      <SpotlightCard className="w-full p-8 overflow-hidden">
        <h2 className="text-2xl font-bold mb-8 text-center">{student ? 'Update Profile' : 'New Enrollment'}</h2>
        
        <div className="step-indicator">
          <div className="step-progress-bar" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} />
          {steps.map((step) => (
            <div key={step.id} className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
              <div className="step-circle">
                {currentStep > step.id ? <Check size={18} /> : step.id}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative min-h-[350px]" onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {currentStep === 1 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input name="dob" type="date" value={formData.dob} onChange={handleChange} required disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required className="appearance-none" disabled={isSubmitting}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="flex gap-2">
                      <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="!w-24 shrink-0" disabled={isSubmitting}>
                        {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                      </select>
                      <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="9876543210" className="flex-1 min-w-0" disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Enrolled Course</label>
                    <input name="courseEnrolled" value={formData.courseEnrolled} onChange={handleChange} required placeholder="Computer Science" disabled={isSubmitting} />
                  </div>
                  <div className="form-group full-width">
                    <label>Permanent Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} placeholder="Full street address..." disabled={isSubmitting} />
                  </div>
                </div>
              )}

              {currentStep === 3 && !student && (
                <div className="max-w-md mx-auto py-8">
                  <div className="form-group">
                    <label>Account Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                        className="pr-12"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none hover:bg-white/10 rounded-md transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff size={18} className="opacity-60" /> : <Eye size={18} className="opacity-60" />}
                      </button>
                    </div>
                    <p className="text-xs opacity-50 mt-2">Choose a strong password to protect your account.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/5">
            {currentStep > 1 ? (
              <button type="button" onClick={prevStep} className="cancel-btn flex items-center gap-2" disabled={isSubmitting}>
                <ArrowLeft size={18} /> Back
              </button>
            ) : (
              onCancel ? <button type="button" onClick={onCancel} className="cancel-btn" disabled={isSubmitting}>Discard</button> : <div />
            )}

            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} className="flex items-center gap-2" disabled={isSubmitting}>
                Next Step <ArrowRight size={18} />
              </button>
            ) : (
              <button type="submit" className="px-10 bg-green-600 hover:bg-green-500 flex items-center gap-2 justify-center" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    {student ? 'Saving...' : 'Enrolling...'}
                  </>
                ) : (
                  student ? 'Save Changes' : 'Complete Enrollment'
                )}
              </button>
            )}
          </div>
        </form>
      </SpotlightCard>
    </StarBorder>
  );
};

export default StudentForm;
