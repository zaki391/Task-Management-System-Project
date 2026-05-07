import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Settings as SettingsIcon } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">User Profile</h2>
        <p className="text-slate-500 text-sm">Manage your account settings and preferences.</p>
      </div>

      <div className="card text-center py-10">
        <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-lg">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-2xl font-bold text-slate-900">{user?.name}</h3>
        <p className="text-slate-500">{user?.email}</p>
        <div className="inline-flex items-center px-3 py-1 mt-4 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3 h-3 mr-1.5" />
          {user?.role}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Personal Information
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400">Full Name</p>
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Email Address</p>
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Account Details
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400">Account Role</p>
              <p className="text-sm font-medium text-slate-900 capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Member Since</p>
              <p className="text-sm font-medium text-slate-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-red-100 bg-red-50/30">
        <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-2">Danger Zone</h4>
        <p className="text-xs text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
