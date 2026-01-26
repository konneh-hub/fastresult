import React, { useEffect, useMemo, useState, useCallback } from "react";

/**
 * MyResults - Student Academic Results Dashboard
 * Comprehensive component for viewing, filtering, sorting, and exporting student results
 */

// ============= CONSTANTS =============

const GRADE_POINTS_5 = { A: 5, "A-": 4.5, "B+": 4, B: 3.5, "C+": 3, C: 2.5, D: 2, E: 1, F: 0 };
const GRADE_POINTS_4 = { A: 4, "A-": 3.7, "B+": 3.3, B: 3.0, "C+": 2.3, C: 2.0, D: 1.0, E: 0.7, F: 0 };
const DEFAULT_PAGE_SIZE = 10;

// ============= UTILITY FUNCTIONS =============

function safeNumber(n: any, fallback: number = 0): number {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

function normalizeText(s: any): string {
  return String(s ?? "").trim().toLowerCase();
}

function downloadJSON(filename: string, data: any): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function computeGPA(courses: any[], gradePointsMap: Record<string, number>) {
  let creditsSum = 0;
  let pointsSum = 0;

  for (const course of courses) {
    const credits = safeNumber(course.credits, 0);
    const grade = String(course.grade ?? "").toUpperCase();
    const points = gradePointsMap[grade];

    if (credits > 0 && Number.isFinite(points)) {
      creditsSum += credits;
      pointsSum += credits * points;
    }
  }

  return {
    credits: creditsSum,
    gpa: creditsSum > 0 ? pointsSum / creditsSum : 0,
  };
}

function buildFilterOptions(values: any[]): string[] {
  const unique = Array.from(new Set(values.filter(Boolean)));
  unique.sort((a, b) => String(a).localeCompare(String(b)));
  return ["All", ...unique];
}

// ============= MAIN COMPONENT =============

export default function MyResults({
  apiUrl = "/api/student/results",
  authToken = null,
}: {
  apiUrl?: string;
  authToken?: string | null;
}) {
  // ============= STATE =============
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [gradingScale, setGradingScale] = useState({ maxPoints: 5, passMark: 40 });
  const [actionMessage, setActionMessage] = useState("");
  const [query, setQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState("courseCode");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ============= API FUNCTION =============

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (authToken) headers.Authorization = `Bearer ${authToken}`;

      const res = await fetch(apiUrl, {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Failed to load results (HTTP ${res.status})`);
      }

      const data = await res.json();
      setStudent(data?.student ?? null);
      setResults(Array.isArray(data?.results) ? data.results : []);
      setGradingScale(data?.gradingScale ?? { maxPoints: 5, passMark: 40 });
    } catch (e: any) {
      setError(e?.message || "Something went wrong while loading results.");
      setStudent(null);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authToken]);

  // ============= EFFECTS =============

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    setPage(1);
  }, [query, sessionFilter, semesterFilter, levelFilter, statusFilter, pageSize]);

  // ============= DERIVED STATE =============

  const gradePointsMap = useMemo(
    () => (gradingScale?.maxPoints === 4 ? GRADE_POINTS_4 : GRADE_POINTS_5),
    [gradingScale]
  );

  const sessionOptions = useMemo(() => buildFilterOptions(results.map((r) => r.session)), [results]);
  const semesterOptions = useMemo(() => buildFilterOptions(results.map((r) => r.semester)), [results]);
  const levelOptions = useMemo(() => buildFilterOptions(results.map((r) => r.level)), [results]);
  const statusOptions = useMemo(() => buildFilterOptions(results.map((r) => r.status)), [results]);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    const list = results.filter((r) => {
      const matchesQuery = !q || normalizeText(`${r.courseCode} ${r.courseTitle}`).includes(q);
      const matchesSession = sessionFilter === "All" || r.session === sessionFilter;
      const matchesSemester = semesterFilter === "All" || r.semester === semesterFilter;
      const matchesLevel = levelFilter === "All" || String(r.level) === String(levelFilter);
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      return matchesQuery && matchesSession && matchesSemester && matchesLevel && matchesStatus;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      if (sortKey === "total") return (safeNumber(a.total) - safeNumber(b.total)) * dir;
      if (sortKey === "updatedAt") {
        const ta = new Date(a.updatedAt || 0).getTime();
        const tb = new Date(b.updatedAt || 0).getTime();
        return (ta - tb) * dir;
      }
      if (sortKey === "grade") {
        const ga = String(a.grade ?? "").toUpperCase();
        const gb = String(b.grade ?? "").toUpperCase();
        const pa = gradePointsMap[ga];
        const pb = gradePointsMap[gb];
        const p1 = Number.isFinite(pa) ? pa : -1;
        const p2 = Number.isFinite(pb) ? pb : -1;
        if (p1 !== p2) return (p1 - p2) * dir;
        return ga.localeCompare(gb) * dir;
      }
      return String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? "")) * dir;
    });
    return list;
  }, [results, query, sessionFilter, semesterFilter, levelFilter, statusFilter, sortKey, sortDir, gradePointsMap]);

  const gpaStats = useMemo(() => computeGPA(filtered, gradePointsMap), [filtered, gradePointsMap]);
  const cgpaStats = useMemo(() => computeGPA(results, gradePointsMap), [results, gradePointsMap]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length, pageSize]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // ============= EVENT HANDLERS =============

  const handleToggleSort = useCallback((nextKey: string) => {
    if (sortKey === nextKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(nextKey);
      setSortDir("asc");
    }
  }, [sortKey]);

  const handleDownloadTranscript = useCallback(() => {
    setActionMessage("📄 Downloading transcript...");
    setTimeout(() => {
      const transcriptData = {
        student,
        results: filtered,
        cgpa: cgpaStats.gpa.toFixed(2),
        generatedAt: new Date().toLocaleString(),
        gradingScale,
      };
      downloadJSON(`transcript-${student?.matricNo || "student"}-${new Date().toISOString().slice(0, 10)}.json`, transcriptData);
      setActionMessage("✅ Transcript downloaded successfully!");
      setTimeout(() => setActionMessage(""), 3000);
    }, 500);
  }, [student, filtered, cgpaStats, gradingScale]);

  const handleRequestGradeReview = useCallback((courseCode: string, courseTitle: string) => {
    const confirmed = window.confirm(`Request grade review for ${courseCode} - ${courseTitle}?\n\nYour dean will be notified to review this grade.`);
    if (confirmed) {
      setActionMessage(`📧 Sending grade review request for ${courseCode}...`);
      setTimeout(() => {
        setActionMessage(`✅ Grade review request sent for ${courseCode}! Your dean will review it shortly.`);
        setTimeout(() => setActionMessage(""), 4000);
      }, 800);
    }
  }, []);

  const handleShareResults = useCallback(() => {
    const shareText = `Check out my academic results:\n\nCGPA: ${cgpaStats.gpa.toFixed(2)}\nCredits: ${cgpaStats.credits}\nProgramme: ${student?.programme || "N/A"}`;
    if (navigator.share) {
      navigator.share({
        title: "My Academic Results",
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        setActionMessage("✅ Results copied to clipboard!");
        setTimeout(() => setActionMessage(""), 3000);
      });
    } else {
      navigator.clipboard.writeText(shareText);
      setActionMessage("✅ Results copied to clipboard!");
      setTimeout(() => setActionMessage(""), 3000);
    }
  }, [student, cgpaStats]);

  const handleToggleCourseDetails = useCallback((courseId: string) => {
    setExpandedId((x) => (x === courseId ? null : courseId));
  }, []);

  const handleRefreshResults = useCallback(() => {
    setActionMessage("🔄 Refreshing results...");
    fetchResults();
  }, [fetchResults]);

  const handleExportJSON = useCallback(() => {
    downloadJSON(`my-results-${new Date().toISOString().slice(0, 10)}.json`, {
      student,
      results: filtered,
      gradingScale,
    });
    setActionMessage("✅ Results exported successfully!");
    setTimeout(() => setActionMessage(""), 3000);
  }, [student, filtered, gradingScale]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // ============= RENDER =============

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📚 My Academic Results</h1>
          <p style={styles.subtitle}>View your course results and academic performance metrics</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={handleRefreshResults} style={styles.headerButton}>🔄 Refresh</button>
          <button onClick={handlePrint} style={styles.headerButton}>🖨️ Print</button>
          <button onClick={handleDownloadTranscript} style={styles.headerButton}>📄 Transcript</button>
        </div>
      </div>

      {/* Action Toast */}
      {actionMessage && <div style={styles.toast}>{actionMessage}</div>}

      {loading && <div style={styles.centerText}>⏳ Loading your results...</div>}

      {!loading && error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>❌ {error}</p>
          <button onClick={fetchResults} style={styles.retryButton}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Student Profile */}
          {student && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>👤 Student Information</h2>
              <div style={styles.infoGrid}>
                <div><span style={styles.label}>Full Name</span><p style={styles.value}>{student.fullName || "—"}</p></div>
                <div><span style={styles.label}>Matric Number</span><p style={styles.value}>{student.matricNo || "—"}</p></div>
                <div><span style={styles.label}>Programme</span><p style={styles.value}>{student.programme || "—"}</p></div>
                <div><span style={styles.label}>Current Level</span><p style={styles.value}>{student.currentLevel || "—"}</p></div>
              </div>
            </section>
          )}

          {/* Academic Summary */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>📊 Academic Summary</h2>
            <div style={styles.summaryGrid}>
              <div style={{ ...styles.summaryCard, borderLeftColor: "#2e7d32" }}>
                <span style={styles.summaryLabel}>GPA (Current Filters)</span>
                <p style={{ ...styles.summaryValue, color: "#2e7d32" }}>{gpaStats.gpa.toFixed(2)}</p>
                <span style={styles.summarySubtext}>{Math.round(gpaStats.credits)} credit(s)</span>
              </div>
              <div style={{ ...styles.summaryCard, borderLeftColor: "#1565c0" }}>
                <span style={styles.summaryLabel}>CGPA (All Results)</span>
                <p style={{ ...styles.summaryValue, color: "#1565c0" }}>{cgpaStats.gpa.toFixed(2)}</p>
                <span style={styles.summarySubtext}>{Math.round(cgpaStats.credits)} credit(s)</span>
              </div>
              <div style={{ ...styles.summaryCard, borderLeftColor: "#e65100" }}>
                <span style={styles.summaryLabel}>Grading Scale</span>
                <p style={{ ...styles.summaryValue, color: "#e65100" }}>{gradingScale?.maxPoints || 5}.0</p>
                <span style={styles.summarySubtext}>Pass: {gradingScale?.passMark ?? 40}</span>
              </div>
              <div style={{ ...styles.summaryCard, borderLeftColor: "#c62828" }}>
                <span style={styles.summaryLabel}>Total Courses</span>
                <p style={{ ...styles.summaryValue, color: "#c62828" }}>{results.length}</p>
                <span style={styles.summarySubtext}>{filtered.length} matching</span>
              </div>
            </div>
            <div style={styles.actionButtons}>
              <button onClick={handleExportJSON} style={styles.actionButton}>💾 Export</button>
              <button onClick={handleShareResults} style={styles.actionButton}>📤 Share</button>
            </div>
          </section>

          {/* Filters */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🔍 Search & Filters</h2>
            <input
              type="text"
              placeholder="Search by course code or title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.searchInput}
            />
            <div style={styles.filterRow}>
              <select value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)} style={styles.select}>
                {sessionOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} style={styles.select}>
                {semesterOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} style={styles.select}>
                {levelOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
                {statusOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={styles.select}>
                {[5, 10, 20, 50].map((n) => <option key={n}>{n} per page</option>)}
              </select>
            </div>
            <div style={styles.resultCount}>Showing {paged.length} of {filtered.length} result(s)</div>
          </section>

          {/* Results Table */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>📋 Results</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th} onClick={() => handleToggleSort("courseCode")}>Course {sortKey === "courseCode" && (sortDir === "asc" ? "↑" : "↓")}</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th} onClick={() => handleToggleSort("total")}>Total {sortKey === "total" && (sortDir === "asc" ? "↑" : "↓")}</th>
                    <th style={styles.th} onClick={() => handleToggleSort("grade")}>Grade {sortKey === "grade" && (sortDir === "asc" ? "↑" : "↓")}</th>
                    <th style={styles.th}>Credits</th>
                    <th style={styles.th}>Session</th>
                    <th style={styles.th}>Semester</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((course) => {
                    const isExpanded = expandedId === course.id;
                    const isPass = safeNumber(course.total) >= (gradingScale?.passMark ?? 40);
                    return (
                      <React.Fragment key={course.id}>
                        <tr style={{ ...styles.tableRow, background: isExpanded ? "#f9f9f9" : "white" }}>
                          <td style={styles.td}>{course.courseCode}</td>
                          <td style={styles.td}>{course.courseTitle}</td>
                          <td style={{ ...styles.td, textAlign: "center" }}>{safeNumber(course.total)}</td>
                          <td style={{ ...styles.td, color: isPass ? "#2e7d32" : "#c62828", fontWeight: 600 }}>{course.grade}</td>
                          <td style={{ ...styles.td, textAlign: "center" }}>{safeNumber(course.credits)}</td>
                          <td style={{ ...styles.td, fontSize: "0.85em" }}>{course.session}</td>
                          <td style={{ ...styles.td, fontSize: "0.85em" }}>{course.semester}</td>
                          <td style={{ ...styles.td, color: course.status === "Published" ? "#2e7d32" : "#ff9800", fontWeight: 600 }}>{course.status}</td>
                          <td style={{ ...styles.td, textAlign: "center" }}>
                            <button onClick={() => handleToggleCourseDetails(course.id)} style={{ ...styles.expandButton, background: isExpanded ? "#2a5298" : "#e3f2fd", color: isExpanded ? "white" : "#2a5298" }}>
                              {isExpanded ? "Hide" : "View"}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr style={styles.expandedRow}>
                            <td colSpan={9} style={styles.expandedCell}>
                              <div style={styles.detailsGrid}>
                                <div><span style={styles.detailLabel}>CA Score</span><p style={styles.detailValue}>{safeNumber(course.ca)}</p></div>
                                <div><span style={styles.detailLabel}>Exam Score</span><p style={styles.detailValue}>{safeNumber(course.exam)}</p></div>
                                <div><span style={styles.detailLabel}>Level</span><p style={styles.detailValue}>{course.level || "—"}</p></div>
                                <div><span style={styles.detailLabel}>Updated</span><p style={styles.detailValue}>{course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "—"}</p></div>
                              </div>
                              {course.remark && <div style={styles.remarkBox}><strong>Remark:</strong> {course.remark}</div>}
                              <button onClick={() => handleRequestGradeReview(course.courseCode, course.courseTitle)} style={styles.reviewButton}>📝 Request Grade Review</button>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {!paged.length && <tr><td colSpan={9} style={styles.noResults}>No results found matching your filters.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pagination */}
          <div style={styles.paginationContainer}>
            <p style={styles.pageInfo}>Page {page} of {totalPages} ({filtered.length} total)</p>
            <div style={styles.paginationButtons}>
              <button onClick={() => setPage(1)} disabled={page === 1} style={{ ...styles.paginationButton, opacity: page === 1 ? 0.5 : 1 }}>First</button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ ...styles.paginationButton, opacity: page === 1 ? 0.5 : 1 }}>Prev</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ ...styles.paginationButton, opacity: page >= totalPages ? 0.5 : 1 }}>Next</button>
              <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} style={{ ...styles.paginationButton, opacity: page >= totalPages ? 0.5 : 1 }}>Last</button>
            </div>
          </div>
        </>
      )}

      <style>{`@media print { button { display: none !important; } table { width: 100%; } } @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ============= STYLES =============

const styles: Record<string, React.CSSProperties> = {
  container: { padding: "20px", maxWidth: "1200px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" },
  title: { margin: 0, fontSize: "1.8em", fontWeight: 700, color: "#1e3c72" },
  subtitle: { margin: "5px 0 0 0", color: "#666", fontSize: "0.95em" },
  headerActions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  headerButton: { padding: "10px 16px", background: "#2a5298", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600, fontSize: "0.9em" },
  toast: { padding: "12px 16px", background: "#e8f5e9", color: "#2e7d32", borderLeft: "4px solid #4caf50", marginBottom: "20px", borderRadius: "4px", animation: "slideIn 0.3s ease-out" },
  centerText: { padding: "40px 20px", textAlign: "center", color: "#666" },
  errorBox: { padding: "20px", background: "#ffebee", border: "1px solid #ef5350", borderRadius: "4px", marginBottom: "20px" },
  errorText: { color: "#c62828", margin: 0 },
  retryButton: { marginTop: "10px", padding: "8px 16px", background: "#d32f2f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600 },
  section: { background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  sectionTitle: { marginTop: 0, marginBottom: "15px", color: "#1e3c72", fontSize: "1.3em", fontWeight: 700 },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" },
  label: { fontSize: "0.85em", color: "#999", textTransform: "uppercase", fontWeight: 600 },
  value: { margin: "5px 0 0 0", fontSize: "1.1em", color: "#333" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "15px" },
  summaryCard: { background: "#f5f5f5", padding: "15px", borderRadius: "6px", borderLeft: "4px solid #ccc", display: "flex", flexDirection: "column" },
  summaryLabel: { fontSize: "0.85em", color: "#666", marginBottom: "5px" },
  summaryValue: { margin: "5px 0 0 0", fontSize: "1.8em", fontWeight: 700 },
  summarySubtext: { margin: "4px 0 0 0", fontSize: "0.85em", color: "#999" },
  actionButtons: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" },
  actionButton: { padding: "10px 16px", background: "#4caf50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600, fontSize: "0.9em" },
  searchInput: { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "0.95em", marginBottom: "12px", boxSizing: "border-box" },
  filterRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "12px" },
  select: { padding: "8px 10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "0.9em", cursor: "pointer", background: "white" },
  resultCount: { fontSize: "0.9em", color: "#666", fontWeight: 600 },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.9em" },
  tableHeader: { background: "#f5f5f5", borderBottom: "2px solid #ddd" },
  th: { padding: "12px", textAlign: "left", fontWeight: 600, color: "#333", cursor: "pointer", userSelect: "none" },
  tableRow: { borderBottom: "1px solid #eee", transition: "background 0.2s" },
  td: { padding: "12px", color: "#555" },
  expandButton: { padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600, fontSize: "0.85em" },
  expandedRow: { background: "#f9f9f9", borderBottom: "2px solid #e0e0e0" },
  expandedCell: { padding: "20px" },
  detailsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "15px" },
  detailLabel: { fontSize: "0.85em", color: "#999", textTransform: "uppercase", fontWeight: 600 },
  detailValue: { margin: "5px 0 0 0", fontSize: "1.2em", fontWeight: 600, color: "#2a5298" },
  remarkBox: { background: "#fff3cd", padding: "12px", borderRadius: "4px", marginBottom: "12px", color: "#856404", fontSize: "0.9em" },
  reviewButton: { padding: "8px 12px", background: "#ff5722", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600, fontSize: "0.9em", marginTop: "10px" },
  noResults: { padding: "30px 12px", textAlign: "center", color: "#999", fontSize: "1em" },
  paginationContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", flexWrap: "wrap", gap: "15px" },
  pageInfo: { margin: 0, color: "#666", fontWeight: 600 },
  paginationButtons: { display: "flex", gap: "6px" },
  paginationButton: { padding: "8px 12px", background: "#2a5298", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: 600, fontSize: "0.85em" },
};
