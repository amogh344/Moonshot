import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (credentials) => api.post("/login", credentials);
export const getProfile = () => api.get("/profile");
export const createProject = (data) => api.post("/projects", data);
export const getProjects = () => api.get("/projects");
export const deleteProject = (id) => api.delete(`/project/${id}`);
export default api;
