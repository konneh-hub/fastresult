import React, { useEffect, useState } from "react";
import { getUsers } from "../api";

type User = { id: number; email: string; role: string; firstName?: string; lastName?: string };

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then((r: any) => setUsers(r.data)).catch((e: any) => console.error(e));
  }, []);

  return (
    <div>
      <h2>User Management (Admin)</h2>
      <table border={1} cellPadding={6} className="resultsTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{`${u.firstName || ""} ${u.lastName || ""}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
