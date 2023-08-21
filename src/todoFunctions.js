import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const fetchTodos = (searchQuery, priorityFilter) => {
  const queryParams = new URLSearchParams({
    search: searchQuery,
    priority: priorityFilter
  });

  return axios.get(`${API_BASE_URL}/todo?${queryParams.toString()}`);
};

export const editTodo = (id, newData) => {
  return axios.put(`${API_BASE_URL}/todo/${id}`, newData);
};

export const deleteTodo = (id) => {
  return axios.delete(`${API_BASE_URL}/todo/${id}`);
};

export const addTodo = (newTodo) => {
  return axios.post(`${API_BASE_URL}/todo`, newTodo);
};
