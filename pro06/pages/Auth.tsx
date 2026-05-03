
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { Facebook, Linkedin, Briefcase, Loader2, Eye, EyeOff } from 'lucide-react';

export const AuthPage: React.FC = () => {
    const [isActive, setIsActive] = useState(false); // Controls the sliding state
    const { login, register } = useAuth();
    const navigate = useNavigate();
    
    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [showLoginPass, setShowLoginPass] = useState(false);
    const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
    
    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [showRegPass, setShowRegPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(loginEmail, role, loginPass);
        setIsLoading(false);
        if (success) {
            navigate('/dashboard');
        } else {
            alert("Login Failed. Please check your credentials.");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const [firstName, ...lastNameParts] = regName.split(' ');
        const lastName = lastNameParts.join(' ') || 'User';
        
        const success = await register({
            firstName,
            lastName,
            email: regEmail,
            password: regPass
        });
        setIsLoading(false);

        if (success) {
            navigate('/dashboard');
        } else {
            alert("Registration failed. Email might be in use.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className={`auth-container ${isActive ? 'active' : ''}`} id="container">
                {/* Sign Up Form (Register) */}
                <div className="form-container sign-up">
                    <form onSubmit={handleRegister}>
                        <h1 className="font-serif text-3xl font-bold mb-4 text-slate-900">Create Account</h1>
                        <div className="social-icons">
                            <a href="#" className="icon"><Briefcase size={16}/></a>
                            <a href="#" className="icon"><Facebook size={16}/></a>
                            <a href="#" className="icon"><Linkedin size={16}/></a>
                        </div>
                        <span className="text-slate-400 mb-4">or use your email for registration</span>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            required
                        />
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            required
                        />
                        <div className="relative w-full">
                            <input 
                                type={showRegPass ? "text" : "password"} 
                                placeholder="Password" 
                                value={regPass}
                                onChange={(e) => setRegPass(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowRegPass(!showRegPass)}
                                className="absolute btn right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showRegPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <button type="submit" disabled={isLoading} className="flex cls items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                {/* Sign In Form (Login) */}
                <div className="form-container sign-in">
                    <form onSubmit={handleLogin}>
                        <h1 className="font-serif text-3xl font-bold mb-4 text-slate-900">Sign In</h1>
                        <div className="social-icons">
                            <a href="#" className="icon"><Briefcase size={16}/></a>
                            <a href="#" className="icon"><Facebook size={16}/></a>
                            <a href="#" className="icon"><Linkedin size={16}/></a>
                        </div>
                        <span className="text-slate-400 mb-4">or use your email password</span>
                        
                        {/* Role Switcher */}
                        <div className="flex bg-slate-100 p-1 rounded-lg mb-4 w-full">
                            <button 
                                type="button" 
                                onClick={() => setRole(UserRole.CUSTOMER)}
                                className={`!m-0 !py-2 !px-0 flex-1 cls rounded text-[10px] uppercase font-bold transition-all ${role === UserRole.CUSTOMER ? '!bg-white !text-blue-600 shadow-sm' : '!bg-transparent !text-slate-500'}`}
                            >
                                Customer
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setRole(UserRole.EMPLOYEE)}
                                className={`!m-0 !py-2 !px-0 flex-1 cls rounded text-[10px] uppercase font-bold transition-all ${role === UserRole.EMPLOYEE ? '!bg-white !text-blue-600 shadow-sm' : '!bg-transparent !text-slate-500'}`}
                            >
                                Employee
                            </button>
                        </div>

                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                        <div className="relative w-full">
                            <input 
                                type={showLoginPass ? "text" : "password"} 
                                placeholder="Password" 
                                value={loginPass}
                                onChange={(e) => setLoginPass(e.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowLoginPass(!showLoginPass)}
                                className="absolute right-3 top-1/2 btn -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <a href="#" className="text-slate-400 hover:text-blue-600">Forget Your Password?</a>
                        <button type="submit" disabled={isLoading} className="flex cls items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Toggle Overlay */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                            <p className="mb-8 text-blue-100">Enter your personal details to use all of site features</p>
                            <button 
                                className="ghost cls" 
                                id="login" 
                                onClick={() => setIsActive(false)}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1 className="text-3xl font-bold mb-2">Hello, Traveler!</h1>
                            <p className="mb-8 text-blue-100">Register with your personal details to start your journey with Odyssey</p>
                            <button 
                                className="ghost cls" 
                                id="register" 
                                onClick={() => setIsActive(true)}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};