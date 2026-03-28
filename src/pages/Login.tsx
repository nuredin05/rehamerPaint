import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(identifier, password);
    } catch (err: any) {
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
            <span className="text-primaryClrText font-bold text-2xl">RP</span>
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
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr focus:border-transparent bg-bgLight"
                placeholder="Enter your username or email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primaryClr">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-secondaryClr rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryClr focus:border-transparent bg-bgLight pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-place"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span className="text-sm">🙈</span>
                  ) : (
                    <span className="text-sm">👁️</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primaryClr text-primaryClrText py-2 px-4 rounded-lg font-medium hover:bg-primaryClrDark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primaryClr focus:ring-offset-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center text-sm text-place">
            Demo credentials:
            <br />
            Username: <span className="font-mono bg-secondaryClr px-2 py-1 rounded">admin</span>
            <br />
            Password: <span className="font-mono bg-secondaryClr px-2 py-1 rounded">admin123</span>
          </div>
        </form>
      </div>
    </div>
  );
};
