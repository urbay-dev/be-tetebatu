import React, { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { toast } from 'react-hot-toast';
import { LoadingInline } from '../components/page-loader';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      login(data.token, data.user);
      toast.success('Selamat datang kembali!');
      navigate('/admin');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email atau password salah';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-['Libre_Franklin']">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Login Admin</h1>
          <p className="text-gray-500">Selamat datang kembali di Tetebatu Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none" 
              placeholder="admin@tetebatu.id" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#244f36] text-white py-2 rounded-lg font-medium hover:bg-[#173c26] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingInline locale="id" label="Memverifikasi akun…" /> : 'Masuk Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
};
