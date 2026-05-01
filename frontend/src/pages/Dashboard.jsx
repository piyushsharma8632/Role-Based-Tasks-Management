import React, { useEffect, useState } from 'react';
import api from '../api';
import { CheckCircle2, Clock, AlertCircle, Search } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks/dashboard');
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating task');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const reviewTasks = tasks.filter(t => t.status === 'REVIEW');
  const doneTasks = tasks.filter(t => t.status === 'DONE');
  
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date() && status !== 'DONE';
  };

  const TaskCard = ({ task }) => (
    <div className={`card animate-fade-in ${isOverdue(task.dueDate) ? 'border-overdue' : ''}`} style={{ marginBottom: '1rem' }}>
      <div className="flex justify-between items-center mb-2">
        <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
        {isOverdue(task.dueDate) && <span className="badge badge-OVERDUE">OVERDUE</span>}
      </div>
      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{task.title}</h3>
      <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{task.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={14} />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
        </div>
        <select 
          className="input-field" 
          style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.5rem', fontSize: '0.75rem' }}
          value={task.status}
          onChange={(e) => updateStatus(task.id, e.target.value)}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6">My Dashboard</h1>
      
      <div className="dashboard-grid">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
            <AlertCircle size={20} color="var(--status-todo)" /> To Do ({todoTasks.length})
          </h2>
          <div className="task-list">
            {todoTasks.map(task => <TaskCard key={task.id} task={task} />)}
            {todoTasks.length === 0 && <div className="text-muted">No pending tasks</div>}
          </div>
        </div>

        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
            <Clock size={20} color="var(--status-in-progress)" /> In Progress ({inProgressTasks.length})
          </h2>
          <div className="task-list">
            {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
            {inProgressTasks.length === 0 && <div className="text-muted">No tasks in progress</div>}
          </div>
        </div>

        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
            <Search size={20} color="var(--status-review)" /> Review ({reviewTasks.length})
          </h2>
          <div className="task-list">
            {reviewTasks.map(task => <TaskCard key={task.id} task={task} />)}
            {reviewTasks.length === 0 && <div className="text-muted">No tasks in review</div>}
          </div>
        </div>

        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
            <CheckCircle2 size={20} color="var(--status-done)" /> Done ({doneTasks.length})
          </h2>
          <div className="task-list">
            {doneTasks.map(task => <TaskCard key={task.id} task={task} />)}
            {doneTasks.length === 0 && <div className="text-muted">No completed tasks</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
