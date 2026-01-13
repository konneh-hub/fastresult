import React, { useState } from "react";
import { uploadResults } from "../api";

export default function LecturerUpload() {
  const [payloadText, setPayloadText] = useState<string>(`[
  { "studentId": 1, "courseId": 1, "ca_score": 25, "exam_score": 60, "term": "Fall", "year": 2025 }
]`);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = JSON.parse(payloadText);
      const res = await uploadResults(payload);
      setMsg(`Uploaded ${res.data.created.length} results`);
    } catch (err: any) {
      setMsg(err?.message || "Error");
    }
  };

  return (
    <div>
      <h2>Upload Results (Lecturer)</h2>
      <p>Paste JSON array of results and submit. Each item: studentId, courseId, ca_score, exam_score, term, year</p>
      <form onSubmit={submit}>
        <label htmlFor="payload">JSON Payload</label>
        <br />
        <textarea id="payload" className="payload" placeholder='[{ "studentId": 1, "courseId": 1, "ca_score": 25, "exam_score": 60 }]' value={payloadText} onChange={(e) => setPayloadText(e.target.value)} rows={8} cols={80} />
        <br />
        <button>Upload</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
