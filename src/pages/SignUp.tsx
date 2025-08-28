import React, { useState,useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { useAppDispatch } from '../hooks/customReduxHooks';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Mail, Lock, User,ArrowLeft } from 'lucide-react';
import { registerPsychologistAsync, registerUserAsync, signupUserAsync,
  resendPsychologistOtpAsync,resendUserOtpAsync, 
  signupPsychologistAsync} from '../features/authentication/authThunk';
import { removeRole, setRole } from '../features/authentication/authSlice';

const SignUp = () => {
  const navigate = useNavigate();
  const location =useLocation();
  const role=location.pathname.split('/')[1]; 
   const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const dispatch=useAppDispatch()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUpSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const {confirmPassword,...input}=formData
      if(role==="user"){
        const result=await dispatch(signupUserAsync(input)).unwrap()
      }else if(role==="psychologist"){
        const result=await dispatch(signupPsychologistAsync(input)).unwrap()
      }
      setStep("otp");
    }
  };

   const handleOtpSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
            const {confirmPassword,email,...input}=formData
    if (otp.length === 4) {
      if(role==="user"){
        const result=await dispatch(registerUserAsync({email,otp})).unwrap()
      }else if (role==="psychologist"){
        const result=await dispatch(registerPsychologistAsync({email,otp})).unwrap()
      }
      navigate('/');
    }
  };
  const handleBackToSignup = () => {
    setStep('signup');
    setOtp('');
    setCountdown(60);
    setErrors({});
  };

  const handleResendCode = async() => {
   const {confirmPassword,email,...rest}=formData
    if(role==="user"){
      const result =await dispatch(resendUserOtpAsync({email})).unwrap();
    }else if(role==="psychologist"){
      const result=await dispatch(resendPsychologistOtpAsync({email})).unwrap();
    }
    setCountdown(60);
    setOtp('');
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

   const handleGoogleAuth = () => {
    const GOOGLE_CLIENT_ID="234773295146-iq4gpjmfq765v1rojtuqjft46d3tqar4.apps.googleusercontent.com";

    // Build Google OAuth URL with state = role
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: "http://localhost:5173/auth/google/callback",
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'consent',  
      state:role    
    });

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    
    window.location.href = googleOAuthUrl;
  };

  return (step==="signup"?(
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{role==="psychologist"?"Join as Psychologist":"SignUp"}</h1>
            {role==="psychologist"?<p className="text-gray-600">Create your professional account</p>:null}
          </div>

          <form onSubmit={handleSignUpSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

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
              {role==="psychologist"?"Continue to Application":"Continue"}
            </Button>
          </form>
          
             <div className="text-center mt-3 cursor-pointer">
       <div onClick={()=>handleGoogleAuth()} className="w-full py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors duration-300">
          <span><svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="-0.5 0 48 48" version="1.1">
    
            <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                    <g id="Google" transform="translate(401.000000, 860.000000)">
                        <path
                            d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                            id="Fill-1" fill="#FBBC05"> </path>
                        <path
                            d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                            id="Fill-2" fill="#EB4335"> </path>
                        <path
                            d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                            id="Fill-3" fill="#34A853"> </path>
                        <path
                            d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                            id="Fill-4" fill="#4285F4"> </path>
                    </g>
                </g>
            </g>
        </svg>
        </span>
           <span>Continue with Google</span>
         </div>
     </div>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to={role==="psychologist"?"/psychologist/login":"/user/login"} className="text-primary-600 hover:underline font-medium">
                Sign In
              </Link>
            </p>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  ): (
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
                  value={otp[index] || ''}
                                     onChange={(e) => {
                     const newOtp = otp.split('');
                     newOtp[index] = e.target.value;
                     setOtp(newOtp.join(''));
                     
                     // Auto-focus next input
                     if (e.target.value && index < 3) {
                       const nextInput = (e.target as HTMLInputElement).parentElement?.nextElementSibling?.querySelector('input');
                       if (nextInput) nextInput.focus();
                     }
                   }}
                   onKeyDown={(e) => {
                     // Handle backspace
                     if (e.key === 'Backspace' && !otp[index] && index > 0) {
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
            disabled={otp.length !== 4}
          >
            Verify & Continue
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <button
            onClick={handleBackToSignup}
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
))
      }

export default SignUp;