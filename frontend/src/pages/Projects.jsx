import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  MoreVertical, 
  Users, 
  Calendar,
  Layers,
  Search,
  Filter,
  Loader2
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error('Error fetching projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert('Error creating project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-500 text-sm">Manage and track your team projects.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            className="input-field pl-10"
          />
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="card group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  <Layers className="w-6 h-6" />
                </div>
                <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px]">
                {project.description || 'No description provided.'}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center -space-x-2">
                  {project.members?.slice(0, 3).map((member, i) => (
                    <div 
                      key={member._id}
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600"
                      title={member.name}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {project.members?.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center card bg-slate-50 border-dashed">
              <p className="text-slate-500">No projects found. Create your first project to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Create New Project</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Marketing Campaign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Describe the project goals..."
                ></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
