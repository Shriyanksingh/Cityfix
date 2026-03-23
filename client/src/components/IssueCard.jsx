import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThumbsUp } from 'lucide-react';

const IssueCard = ({ issue, onIssueUpdated }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const StatusBadge = ({ status }) => {
    let style = 'bg-slate-800 text-slate-300 border-slate-700';
    if (status === 'Open') style = 'bg-rose-900/50 text-rose-300 border-rose-800/50';
    if (status === 'In Progress') style = 'bg-amber-900/50 text-amber-300 border-amber-800/50';
    if (status === 'Resolved') style = 'bg-emerald-900/50 text-emerald-300 border-emerald-800/50';
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${style}`}>{status}</span>;
  };

  const handleUpvote = async () => {
    if (!user) {
      setError("Log in to upvote.");
      return;
    }
    
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`http://localhost:5000/api/issues/${issue._id}/upvote`, {}, config);
      onIssueUpdated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error upvoting');
    } finally {
      setLoading(false);
    }
  };

  const hasUpvoted = user ? issue.upvotes.includes(user._id) || issue.upvotes.includes(user.id) : false;

  return (
    <div className="group bg-slate-800/80 p-5 rounded-2xl shadow-sm border border-slate-700 hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-3 border-b border-slate-700/50 pb-3">
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">{issue.title}</h3>
        <StatusBadge status={issue.status} />
      </div>
      
      <p className="text-slate-300 mb-4 whitespace-pre-wrap text-sm leading-relaxed">{issue.description}</p>
      
      {issue.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden shadow-inner bg-slate-900">
          <img src={issue.imageUrl} alt="Issue evidence" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/50 -mx-5 -mb-5 p-4 rounded-b-2xl border-t border-slate-700/50">
        <span className="font-medium">Reported by <span className="text-slate-200">{issue.user?.name || 'Unknown'}</span></span>
        
        <div className="flex items-center gap-3">
          {error && <span className="text-rose-400 font-medium tracking-tight animate-pulse">{error}</span>}
          <button 
            onClick={(e) => { e.stopPropagation(); handleUpvote(); }} 
            disabled={loading || hasUpvoted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all ${
              hasUpvoted ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700 cursor-default shadow-inner' : 'bg-slate-800 text-slate-300 hover:text-indigo-300 hover:bg-slate-700 hover:shadow-sm border border-slate-600 hover:border-indigo-500/50'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{issue.upvotes.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default IssueCard;
