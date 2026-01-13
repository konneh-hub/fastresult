import React, { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../api";

type User = { id: number; email: string; role: string; full_name?: string; created_at?: string; is_super_admin?: number };

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      alert('User deleted');
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // form state
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [staffId, setStaffId] = useState('');
  const [faculty, setFaculty] = useState('');
  const [facultyList, setFacultyList] = useState<any[]>([]);

  const currentRaw = localStorage.getItem('user');
  const currentUser = currentRaw ? JSON.parse(currentRaw) : null;

  useEffect(() => {
    fetchUsers();
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/faculties');
        const data = await res.json();
        setFacultyList(data);
      } catch (e) {}
    })();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await getUsers();
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => { setRole(''); setFullName(''); setEmail(''); setStaffId(''); setFaculty(''); };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ role, fullName, email, staffId, faculty });
      resetForm();
      fetchUsers();
      alert('Created');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Create failed');
    }
  };

  return (
    <div>
      <h2>User Management (Admin)</h2>

      {currentUser && currentUser.is_super_admin && (
        <div className="admin-section">
          <h3>Create Sub-Admin (dean/hod/exam_officer)</h3>
          <form onSubmit={submitCreate}>
            <div>
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="">-- select --</option>
                <option value="dean">Dean</option>
                <option value="hod">HOD</option>
                <option value="exam_officer">Exam Officer</option>
              </select>
            </div>
            <div>
              <label>Full name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div>
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label>Staff ID</label>
              <input value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
            </div>
            <div>
              <label>Faculty</label>
              <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
                <option value="">-- (optional) --</option>
                {facultyList.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
              </select>
            </div>

            <button type="submit">Create Sub-Admin</button>
          </form>
        </div>
      )}

      {currentUser && currentUser.role === 'admin' && (
        <div className="admin-section">
          <h3>Create Staff / Lecturer</h3>
          <form onSubmit={submitCreate}>
            <div>
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="">-- select --</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label>Full name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div>
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label>Staff ID</label>
              <input value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
            </div>
            <div>
              <label>Faculty</label>
              <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
                <option value="">-- (optional) --</option>
                {facultyList.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
              </select>
            </div>

            <button type="submit">Create Staff</button>
          </form>
        </div>
      )}

      <hr />

      <div>
        <h3>Existing users</h3>
        {loading ? <div>Loading...</div> : (
          <table border={1} cellPadding={6} className="resultsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Name</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.full_name}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleString() : ''}</td>
                  <td>
                    {currentUser && currentUser.is_super_admin && currentUser.id !== u.id && !u.is_super_admin ? (
                      <button onClick={() => handleDelete(u.id)}>Delete</button>
                    ) : (
                      u.is_super_admin ? '— super-admin —' : ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
