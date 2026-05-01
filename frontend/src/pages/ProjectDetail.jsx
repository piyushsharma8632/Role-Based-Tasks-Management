import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Plus, ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assigneeId: '' });

  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tasks/project/${id}`, newTask);
      setShowModal(false);
      setNewTask({ title: '', description: '', dueDate: '', assigneeId: '' });
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating task');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating task');
      console.error(err);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <>
      <div className="animate-fade-in">
        <Link to="/projects" className="text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>{project.name}</h1>
            <p className="text-muted">{project.description}</p>
          </div>
          <button className="btn btn-primary gap-2" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Task
          </button>
        </div>

        <div className="card" style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
          <h2 className="mb-4">Tasks</h2>
          <div className="task-list">
            {project.tasks.map(task => (
              <div key={task.id} className={`task-item status-${task.status}`}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{task.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>{task.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                    {task.assignee && <span style={{ color: 'var(--accent-primary)' }}>@ {task.assignee.name}</span>}
                    {task.dueDate && <span className="text-muted">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
                  <select 
                    className="input-field" 
                    style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.5rem', fontSize: '0.75rem' }}
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
            ))}
            {project.tasks.length === 0 && <div className="text-muted text-center py-8">No tasks created yet.</div>}
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 className="mb-4">Create Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label className="input-label">Title</label>
                <input type="text" className="input-field" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input-field" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} required rows={3} />
              </div>
              <div className="flex gap-4">
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Assignee</label>
                  <select className="input-field" value={newTask.assigneeId} onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Due Date</label>
                  <input type="date" className="input-field" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetail;
