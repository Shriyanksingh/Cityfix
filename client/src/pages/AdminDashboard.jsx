import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchIssues();
  }, [user, navigate]);

  const fetchIssues = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/issues');
      setIssues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/issues/${id}/status`, { status: newStatus }, config);
      setIssues(issues.map(i => i._id === id ? { ...i, status: newStatus } : i));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/issues/${id}`, config);
      setIssues(issues.filter(i => i._id !== id));
    } catch (err) {
      alert('Error deleting issue');
    }
  };

  if (loading) return <div className="p-8 text-center text-xl text-slate-400 font-medium animate-pulse">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10 relative">
      <h1 className="text-3xl font-extrabold text-slate-100 mb-8 tracking-tight">Admin Command Center</h1>
      {error && <div className="bg-rose-900/40 text-rose-300 p-4 rounded-xl mb-6 shadow-sm border border-rose-500/30 font-semibold">{error}</div>}
      
      <div className="bg-slate-800/80 shadow-xl shadow-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/30 divide-y divide-slate-700/30">
              {issues.map(issue => (
                <tr key={issue._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-200 mb-1">{issue.title}</div>
                    <div className="text-sm text-slate-400 truncate max-w-xs">{issue.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">
                    {issue.user?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={issue.status}
                      onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-slate-600 bg-slate-700/50 text-slate-200 text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
                    >
                      <option value="Open">🔴 Open</option>
                      <option value="In Progress">🟡 In Progress</option>
                      <option value="Resolved">🟢 Resolved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(issue._id)}
                      className="text-rose-400 hover:text-white transition-colors bg-rose-900/20 hover:bg-rose-600 px-4 py-2 rounded-lg shadow-sm border border-rose-800/40 hover:border-rose-500 font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-semibold italic bg-slate-800/20">
                    No issues found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
