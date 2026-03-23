import { useState } from 'react';
import axios from 'axios';
import MapPicker from '../components/MapPicker';

export default function ReportIssue() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [location, setLocation] = useState(null); // { lat, lng }
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !file) return alert("Please select a location and image!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lng);
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token'); // Assume you stored this on login
      await axios.post('http://localhost:5000/api/issues', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        },
      });
      alert('Issue Reported Successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to report issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Report an Issue</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          className="w-full p-2 border rounded" 
          placeholder="Issue Title (e.g. Pothole)" 
          onChange={e => setForm({...form, title: e.target.value})} 
        />
        <textarea 
          className="w-full p-2 border rounded" 
          placeholder="Description" 
          onChange={e => setForm({...form, description: e.target.value})} 
        />
        
        {/* Map Picker Component */}
        <label className="block text-sm font-medium">Pin Location on Map:</label>
        <MapPicker setLocation={setLocation} />
        
        <input 
          type="file" 
          onChange={e => setFile(e.target.files[0])} 
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Uploading...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
