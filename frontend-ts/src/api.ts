import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsers = () => api.get("/users");
export const uploadResults = (payload: any[]) => api.post("/results/upload", payload);
export const getMyResults = () => api.get("/results/mine");
export const submitResults = (ids: number[]) => api.put("/results/submit", { ids });
export const getPending = () => api.get("/results/pending");
export const departmentApprove = (ids: number[]) => api.put("/results/department-approve", { ids });
export const facultyApprove = (ids: number[]) => api.put("/results/faculty-approve", { ids });
export const finalApprove = (ids: number[]) => api.put("/results/final-approve", { ids });
export const getStudentResults = (studentId: number) => api.get(`/results/student/${studentId}`);

export default api;
