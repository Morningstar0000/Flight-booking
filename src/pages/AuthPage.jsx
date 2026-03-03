// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//     Mail,
//     Lock,
//     User,
//     Phone,
//     Eye,
//     EyeOff,
//     Plane,
//     Calendar,
//     MapPin,
//     CheckCircle,
//     AlertCircle,
//     ArrowRight,
//     Facebook,
//     Twitter,
//     Github,
//     Hotel
// } from 'lucide-react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';

// export default function AuthPage() {
//     const navigate = useNavigate();
//     const [isLogin, setIsLogin] = useState(true);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(false);

//     // Form data state
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//         confirmPassword: '',
//         firstName: '',
//         lastName: '',
//         phone: '',
//         agreeToTerms: false
//     });

//     // Error state
//     const [errors, setErrors] = useState({});

//     // Password strength indicators
//     const getPasswordStrength = (password) => {
//         let strength = 0;
//         if (password.length >= 8) strength++;
//         if (/[A-Z]/.test(password)) strength++;
//         if (/[0-9]/.test(password)) strength++;
//         if (/[^A-Za-z0-9]/.test(password)) strength++;
//         return strength;
//     };

//     const passwordStrength = getPasswordStrength(formData.password);

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.email) {
//             newErrors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = 'Email is invalid';
//         }

//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 8 && !isLogin) {
//             newErrors.password = 'Password must be at least 8 characters';
//         }

//         if (!isLogin) {
//             if (!formData.firstName) {
//                 newErrors.firstName = 'First name is required';
//             }
//             if (!formData.lastName) {
//                 newErrors.lastName = 'Last name is required';
//             }
//             if (formData.password !== formData.confirmPassword) {
//                 newErrors.confirmPassword = 'Passwords do not match';
//             }
//             if (!formData.agreeToTerms) {
//                 newErrors.agreeToTerms = 'You must agree to the terms';
//             }
//         }

//         return newErrors;
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//         // Clear error for this field
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const newErrors = validateForm();
//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors);
//             return;
//         }

//         setLoading(true);

//         // Simulate API call
//         setTimeout(() => {
//             setLoading(false);
//             setSuccess(true);

//             // Redirect after successful auth
//             setTimeout(() => {
//                 navigate('/');
//             }, 2000);
//         }, 1500);
//     };

//     // Benefits for the left panel
//     const benefits = [
//         { icon: <Plane className="w-5 h-5" />, text: 'Book flights to 500+ destinations' },
//         { icon: <Hotel className="w-5 h-5" />, text: 'Access exclusive hotel deals' },
//         { icon: <Calendar className="w-5 h-5" />, text: 'Manage your bookings easily' },
//         { icon: <MapPin className="w-5 h-5" />, text: 'Track flights in real-time' }
//     ];

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* <Header /> */}

//             <div className="max-w-7xl mx-auto px-4 py-20">
//                 {/* Back Button */}
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors group"
//                 >
//                     <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
//                     <span className="font-medium">Back</span>
//                 </button>

//                 {/* Main Auth Card */}
//                 <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
//                         {/* Left Panel - Branding & Benefits */}
//                         <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 text-white flex flex-col">
//                             {/* Logo */}
//                             <div className="flex items-center gap-3 mb-12">
//                                 <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
//                                     <Plane className="w-6 h-6 text-white" />
//                                 </div>
//                                 <span className="text-2xl font-bold">SkyWings</span>
//                             </div>

//                             {/* Headline */}
//                             <h2 className="text-3xl lg:text-4xl font-bold mb-6">
//                                 {isLogin ? 'Welcome Back!' : 'Join Our Community'}
//                             </h2>
//                             <p className="text-white/80 mb-8 text-lg">
//                                 {isLogin
//                                     ? 'Sign in to access your bookings and exclusive deals'
//                                     : 'Create an account to start your journey with us'}
//                             </p>

//                             {/* Benefits List */}
//                             <div className="space-y-4 mb-12">
//                                 {benefits.map((benefit, idx) => (
//                                     <div key={idx} className="flex items-center gap-3">
//                                         <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                                             {benefit.icon}
//                                         </div>
//                                         <span className="text-white/90">{benefit.text}</span>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Testimonial */}
//                             <div className="mt-auto">
//                                 <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
//                                     <p className="text-white/90 italic mb-4">
//                                         "SkyWings made my travel planning so easy. The best flight deals and amazing customer support!"
//                                     </p>
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//                                             <User className="w-5 h-5" />
//                                         </div>
//                                         <div>
//                                             <p className="font-semibold">Sarah Johnson</p>
//                                             <p className="text-sm text-white/60">Frequent Traveler</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Right Panel - Forms */}
//                         <div className="p-8 lg:p-12 bg-white">
//                             {/* Success Message */}
//                             {success && (
//                                 <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 animate-fadeIn">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                                             <CheckCircle className="w-5 h-5 text-green-600" />
//                                         </div>
//                                         <div>
//                                             <p className="font-semibold text-green-800">
//                                                 {isLogin ? 'Login Successful!' : 'Account Created!'}
//                                             </p>
//                                             <p className="text-sm text-green-600">
//                                                 Redirecting you to the homepage...
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Toggle Buttons */}
//                             <div className="flex gap-4 mb-8 p-1 bg-gray-100 rounded-2xl">
//                                 <button
//                                     onClick={() => setIsLogin(true)}
//                                     className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isLogin
//                                             ? 'bg-white shadow-md text-blue-600'
//                                             : 'text-gray-500 hover:text-gray-700'
//                                         }`}
//                                 >
//                                     Login
//                                 </button>
//                                 <button
//                                     onClick={() => setIsLogin(false)}
//                                     className={`flex-1 py-3 rounded-xl font-semibold transition-all ${!isLogin
//                                             ? 'bg-white shadow-md text-blue-600'
//                                             : 'text-gray-500 hover:text-gray-700'
//                                         }`}
//                                 >
//                                     Sign Up
//                                 </button>
//                             </div>

//                             <form onSubmit={handleSubmit} className="space-y-5">
//                                 {!isLogin && (
//                                     <div className="grid grid-cols-2 gap-4">
//                                         {/* First Name */}
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 First Name
//                                             </label>
//                                             <div className="relative">
//                                                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                                 <input
//                                                     type="text"
//                                                     name="firstName"
//                                                     value={formData.firstName}
//                                                     onChange={handleChange}
//                                                     className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.firstName
//                                                             ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                             : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
//                                                         }`}
//                                                     placeholder="John"
//                                                 />
//                                             </div>
//                                             {errors.firstName && (
//                                                 <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                                     <AlertCircle size={12} />
//                                                     {errors.firstName}
//                                                 </p>
//                                             )}
//                                         </div>

//                                         {/* Last Name */}
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Last Name
//                                             </label>
//                                             <div className="relative">
//                                                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                                 <input
//                                                     type="text"
//                                                     name="lastName"
//                                                     value={formData.lastName}
//                                                     onChange={handleChange}
//                                                     className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.lastName
//                                                             ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                             : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
//                                                         }`}
//                                                     placeholder="Doe"
//                                                 />
//                                             </div>
//                                             {errors.lastName && (
//                                                 <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                                     <AlertCircle size={12} />
//                                                     {errors.lastName}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Email */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Email Address
//                                     </label>
//                                     <div className="relative">
//                                         <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.email
//                                                     ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                     : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
//                                                 }`}
//                                             placeholder="you@example.com"
//                                         />
//                                     </div>
//                                     {errors.email && (
//                                         <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                             <AlertCircle size={12} />
//                                             {errors.email}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Password */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Password
//                                     </label>
//                                     <div className="relative">
//                                         <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                         <input
//                                             type={showPassword ? 'text' : 'password'}
//                                             name="password"
//                                             value={formData.password}
//                                             onChange={handleChange}
//                                             className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.password
//                                                     ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                     : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
//                                                 }`}
//                                             placeholder="••••••••"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowPassword(!showPassword)}
//                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                         >
//                                             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                                         </button>
//                                     </div>
//                                     {errors.password && (
//                                         <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                             <AlertCircle size={12} />
//                                             {errors.password}
//                                         </p>
//                                     )}

