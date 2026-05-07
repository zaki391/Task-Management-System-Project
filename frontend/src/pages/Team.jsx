import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mail, Shield, User as UserIcon, Loader2 } from 'lucide-react';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data.data);
      } catch (err) {
        console.error('Error fetching users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading team members...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Team Members</h2>
        <p className="text-slate-500 text-sm">View and manage your team collaboration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="card flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <div className="flex items-center text-xs text-slate-500 space-x-3 mt-1">
                <span className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {user.email}
                </span>
                <span className="flex items-center px-1.5 py-0.5 rounded bg-slate-100 font-semibold uppercase text-[10px]">
                  <Shield className="w-2.5 h-2.5 mr-1" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
