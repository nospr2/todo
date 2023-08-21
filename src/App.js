import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchTodos, editTodo, deleteTodo, addTodo } from './todoFunctions';

function App() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [newTodo, setNewTodo] = useState({ description: '', dueDate: '', priority: 'low' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos(searchQuery, priorityFilter)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  }, [searchQuery, priorityFilter]);

  const refreshTodos = () => {
    setLoading(true);
    fetchTodos(searchQuery, priorityFilter)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setNewTodo({
      description: todo[1],
      dueDate: todo[2],
      priority: todo[3]
    });
  };

  const handleEditTodo = () => {
    if (!editingTodo) {
      console.error('No todo selected for editing.');
      return;
    }

    if (!newTodo.description || !newTodo.dueDate) {
      console.error('Description and due date are required.');
      return;
    }

    const updatedTodo = {
      id: editingTodo[0],
      description: newTodo.description,
      due_date: newTodo.dueDate, // Make sure the field name matches the backend
      priority: newTodo.priority
    };

    editTodo(updatedTodo.id, updatedTodo)
      .then(() => {
        setEditingTodo(null);
        setNewTodo({ description: '', dueDate: '', priority: 'low' });
        refreshTodos();
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id)
      .then(() => {
        refreshTodos();
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  const handleAddTodo = () => {
    if (!newTodo.description || !newTodo.dueDate) {
      console.error('Description and due date are required.');
      return;
    }

    const formattedNewTodo = {
      description: newTodo.description,
      due_date: newTodo.dueDate, // Make sure the field name matches the backend
      priority: newTodo.priority
    };

    addTodo(formattedNewTodo)
      .then(() => {
        setNewTodo({ description: '', dueDate: '', priority: 'low' });
        refreshTodos();
      })
      .catch(error => {
        console.error('Error adding todo:', error);
      });
  };

  return (
    <div className="App">
      <h1>Todo App by John Paul Davies</h1>
      <div className="filter-form">
        <input
          type="text"
          placeholder="Search by description"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={refreshTodos} disabled={loading}>
          Apply Filters
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(todo => (
            <tr key={todo[0]}>
              <td>{todo[0]}</td>
              <td>{todo[1]}</td>
              <td>{todo[2]}</td>
              <td>{todo[3]}</td>
              <td>
                <button onClick={() => handleEditClick(todo)}>Edit</button>
                <button onClick={() => handleDeleteTodo(todo[0])}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-form">
        <input
          type="text"
          placeholder="Description"
          value={newTodo.description}
          onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <input
          type="date"
          value={newTodo.dueDate}
          onChange={e => setNewTodo({ ...newTodo, dueDate: e.target.value })}
        />
        <select
          value={newTodo.priority}
          onChange={e => setNewTodo({ ...newTodo, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={editingTodo ? handleEditTodo : handleAddTodo} disabled={loading}>
          {editingTodo ? 'Update Todo' : 'Add Todo'}
        </button>
      </div>
    </div>
  );
}

export default App;
