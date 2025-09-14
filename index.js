import React, { useState, useEffect, useRef } from 'react';
import { Bell, Plus, Search, User, Settings, Calendar, MapPin, Clock, CheckCircle2, Circle, AlertCircle, MessageSquare, Upload, Filter, BarChart3, Users, Folder, Archive, Home } from 'lucide-react';

const SalesSync = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Client Follow-up - ABC Corp",
      description: "Follow up on proposal discussion and pricing negotiation",
      priority: 'urgent',
      status: 'in-progress',
      assignedTo: "You",
      createdBy: "Manager",
      progress: 60,
      dueDate: "2025-09-14T14:00",
      estimatedHours: 2,
      location: "Client Office, Mumbai",
      tags: ["client", "follow-up"],
      comments: [
        { time: "14:30", user: "You", message: "Started client call preparation" },
        { time: "15:15", user: "You", message: "Updated proposal document" }
      ]
    },
    {
      id: 2,
      title: "Weekly Sales Report",
      description: "Compile weekly sales data and performance metrics",
      priority: 'high',
      status: 'pending',
      assignedTo: "Sarah Kumar",
      createdBy: "You",
      progress: 25,
      dueDate: "2025-09-15T17:00",
      estimatedHours: 4,
      location: "Remote",
      tags: ["report", "analytics"],
      comments: []
    },
    {
      id: 3,
      title: "Lead Generation Campaign",
      description: "Contact 20 potential clients from the new database",
      priority: 'medium',
      status: 'completed',
      assignedTo: "John Sharma",
      createdBy: "Manager",
      progress: 100,
      dueDate: "2025-09-13T18:00",
      estimatedHours: 6,
      location: "Field Work",
      tags: ["leads", "campaign"],
      comments: [
        { time: "10:00", user: "John", message: "Completed 20 cold calls" },
        { time: "16:30", user: "John", message: "Task marked as complete" }
      ]
    }
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
    location: '',
    tags: ''
  });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New urgent task assigned", time: "2 min ago", type: "assignment" },
    { id: 2, message: "Sarah updated progress on Weekly Report", time: "5 min ago", type: "progress" },
    { id: 3, message: "Deadline reminder: Client Follow-up in 30 minutes", time: "10 min ago", type: "reminder" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random progress updates
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks];
        const randomTask = updatedTasks[Math.floor(Math.random() * updatedTasks.length)];
        if (randomTask.status === 'in-progress' && randomTask.progress < 100) {
          const newProgress = Math.min(randomTask.progress + Math.floor(Math.random() * 10), 100);
          randomTask.progress = newProgress;
          if (newProgress === 100) {
            randomTask.status = 'completed';
          }
          
          // Add notification for progress update
          if (Math.random() > 0.7) {
            const newNotification = {
              id: Date.now(),
              message: `${randomTask.assignedTo} updated progress on "${randomTask.title}" to ${newProgress}%`,
              time: "Just now",
              type: "progress"
            };
            setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
          }
        }
        return updatedTasks;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate offline/online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-yellow-600 bg-yellow-100';
      case 'medium': return 'text-green-600 bg-green-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟡';
      case 'medium': return '🟢';
      case 'low': return '🔵';
      default: return '⚫';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending': return <Circle className="w-5 h-5 text-gray-400" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: Date.now(),
      ...newTask,
      status: 'pending',
      progress: 0,
      createdBy: "You",
      comments: [],
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      estimatedHours: '',
      location: '',
      tags: ''
    });
    setShowNewTaskModal(false);
    
    // Add notification
    const newNotification = {
      id: Date.now(),
      message: `New task "${task.title}" created and assigned to ${task.assignedTo}`,
      time: "Just now",
      type: "assignment"
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  const updateTaskProgress = (taskId, newProgress) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, progress: newProgress };
        if (newProgress === 100) {
          updatedTask.status = 'completed';
        } else if (newProgress > 0) {
          updatedTask.status = 'in-progress';
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const urgentTasks = filteredTasks.filter(task => task.priority === 'urgent' && task.status !== 'completed');
  const todayTasks = filteredTasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.dueDate).toDateString();
    return today === taskDate && task.status !== 'completed';
  });

  const completedTasksToday = filteredTasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.dueDate).toDateString();
    return today === taskDate && task.status === 'completed';
  }).length;

  const totalTasksToday = filteredTasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = new Date(task.dueDate).toDateString();
    return today === taskDate;
  }).length;

  const renderDashboard = () => (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Progress</p>
              <p className="text-2xl font-bold">{completedTasksToday}/{totalTasksToday}</p>
            </div>
            <div className="text-green-500">
              <BarChart3 className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urgent Tasks</p>
              <p className="text-2xl font-bold text-red-600">{urgentTasks.length}</p>
            </div>
            <div className="text-red-500">
              <AlertCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Tasks</p>
              <p className="text-2xl font-bold">{filteredTasks.filter(t => t.assignedTo !== 'You').length}</p>
            </div>
            <div className="text-blue-500">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold">2.3h</p>
            </div>
            <div className="text-purple-500">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-red-600">🚨 URGENT TASKS</h2>
          </div>
          <div className="divide-y">
            {urgentTasks.map(task => (
              <TaskItem key={task.id} task={task} onClick={() => setSelectedTask(task)} />
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">📅 TODAY'S TASKS</h2>
        </div>
        <div className="divide-y">
          {todayTasks.map(task => (
            <TaskItem key={task.id} task={task} onClick={() => setSelectedTask(task)} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">🕐 RECENT ACTIVITY</h2>
        </div>
        <div className="p-4 space-y-3">
          {notifications.slice(0, 5).map(notification => (
            <div key={notification.id} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TaskItem = ({ task, onClick }) => (
    <div 
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getStatusIcon(task.status)}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-gray-900">{task.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)} {task.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>👤 {task.assignedTo}</span>
              <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
              <span>📍 {task.location}</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTaskList = () => (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Tasks</h2>
        </div>
        <div className="divide-y">
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} onClick={() => setSelectedTask(task)} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-blue-600">SalesSync</h1>
              {isOffline && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                  📡 Offline Mode
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-800 relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-3 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className="p-3 border-b hover:bg-gray-50">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowNewTaskModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView('tasks')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'tasks' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>My Tasks</span>
            </button>
            <button
              onClick={() => setCurrentView('team')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'team' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Team Tasks</span>
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'tasks' && renderTaskList()}
          {currentView === 'team' && renderTaskList()}
          {currentView === 'analytics' && (
            <div className="p-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">📊 Performance Analytics</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Weekly Performance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tasks Completed</span>
                        <span className="font-bold">23/25</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Priority Distribution</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>🔴 Urgent</span>
                        <span>{urgentTasks.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>🟡 High</span>
                        <span>{filteredTasks.filter(t => t.priority === 'high').length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>🟢 Medium</span>
                        <span>{filteredTasks.filter(t => t.priority === 'medium').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedTask.title}</h2>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <div className={`mt-1 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${getPriorityColor(selectedTask.priority)}`}>
                    {getPriorityIcon(selectedTask.priority)}  {selectedTask.priority.toUpperCase()}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1 flex items-center space-x-2">
                    {getStatusIcon(selectedTask.status)}
                    <span className="capitalize">{selectedTask.status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned To</label>
                  <p className="mt-1">{selectedTask.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <p className="mt-1">{new Date(selectedTask.dueDate).toLocaleDateString()} at {new Date(selectedTask.dueDate).toLocaleTimeString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1">{selectedTask.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estimated Hours</label>
                  <p className="mt-1">{selectedTask.estimatedHours} hours</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Progress</label>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current Progress</span>
                    <span className="font-medium">{selectedTask.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${selectedTask.progress}%` }}
                    ></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedTask.progress}
                    onChange={(e) => updateTaskProgress(selectedTask.id, parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              {selectedTask.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Activity Log</label>
                <div className="mt-2 space-y-2">
                  {selectedTask.comments.map((comment, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{comment.message}</p>
                        <p className="text-xs text-gray-500">{comment.time} - {comment.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                  Update Task
                </button>
                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Create New Task</h2>
                <button 
                  onClick={() => setShowNewTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task description..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">🔵 Low</option>
                    <option value="medium">🟢 Medium</option>
                    <option value="high">🟡 High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select person...</option>
                    <option value="You">You</option>
                    <option value="Sarah Kumar">Sarah Kumar</option>
                    <option value="John Sharma">John Sharma</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                  <input
                    type="number"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({...newTask, estimatedHours: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hours"
                    min="0.5"
                    step="0.5"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newTask.location}
                  onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Task location..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={handleCreateTask}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create Task
                </button>
                <button 
                  onClick={() => setShowNewTaskModal(false)}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesSync