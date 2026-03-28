import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  LogIn,
  Building2
} from 'lucide-react';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(identifier, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-backgroundClr to-secondaryClr py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primaryClr">
            <Building2 size={32} className="text-primaryClrText" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primaryClr">
            RehamerPaint ERP
          </h2>
          <p className="mt-2 text-center text-sm text-place">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-primaryClr">
                Username or Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-place" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-secondaryClr rounded-md shadow-sm placeholder-place focus:outline-none focus:ring-primaryClr focus:border-primaryClr sm:text-sm"
                  placeholder="Enter username or email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primaryClr">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-place" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-secondaryClr rounded-md shadow-sm placeholder-place focus:outline-none focus:ring-primaryClr focus:border-primaryClr sm:text-sm"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-place" />
                  ) : (
                    <Eye size={18} className="text-place" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-dangerClr text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primaryClrText bg-primaryClr hover:bg-primaryClrDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryClr disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Sign in
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primaryClr focus:ring-primaryClr border-secondaryClr rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-place">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primaryClr hover:text-primaryClrDark">
                Forgot password?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
