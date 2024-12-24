import { useState } from 'react';

const SignUp=()=>{
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    designation: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/CreateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setMessage(data.message);
      setFormData({ username: '', name: '', email: '', password: '', designation: '' });
    } catch (error) {
      setMessage('Error in creating user');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Create User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Username:</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>

          <div>
            <label className="block text-gray-600">Name:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>

          <div>
            <label className="block text-gray-600">Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>

          <div>
            <label className="block text-gray-600">Password:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>

          <div>
            <label className="block text-gray-600">Designation:</label>
            <input 
              type="text" 
              name="designation" 
              value={formData.designation} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">Create User</button>
        </form>
        {message && <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>}
      </div>
    </div>
  );
}

export default SignUp;
