import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating project');
    }
  };

  return (
    <>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1>Projects</h1>
          {user?.role === 'ADMIN' && (
            <button className="btn btn-primary gap-2" onClick={() => setShowModal(true)}>
              <Plus size={18} /> New Project
            </button>
          )}
        </div>

        <div className="dashboard-grid">
          {projects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id} className="card" style={{ display: 'block', color: 'inherit' }}>
              <h2 style={{ fontSize: '1.25rem' }}>{project.name}</h2>
              <p className="text-muted" style={{ marginBottom: '1rem', minHeight: '3rem' }}>{project.description}</p>
              <div className="flex justify-between items-center text-muted" style={{ fontSize: '0.875rem' }}>
                <span>Created by {project.createdBy?.name}</span>
                <span className="badge badge-TODO" style={{ backgroundColor: 'var(--bg-tertiary)', border: 'none' }}>
                  {project._count?.tasks || 0} tasks
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 className="mb-4">Create Project</h2>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label className="input-label">Project Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newProject.name} 
                  onChange={e => setNewProject({...newProject, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea 
                  className="input-field" 
                  value={newProject.description} 
                  onChange={e => setNewProject({...newProject, description: e.target.value})} 
                  required 
                  rows={3}
                />
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectList;
