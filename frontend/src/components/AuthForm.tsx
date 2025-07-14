import React, { useState } from 'react';
import { User, Shield, UserPlus, LogIn } from 'lucide-react';
import { apiService } from '../services/api';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'register' | 'createUser';

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !orgName) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      switch (mode) {
        case 'login':
          response = await apiService.login({ username, orgName });
          break;
        case 'register':
          response = await apiService.register({ username, orgName });
          break;
        case 'createUser':
          response = await apiService.createUser({ username, orgName });
          break;
      }

      if (response.success) {
        onAuthSuccess();
      } else {
        setError(typeof response.message === 'string' ? response.message : 'Authentication failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'login':
        return {
          title: 'Sign In',
          description: 'Access your Hyperledger Fabric network',
          icon: LogIn,
          buttonText: 'Sign In',
          color: 'blue'
        };
      case 'register':
        return {
          title: 'Register',
          description: 'Register and get your secret',
          icon: UserPlus,
          buttonText: 'Register',
          color: 'green'
        };
      case 'createUser':
        return {
          title: 'Create User',
          description: 'Register and enroll a new user',
          icon: User,
          buttonText: 'Create User',
          color: 'purple'
        };
    }
  };

  const config = getModeConfig();
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${config.color}-100 mb-4`}>
              <IconComponent className={`w-8 h-8 text-${config.color}-600`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h1>
            <p className="text-gray-600">{config.description}</p>
          </div>

          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            {(['login', 'register', 'createUser'] as AuthMode[]).map((authMode) => (
              <button
                key={authMode}
                onClick={() => setMode(authMode)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  mode === authMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {authMode === 'createUser' ? 'Create' : authMode === 'register' ? 'Register' : 'Login'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <input
                id="orgName"
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter organization name"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `bg-${config.color}-600 hover:bg-${config.color}-700 active:bg-${config.color}-800`
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                config.buttonText
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <Shield className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-xs text-gray-500">Secured by Hyperledger Fabric</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};