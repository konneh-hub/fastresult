import React, { useEffect, useState } from "react";
import { getMyResults, submitResults } from "../api";

export default function LecturerResults() {
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    getMyResults().then((r: any) => setResults(r.data)).catch((e: any) => console.error(e));
  }, []);

  const toggle = (id: number) => {
    setSelected((s: number[]) => (s.includes(id) ? s.filter((x: number) => x !== id) : [...s, id]));
  };

  const submit = async () => {
    if (selected.length === 0) return;
    await submitResults(selected);
    alert("Submitted for dept validation");
    // refresh
    getMyResults().then((r) => setResults(r.data));
    setSelected([]);
  };

  return (
    <div>
      <h2>My Results (Lecturer)</h2>
      <button onClick={submit} disabled={selected.length === 0}>Submit Selected</button>
      <table border={1} cellPadding={6} className="resultsTable">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Student</th>
            <th>Course</th>
            <th>CA</th>
            <th>Exam</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r: any) => (
            <tr key={r.id}>
              <td><input aria-label={`Select result ${r.id}`} type="checkbox" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} /></td>
              <td>{r.id}</td>
              <td>{r.studentId}</td>
              <td>{r.courseId}</td>
              <td>{r.caScore}</td>
              <td>{r.examScore}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
