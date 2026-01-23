import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
export const requestCorrection = (id:number, message:string) => api.post(`/results/${id}/request-correction`, { message });
export const rejectResult = (id:number, reason?:string) => api.put(`/results/${id}/reject`, { reason });
export const submitDepartmentResults = (payload:any) => api.post('/results/submit', payload);
export const facultyApprove = (ids: number[]) => api.put("/results/faculty-approve", { ids });
export const finalApprove = (ids: number[]) => api.put("/results/final-approve", { ids });
export const getDepartmentCourses = (deptId:number) => api.get(`/departments/${deptId}/courses`);
export const assignCourseLecturer = (courseId:number, lecturerId:number) => api.put(`/courses/${courseId}/assign`, { lecturer_id: lecturerId });
export const departmentReport = (deptId:number, params?:any) => api.get(`/departments/${deptId}/report${params?('?'+new URLSearchParams(params).toString()):''}`);
export const getStudentResults = (studentId: number) => api.get(`/results/student/${studentId}`);

export const listFaculties = () => api.get('/faculties');
export const listDepartments = (facultyId?: number) => api.get(`/departments${facultyId ? '?facultyId='+facultyId : ''}`);
export const listPrograms = (departmentId?: number) => api.get(`/programs${departmentId ? '?departmentId='+departmentId : ''}`);

export const createFaculty = (name: string) => api.post('/faculties', { name });
export const createDepartment = (faculty_id: number, name: string) => api.post('/departments', { faculty_id, name });
export const createProgram = (department_id: number, name: string) => api.post('/programs', { department_id, name });
export const createUser = (payload: any) => api.post('/admin/users', payload);
export const deleteUser = (id: number) => api.delete(`/admin/users/${id}`);

export const assignHod = (deptId:number, hodUserId:number) => api.put(`/departments/${deptId}/hod`, { hod_user_id: hodUserId });
export const facultyStudents = (facultyId:number) => api.get(`/faculties/${facultyId}/students`);

export const createTranscript = (payload:any) => api.post('/admin/transcripts', payload);
export const submitTranscript = (id:number) => api.put(`/admin/transcripts/${id}/submit`);
export const listTranscripts = () => api.get('/admin/transcripts');
export const generateTranscript = (id:number) => api.post(`/admin/transcripts/${id}/generate`);
export const uploadTranscriptFile = (id:number, formData:FormData) => api.post(`/admin/transcripts/${id}/upload`, formData, { headers: {'Content-Type': 'multipart/form-data'} });
export const downloadTranscript = (id:number) => api.get(`/admin/transcripts/${id}/download`, { responseType: 'blob' });

export const facultyReport = (facultyId:number, params?:any) => api.get(`/faculties/${facultyId}/report${params?('?'+new URLSearchParams(params).toString()):''}`);

// Site settings and news
export const getSiteSettings = () => api.get('/admin/site-settings');
export const updateSiteSettings = (payload: any) => api.put('/admin/site-settings', payload);

export const listNews = () => api.get('/admin/news');
export const createNews = (payload: any) => api.post('/admin/news', payload);
export const updateNews = (id: number, payload: any) => api.put(`/admin/news/${id}`, payload);
export const deleteNews = (id: number) => api.delete(`/admin/news/${id}`);

// Super Admin functions
export const resetUserPassword = (userId: number, newPassword: string) => api.post('/admin/reset-password', { user_id: userId, new_password: newPassword });
export const activateUser = (userId: number) => api.post(`/admin/users/${userId}/activate`, {});
export const suspendUser = (userId: number, reason?: string) => api.post(`/admin/users/${userId}/suspend`, { reason });
export const updateUserRole = (userId: number, role: string) => api.put(`/admin/users/${userId}/role`, { role });
export const getAuthenticationIssues = () => api.get('/admin/auth-issues');
export const resolveAuthIssue = (issueId: number, resolution: string) => api.post(`/admin/auth-issues/${issueId}/resolve`, { resolution });
export const getUserSupportTickets = () => api.get('/admin/support-tickets');
export const createSupportTicket = (payload: any) => api.post('/admin/support-tickets', payload);
export const closeSupportTicket = (ticketId: number, resolution: string) => api.post(`/admin/support-tickets/${ticketId}/close`, { resolution });

export default api;
