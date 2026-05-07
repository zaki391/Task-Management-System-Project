import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Filter,
  Search,
  Loader2,
  ChevronRight,
  User as UserIcon,
  Calendar
} from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/users')
      ]);
      setTasks(tasksRes.data.data);
      setProjects(projectsRes.data.data);
      setUsers(usersRes.data.data);
      
      if (projectsRes.data.data.length > 0) {
        setNewTask(prev => ({ ...prev, project: projectsRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowModal(false);
      setNewTask({
        title: '',
        description: '',
        project: projects[0]?._id || '',
        assignedTo: '',
        priority: 'medium',
        dueDate: ''
      });
      fetchData();
    } catch (err) {
      alert('Error creating task');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'done' ? 'pending' : 'done';
      await api.put(`/tasks/${id}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-orange-100 text-orange-600';
      case 'low': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
          <p className="text-slate-500 text-sm">Track your team's daily assignments.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">Done</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-500" />
                  </td>
                </tr>
              ) : tasks.map((task) => (
                <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(task._id, task.status)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.status === 'done' 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-slate-300 hover:border-primary-500'
                      }`}
                    >
                      {task.status === 'done' && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`text-sm font-medium ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{task.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {task.project?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-600">
                        {task.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className="text-sm text-slate-600">{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-slate-500">
                    No tasks found. Create one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Create New Task</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                  <input
                    type="text" required
                    className="input-field"
                    placeholder="e.g. Design Dashboard UI"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Add more details about the task..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                  <select
                    className="input-field"
                    required
                    value={newTask.project}
                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                  <select
                    className="input-field"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  >
                    <option value="">Select Member</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    className="input-field"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
