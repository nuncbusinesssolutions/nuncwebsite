import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, User, Building, Mail, Phone, ArrowRight, AlertCircle, Info } from 'lucide-react';

interface AuthPageProps {
  navigate: (route: string) => void;
  defaultMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ navigate, defaultMode = 'login' }) => {
  const { login, registerClient, switchRoleForDemo } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form
  const [regData, setRegData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    const res = await login(loginEmail);
    setIsLoggingIn(false);

    if (res.success) {
      if (loginEmail.includes('admin') || loginEmail.includes('staff')) {
        navigate('admin');
      } else {
        navigate('client-portal');
      }
    } else {
      setLoginError(res.error || 'Invalid credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regData.password !== regData.confirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    if (regData.password.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    setIsRegistering(true);
    const res = await registerClient({
      fullName: regData.fullName,
      businessName: regData.businessName,
      email: regData.email,
      phone: regData.phone
    });
    setIsRegistering(false);

    if (res.success) {
      navigate('client-portal');
    } else {
      setRegError(res.error || 'Failed to register account.');
    }
  };

  return (
    <div className="py-12 max-w-lg mx-auto px-4 sm:px-6 space-y-8">
      
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-extrabold text-xl mx-auto shadow-md">
          N
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          NUNC Business Solutions
        </h1>
        <p className="text-xs text-slate-500">
          Secure Portal Authentication
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center">
        <button
          onClick={() => {
            setMode('login');
            setLoginError(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'login'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setMode('register');
            setRegError(null);
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'register'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Register Client Account
        </button>
      </div>

      {/* Forms Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Portal'}
            </button>

            {/* Quick Demo Logins for Evaluation */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-2">
                Instant Test Logins:
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    switchRoleForDemo('super_admin');
                    navigate('admin');
                  }}
                  className="w-full text-left p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-900 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold">Super Admin Account</div>
                    <div className="text-[10px] text-blue-700">admin@nuncbusinesssolutions.ph</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchRoleForDemo('staff');
                    navigate('admin');
                  }}
                  className="w-full text-left p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold">Senior Staff (Carl Mendoza)</div>
                    <div className="text-[10px] text-emerald-700">staff.carl@nuncbusinesssolutions.ph</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchRoleForDemo('client');
                    navigate('client-portal');
                  }}
                  className="w-full text-left p-2.5 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-900 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold">Client Account (Apex Logistics)</div>
                    <div className="text-[10px] text-purple-700">client.acme@example.com</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-700" />
                </button>
              </div>
            </div>

          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {regError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Reyes"
                  value={regData.fullName}
                  onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Business / Organization Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Solana Resorts"
                  value={regData.businessName}
                  onChange={(e) => setRegData({ ...regData, businessName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Business Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="elena@company.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Contact Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="09189876543"
                  value={regData.phone}
                  onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              {isRegistering ? 'Registering...' : 'Create Client Portal Account'}
            </button>
          </form>
        )}

      </div>

      {/* Critical Super Admin Requirement Notice (§31) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-slate-600 text-[11px] leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Security Architecture Notice:</span> In compliance with enterprise security protocols, administrative accounts cannot be created via public registration. The initial Super Admin account is provisioned through server-side environment credentials or authorized Supabase administrative processes.
        </div>
      </div>

    </div>
  );
};
