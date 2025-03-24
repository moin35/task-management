// src/api/taskApi.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getTasksAPI = async () => {
  const response = await axios.get(`${API_URL}/tasks`, getAuthHeader());
  return response.data;
};

export const addTaskAPI = async (task) => {
  const response = await axios.post(`${API_URL}/tasks`, task, getAuthHeader());
  return response.data;
};

export const updateTaskAPI = async (id, task) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, task, getAuthHeader());
  return response.data;
};

export const deleteTaskAPI = async (id) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeader());
  return response.data;
};

export const updateTaskStatusAPI = async (id, status) => {
  const response = await axios.patch(`${API_URL}/tasks/${id}/status`, 
    { status }, 
    getAuthHeader()
  );
  return response.data;
};