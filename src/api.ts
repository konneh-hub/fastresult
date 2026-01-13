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

export const listFaculties = () => api.get('/faculties');
export const listDepartments = (facultyId?: number) => api.get(`/departments${facultyId ? '?facultyId='+facultyId : ''}`);
export const listPrograms = (departmentId?: number) => api.get(`/programs${departmentId ? '?departmentId='+departmentId : ''}`);

export const createFaculty = (name: string) => api.post('/faculties', { name });
export const createDepartment = (faculty_id: number, name: string) => api.post('/departments', { faculty_id, name });
export const createProgram = (department_id: number, name: string) => api.post('/programs', { department_id, name });
export const createUser = (payload: any) => api.post('/admin/users', payload);
export const deleteUser = (id: number) => api.delete(`/admin/users/${id}`);

export default api;
