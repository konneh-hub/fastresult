import React, { useEffect, useState } from 'react';
import { listFaculties, createFaculty, createDepartment, createProgram } from '../api';

export default function AdminFaculties(){
  const [faculties, setFaculties] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [deptName, setDeptName] = useState('');
  const [progName, setProgName] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<number | ''>('');
  const [selectedDepartment, setSelectedDepartment] = useState<number | ''>('');

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await listFaculties();
        setFaculties(res.data);
      }catch(e){console.error(e)}
    })();
  },[]);

  useEffect(()=>{
    (async ()=>{
      if(!selectedFaculty){ setDepartments([]); return; }
      try{
        const res = await fetch(`http://localhost:4000/api/departments?facultyId=${selectedFaculty}`);
        const d = await res.json();
        setDepartments(d);
      }catch(e){ setDepartments([]); }
    })();
  }, [selectedFaculty]);

  useEffect(()=>{
    (async ()=>{
      if(!selectedDepartment){ setPrograms([]); return; }
      try{
        const res = await fetch(`http://localhost:4000/api/programs?departmentId=${selectedDepartment}`);
        const p = await res.json();
        setPrograms(p);
      }catch(e){ setPrograms([]); }
    })();
  }, [selectedDepartment]);

  const submit = async (e: React.FormEvent) =>{
    e.preventDefault();
    try{
      await createFaculty(name);
      setName('');
      const res = await listFaculties();
      setFaculties(res.data);
      alert('Created');
    }catch(err:any){ alert(err.response?.data?.message || 'Create failed'); }
  }

  const submitDept = async (e: React.FormEvent) =>{
    e.preventDefault();
    try{
      await createDepartment(Number(selectedFaculty), deptName);
      setDeptName('');
      const res = await fetch(`http://localhost:4000/api/departments?facultyId=${selectedFaculty}`);
      setDepartments(await res.json());
      alert('Created department');
    }catch(err:any){ alert(err.response?.data?.message || 'Create failed'); }
  }

  const submitProg = async (e: React.FormEvent) =>{
    e.preventDefault();
    try{
      await createProgram(Number(selectedDepartment), progName);
      setProgName('');
      const res = await fetch(`http://localhost:4000/api/programs?departmentId=${selectedDepartment}`);
      setPrograms(await res.json());
      alert('Created program');
    }catch(err:any){ alert(err.response?.data?.message || 'Create failed'); }
  }

  return (
    <div>
      <h2>Faculties</h2>
      <form onSubmit={submit}>
        <label>New Faculty</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} required />
        <button type="submit">Create</button>
      </form>

      <hr />

      <div>
        <h3>Departments</h3>
        <div>
          <label>Faculty</label>
          <select value={selectedFaculty as any} onChange={(e)=>setSelectedFaculty(e.target.value?Number(e.target.value):'')}>
            <option value="">-- select faculty --</option>
            {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <form onSubmit={submitDept}>
          <label>Department name</label>
          <input value={deptName} onChange={(e)=>setDeptName(e.target.value)} required />
          <button type="submit">Create Department</button>
        </form>

        <ul>
          {departments.map(d => <li key={d.id}>{d.name}</li>)}
        </ul>
      </div>

      <hr />

      <div>
        <h3>Programs</h3>
        <div>
          <label>Department</label>
          <select value={selectedDepartment as any} onChange={(e)=>setSelectedDepartment(e.target.value?Number(e.target.value):'')}>
            <option value="">-- select department --</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <form onSubmit={submitProg}>
          <label>Program name</label>
          <input value={progName} onChange={(e)=>setProgName(e.target.value)} required />
          <button type="submit">Create Program</button>
        </form>

        <ul>
          {programs.map(p => <li key={p.id}>{p.name}</li>)}
        </ul>
      </div>

    </div>
  );
}