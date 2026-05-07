import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statCards = [
    { name: 'Total Tasks', value: stats?.totalTasks, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Completed', value: stats?.completedTasks, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Pending', value: stats?.pendingTasks, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { name: 'Overdue', value: stats?.overdueTasks, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="card flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
              Project Progress
            </h3>
            <div className="space-y-6">
              {stats?.projectStats.map((project) => (
                <div key={project.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">{project.name}</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {project.completed}/{project.total} Tasks
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(project.completed / project.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {stats?.projectStats.length === 0 && (
                <p className="text-center text-slate-400 py-4">No project data available</p>
              )}
            </div>
          </div>

          <div className="card overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="divide-y divide-slate-100">
              {stats?.recentActivity.map((task) => (
                <div key={task._id} className="py-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">
                      in <span className="font-semibold">{task.project?.name}</span> • By {task.createdBy?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {stats?.recentActivity.length === 0 && (
                <p className="text-center text-slate-400 py-8">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-500" />
              Calendar View
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 h-64 flex items-center justify-center border border-dashed border-slate-300">
              <p className="text-sm text-slate-400">Calendar integration coming soon</p>
            </div>
          </div>
          
          <div className="card bg-primary-600 text-white border-none">
            <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
            <p className="text-primary-100 text-sm mb-4">Get unlimited projects, advanced analytics and more features.</p>
            <button className="w-full py-2 bg-white text-primary-600 rounded-lg font-bold text-sm hover:bg-primary-50 transition-colors">
              Go Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
