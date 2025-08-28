import React, { useState,useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { useAppDispatch } from '../hooks/customReduxHooks';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Mail, Lock, User,ArrowLeft } from 'lucide-react';

import { forgotPasswordPsych, forgotPasswordUser, resendOtpResetPsych, resendOtpResetUser, resetPasswordPsych, resetPasswordUser } from '../services/authService';

interface ForgotPasswordProps{
    role:string
}
const ForgotPassword :React.FC<ForgotPasswordProps>=({role}) => {
  const navigate = useNavigate();
   const [step, setStep] = useState<'email' | 'otp'|'password'>('email');
  const [countdown, setCountdown] = useState(60);
  const dispatch=useAppDispatch()
  const [formData, setFormData] = useState({
    otp:'',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if(step==='email'){
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    }else if(step==='password'){
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
    }else if (step==="otp"){
        if (!formData.otp) newErrors.otp = 'Otp is Required ';
        if(formData.otp.length !==4){
            newErrors.otp='Enter complete OTP'
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const {email}=formData
      if(role==="user"){
        const result=await forgotPasswordUser({email})
      }else if(role==="psychologist"){
        const result=await forgotPasswordPsych({email})
      }
      setStep("otp");
    }
  };

  const handleResetPassword = async(e: React.FormEvent) => {
    e.preventDefault();
    try{
    if (validateForm()) {
      const {password,otp,email}=formData
      if(role==="user"){
        const result=await resetPasswordUser({email,password,otp})
      navigate("/user/login")

      }else if(role==="psychologist"){
        const result=await resetPasswordPsych({email,password,otp})
      navigate("/psychologist/login")

      }
    }
    }catch(error){

    }
    
  };

   const handleOtpSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
            const {email,otp}=formData
    if (otp.length === 4) {
      setStep("password")
    }
  };
  const handleBackToEmailSection = () => {
    setStep('email');
    setFormData({otp:"",
        email:"",
        password:"",
        confirmPassword:""
    });
    setCountdown(60);
    setErrors({});
  };
  const handleBackToOtpSection = () => {
    setStep('otp');
    setFormData({...formData,otp:"",password:"",confirmPassword:"" });
    setCountdown(60);
    setErrors({});
  };

  const handleResendCode = async() => {
   const {email,...rest}=formData;
   console.log("inside resend code handler",email)
   try{
    if(role==="user"){
      const result =await resendOtpResetUser({email});
    }else if(role==="psychologist"){
      const result=await resendOtpResetPsych({email});
    }
    setCountdown(60);
    setFormData({otp:"",
        email:formData.email,
        password:"",
        confirmPassword:""
    });
    setErrors({})
}catch(error){

}
  };
// Countdown timer effect
  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

/*   useEffect(() => {
  dispatch(setRole(role));
  return () => {
    dispatch(removeRole());
  };
}, [role, dispatch]); */


  return (step==="email"?(
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Enter Your Email</h1>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Proceed with Otp Verification
            </Button>
          </form>
          
        
          <div className="mt-6 text-center space-y-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  ):step==="otp"? (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <Card className="p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            Enter the 4-digit code sent to your email
          </p>
          <div className="mt-4 text-sm text-gray-600">
            {countdown > 0 ? (
              <span>Code expires in {countdown}s</span>
            ) : (
              <span className="text-red-600">Code expired</span>
            )}
          </div>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={formData.otp[index] || ''}
                  onChange={(e) => {
                    const newOtp = formData.otp.split('');
                    newOtp[index] = e.target.value;
                    handleInputChange('otp', newOtp.join(''));
                    
                    // Auto-focus next input
                    if (e.target.value && index < 3) {
                      const nextInput = (e.target as HTMLInputElement).parentElement?.nextElementSibling?.querySelector('input');
                      if (nextInput) nextInput.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    // Handle backspace
                    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
                      const prevInput = (e.target as HTMLInputElement).parentElement?.previousElementSibling?.querySelector('input');
                      if (prevInput) prevInput.focus();
                    }
                  }}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-lg font-semibold"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={formData.otp.length !== 4}
          >
            Verify & Continue
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <button
            onClick={handleBackToEmailSection}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Sign Up
          </button>
          <p className="text-sm text-gray-600">
            Didn't receive code?{' '}
            <button
              onClick={handleResendCode}
              disabled={countdown > 0}
              className="text-primary-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  </div>
):(
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create password"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Proceed with Password Reset
            </Button>
          </form>
          
        
          <div className="mt-6 text-center space-y-4">
             <button
            onClick={handleBackToOtpSection}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to OTP section
          </button>
             
          </div>
        </Card>
      </div>
    </div>
)
)
      }

export default ForgotPassword;