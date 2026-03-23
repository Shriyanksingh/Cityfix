import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import MapComponent from '../components/MapComponent';
import IssueForm from '../components/IssueForm';
import IssueCard from '../components/IssueCard';

const Home = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isReporting, setIsReporting] = useState(false);
  const [newPosition, setNewPosition] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchIssues();
  }, []);

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

  const handleIssueCreated = (newIssue) => {
    // Manually append the current user to the object to avoid immediate refetching if we want
    const issueWithUser = { ...newIssue, user: { name: user.name, role: user.role } };
    setIssues([issueWithUser, ...issues]);
    setIsReporting(false);
    setNewPosition(null);
    setSelectedIssue(issueWithUser);
  };

  const handleIssueUpdated = (updatedIssue) => {
    setIssues(issues.map(i => i._id === updatedIssue._id ? updatedIssue : i));
    if (selectedIssue && selectedIssue._id === updatedIssue._id) {
      setSelectedIssue(updatedIssue);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Map View */}
      <div className="w-full h-[45vh] md:h-full md:flex-1 relative z-0 bg-slate-900 order-1 md:order-2 shrink-0">
        <MapComponent 
          issues={issues} 
          newIssuePosition={isReporting ? newPosition : null}
          setNewIssuePosition={isReporting ? setNewPosition : null}
          onIssueClick={(issue) => {
            if (!isReporting) {
              setSelectedIssue(issue);
            }
          }}
        />
      </div>

      {/* Sidebar for List / Forms / Details */}
      <div className="w-full md:w-[400px] lg:w-[480px] p-5 md:p-6 glass flex flex-col overflow-y-auto border-t md:border-t-0 md:border-r border-slate-700/50 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] md:shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20 custom-scrollbar flex-1 md:flex-none order-2 md:order-1 rounded-t-3xl md:rounded-none -mt-5 md:mt-0 relative pb-8 md:pb-6">
        
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-600/60 rounded-full mx-auto mb-5 md:hidden shrink-0"></div>

        {!isReporting && !selectedIssue && (
          <div className="mb-6 md:mb-8 flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">Local Issues</h2>
            {user && (
              <button 
                onClick={() => setIsReporting(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-sm md:text-base font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all w-full md:w-auto"
              >
                + Report Issue
              </button>
            )}
          </div>
        )}

        {!user && !isReporting && !selectedIssue && (
          <div className="bg-indigo-900/30 backdrop-blur-sm text-indigo-300 p-5 rounded-2xl mb-8 shadow-sm border border-indigo-500/30 flex-shrink-0 font-medium text-center">
            Log in to report issues or upvote existing ones!
          </div>
        )}

        {error && <div className="bg-rose-900/40 text-rose-300 p-4 rounded-xl mb-6 font-semibold shadow-sm border border-rose-500/30">{error}</div>}

        {isReporting ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <IssueForm 
              position={newPosition} 
              onIssueCreated={handleIssueCreated} 
              onCancel={() => { setIsReporting(false); setNewPosition(null); }} 
            />
          </div>
        ) : selectedIssue ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              onClick={() => setSelectedIssue(null)}
              className="mb-6 text-slate-400 hover:text-indigo-400 font-semibold flex items-center gap-2 bg-slate-800/60 hover:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-700/50 transition-all w-fit"
            >
              &larr; Back to list
            </button>
            <IssueCard issue={selectedIssue} onIssueUpdated={handleIssueUpdated} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <div className="w-8 h-8 rounded-full border-4 border-indigo-900 border-t-indigo-400 animate-spin"></div>
                <div className="text-slate-400 font-semibold animate-pulse">Loading issues...</div>
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-12 px-6 bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-700/50">
                <p className="text-slate-400 font-medium">No issues reported yet.</p>
                <p className="text-slate-200 font-bold mt-1 text-lg">Be the first!</p>
              </div>
            ) : (
              issues.map(issue => (
                <div 
                  key={issue._id} 
                  onClick={() => setSelectedIssue(issue)}
                  className="cursor-pointer transform hover:-translate-y-1 transition-transform"
                >
                  <IssueCard issue={issue} onIssueUpdated={handleIssueUpdated} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
