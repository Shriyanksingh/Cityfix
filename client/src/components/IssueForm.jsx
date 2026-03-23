import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const IssueForm = ({ position, onIssueCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      setError("Please select a location on the map first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('latitude', position[0]);
    formData.append('longitude', position[1]);
    if (image) {
      formData.append('image', image);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post('http://localhost:5000/api/issues', formData, config);
      onIssueCreated(data);
      // Reset form
      setTitle('');
      setDescription('');
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/80 p-8 rounded-2xl shadow-xl shadow-slate-900/50 border border-slate-700 mb-6">
      <h3 className="text-2xl font-extrabold mb-6 text-slate-100 tracking-tight">Report an Issue</h3>
      {error && <div className="bg-rose-900/40 text-rose-300 p-4 rounded-xl mb-6 text-sm font-medium border border-rose-500/30">{error}</div>}
      
      {!position && (
        <div className="bg-indigo-900/30 text-indigo-300 p-4 rounded-xl mb-6 text-sm font-semibold border border-indigo-500/30 animate-pulse">
          Click on the map to set the issue location before submitting.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
           <label className="block text-sm font-semibold text-slate-300 mb-1.5">Title</label>
           <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-xl border-slate-600 shadow-sm p-3 border focus:border-indigo-500 focus:ring-indigo-500 transition-colors bg-slate-900/50 text-white focus:bg-slate-900"/>
        </div>
        <div>
           <label className="block text-sm font-semibold text-slate-300 mb-1.5">Description</label>
           <textarea required value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full rounded-xl border-slate-600 shadow-sm p-3 border focus:border-indigo-500 focus:ring-indigo-500 transition-colors bg-slate-900/50 text-white focus:bg-slate-900"></textarea>
        </div>
        <div>
           <label className="block text-sm font-semibold text-slate-300 mb-1.5">Photo Evidence</label>
           <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-900/50 file:text-indigo-300 hover:file:bg-indigo-800/50 cursor-pointer transition-colors"/>
        </div>
        <div className="flex gap-4 pt-4">
           <button type="submit" disabled={loading || !position} className="flex-[2] bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:hover:shadow-none hover:-translate-y-0.5">
             {loading ? 'Submitting...' : 'Submit Report'}
           </button>
           <button type="button" onClick={onCancel} className="flex-1 bg-slate-700 text-slate-300 p-3 rounded-xl font-bold hover:bg-slate-600 transition-colors">
             Cancel
           </button>
        </div>
      </form>
    </div>
  );
};
export default IssueForm;
