import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden z-0 bg-[#020617]">
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="bg-slate-800/60 backdrop-blur-2xl p-10 rounded-3xl shadow-xl shadow-slate-900/50 border border-slate-700/50 w-full max-w-md relative z-10 transition-all hover:border-indigo-500/30">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-slate-100 tracking-tight">Welcome Back</h2>
        {error && <div className="bg-rose-900/40 text-rose-300 p-4 rounded-xl mb-6 text-sm font-semibold border border-rose-500/30 shadow-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-xl border-slate-600 shadow-sm p-3.5 border focus:border-indigo-500 focus:ring-indigo-500 bg-slate-900/50 text-white focus:bg-slate-900 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-xl border-slate-600 shadow-sm p-3.5 border focus:border-indigo-500 focus:ring-indigo-500 bg-slate-900/50 text-white focus:bg-slate-900 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3.5 rounded-xl font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all text-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
