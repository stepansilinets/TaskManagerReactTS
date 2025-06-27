import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addTask, 
  toggleTask, 
  editTask, 
  deleteTask,
  selectFilteredTasks
} from '../features/tasks/tasksSlice';
import { logout, selectCurrentUser } from '../features/auth/authSlice';
import { type AppDispatch, type RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import '../styles.css'

const TasksPage = () => {
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  const user = useSelector(selectCurrentUser);
  const tasks = useSelector((state: RootState) => 
    selectFilteredTasks(state, user?.id || '', filter));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && user) {
      dispatch(addTask(title, user.id));
      setTitle('');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId && editTitle.trim()) {
      dispatch(editTask({ id: editId, title: editTitle }));
      setEditId(null);
      setEditTitle('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="tasks-container">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <div className="tasks-card">
        <div className='task-card-name'>
          <h1 className='task-card-paragraph'>Task Manager</h1>
          <h1 className='task-card-emodji'>𒅒𒈔𒅒𒇫𒄆</h1>
        </div>
        
        
        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task"
            className="task-form-input"
          />
          <button type="submit" className="primary-button">
            Add Task
          </button>
        </form>

        <div className="filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
          >
            Pending
          </button>
        </div>

        <ul className="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              {editId === task.id ? (
                <form onSubmit={handleSaveEdit} className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                  />
                  <button type="submit" className="save-button">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div className="task-content">
                    <label className="task-toggle">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => dispatch(toggleTask(task.id))}
                        className="toggle-input"
                      />
                      <span className="toggle-custom"></span>
                    </label>
                    <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button
                      onClick={() => {
                        setEditId(task.id);
                        setEditTitle(task.title);
                      }}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteTask(task.id))}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TasksPage;