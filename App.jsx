import React, { useState, useEffect } from 'react';
import { Circle, CheckCircle, Trash2, Plus, LogOut, Filter, Calendar, Flag, User } from 'lucide-react';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    text: '',
    dueDate: '',
    priority: 'Low',
  });
  const [filter, setFilter] = useState('All');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [username, setUsername] = useState('');

  // --- Data Persistence: Load from and Save to Local Storage ---
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        setLoggedInUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage:", error);
    }
  }, [tasks]);

  // --- Authentication Logic ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setLoggedInUser(username.trim());
      localStorage.setItem('loggedInUser', username.trim());
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
  };

  // --- Task Management Functions ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.text.trim()) return;

    const taskWithId = {
      ...newTask,
      id: Date.now(),
      completed: false,
    };
    setTasks([...tasks, taskWithId]);
    setNewTask({ text: '', dueDate: '', priority: 'Low' });
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Completed') {
      return task.completed;
    }
    if (filter === 'Pending') {
      return !task.completed;
    }
    return true; // 'All'
  });

  // --- Render based on Authentication Status ---
  if (!loggedInUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-6">
            Welcome
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 pl-10 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-colors"
                required
              />
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white p-3 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              Start Managing Tasks
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main App UI (when logged in)
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 font-sans">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <header className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              My Tasks
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Welcome, {loggedInUser}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 transition-colors text-white p-2 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </header>

          <form onSubmit={handleAddTask} className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              value={newTask.text}
              onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
              placeholder="Add a new task..."
              className="flex-grow p-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-colors"
              required
            />
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full p-3 pr-10 rounded-xl bg-gray-700 border border-gray-600 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-grow">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full p-3 pr-10 rounded-xl bg-gray-700 border border-gray-600 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <Flag className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white p-3 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              <Plus className="w-6 h-6 mx-auto" />
            </button>
          </form>

          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Pending')}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${filter === 'Pending' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('Completed')}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${filter === 'Completed' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Completed
            </button>
          </div>

          <ul className="space-y-3">
            {filteredTasks.length === 0 ? (
              <li className="text-center text-gray-400">No tasks {filter.toLowerCase()}! Add one above.</li>
            ) : (
              filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start justify-between p-4 bg-gray-700 rounded-xl shadow-md transition-all duration-200 hover:bg-gray-600"
                >
                  <div className="flex items-start gap-4 flex-grow">
                    <button
                      onClick={() => toggleCompletion(task.id)}
                      className="text-blue-400 hover:text-blue-300 transition-colors mt-1"
                    >
                      {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-lg transition-all duration-200 ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                        {task.text}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {task.dueDate}
                          </span>
                        )}
                        {task.priority && (
                          <span className={`flex items-center gap-1 font-semibold
                            ${task.priority === 'High' ? 'text-red-400' : task.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                            <Flag className="w-4 h-4" />
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-400 hover:text-red-500 transition-colors p-1 rounded-md mt-1"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;