//                                     {/* Password Strength Indicator (for signup) */}
//                                     {!isLogin && formData.password && (
//                                         <div className="mt-2">
//                                             <div className="flex gap-1 mb-1">
//                                                 {[1, 2, 3, 4].map((level) => (
//                                                     <div
//                                                         key={level}
//                                                         className={`h-1 flex-1 rounded-full transition-all ${level <= passwordStrength
//                                                                 ? level === 1
//                                                                     ? 'bg-red-500'
//                                                                     : level === 2
//                                                                         ? 'bg-yellow-500'
//                                                                         : level === 3
//                                                                             ? 'bg-blue-500'
//                                                                             : 'bg-green-500'
//                                                                 : 'bg-gray-200'
//                                                             }`}
//                                                     />
//                                                 ))}
//                                             </div>
//                                             <p className="text-xs text-gray-500">
//                                                 Password strength: {
//                                                     passwordStrength === 4 ? 'Weak' :
//                                                         passwordStrength === 6 ? 'Fair' :
//                                                             passwordStrength === 8 ? 'Good' :
//                                                                 passwordStrength === 10 ? 'Strong' : ''
//                                                 }
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Confirm Password (for signup) */}
//                                 {!isLogin && (
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Confirm Password
//                                         </label>
//                                         <div className="relative">
//                                             <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                             <input
//                                                 type={showConfirmPassword ? 'text' : 'password'}
//                                                 name="confirmPassword"
//                                                 value={formData.confirmPassword}
//                                                 onChange={handleChange}
//                                                 className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${errors.confirmPassword
//                                                         ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                         : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
//                                                     }`}
//                                                 placeholder="••••••••"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                             >
//                                                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                                             </button>
//                                         </div>
//                                         {errors.confirmPassword && (
//                                             <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//                                                 <AlertCircle size={12} />
//                                                 {errors.confirmPassword}
//                                             </p>
//                                         )}
//                                     </div>
//                                 )}

//                                 {/* Phone (optional for signup) */}
//                                 {!isLogin && (
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Phone Number <span className="text-gray-400">(optional)</span>
//                                         </label>
//                                         <div className="relative">
//                                             <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                             <input
//                                                 type="tel"
//                                                 name="phone"
//                                                 value={formData.phone}
//                                                 onChange={handleChange}
//                                                 className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
//                                                 placeholder="+1 (555) 123-4567"
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Remember Me / Terms */}
//                                 <div className="flex items-center justify-between">
//                                     {isLogin ? (
//                                         <label className="flex items-center gap-2">
//                                             <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                                             <span className="text-sm text-gray-600">Remember me</span>
//                                         </label>
//                                     ) : (
//                                         <label className="flex items-center gap-2">
//                                             <input
//                                                 type="checkbox"
//                                                 name="agreeToTerms"
//                                                 checked={formData.agreeToTerms}
//                                                 onChange={handleChange}
//                                                 className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                                             />
//                                             <span className="text-sm text-gray-600">
//                                                 I agree to the{' '}
//                                                 <a href="#" className="text-blue-600 hover:underline">Terms</a>
//                                                 {' '}and{' '}
//                                                 <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
//                                             </span>
//                                         </label>
//                                     )}

//                                     {isLogin && (
//                                         <a href="#" className="text-sm text-blue-600 hover:underline">
//                                             Forgot password?
//                                         </a>
//                                     )}
//                                 </div>

//                                 {!isLogin && errors.agreeToTerms && (
//                                     <p className="text-red-500 text-xs flex items-center gap-1">
//                                         <AlertCircle size={12} />
//                                         {errors.agreeToTerms}
//                                     </p>
//                                 )}

//                                 {/* Submit Button */}
//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                                             {isLogin ? 'LOGGING IN...' : 'CREATING ACCOUNT...'}
//                                         </>
//                                     ) : (
//                                         <>
//                                             {isLogin ? 'LOG IN' : 'SIGN UP'}
//                                             <ArrowRight className="w-5 h-5" />
//                                         </>
//                                     )}
//                                 </button>

                                            
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer/>
//         </div>
//     );
// }