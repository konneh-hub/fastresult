import React, { useState, useEffect } from 'react';
import { getRoleLabel, getUserRole, type UserRole } from '../../utils/roleAccessControl';
import '../admin/AdminPages.css';

interface RoleResponsibility {
  title: string;
  description: string;
  access: string[];
}

interface UserRoleProfile {
  role: UserRole;
  label: string;
  description: string;
  responsibilities: RoleResponsibility[];
  permissions: string[];
}

const roleProfiles: Record<UserRole, UserRoleProfile> = {
  admin: {
    role: 'admin',
    label: 'Administrator',
    description: 'System administrator with full access and control',
    responsibilities: [
      {
        title: 'User Management',
        description: 'Create, modify, and manage user accounts and roles',
        access: ['Account Management', 'User Verification', 'Role Assignment']
      },
      {
        title: 'System Configuration',
        description: 'Configure university, academic sessions, semesters, grading templates',
        access: ['University Setup', 'Academic Sessions', 'Grading Templates']
      },
      {
        title: 'Organization Structure',
        description: 'Manage faculties, departments, programs, and courses',
        access: ['Faculties & Structure', 'Departments', 'Programs', 'Courses']
      },
      {
        title: 'Security & Access Control',
        description: 'Manage permissions, roles, and audit trails',
        access: ['Users & Roles', 'Permissions', 'Audit Logs']
      },
      {
        title: 'System Maintenance',
        description: 'Backups, integrations, and system monitoring',
        access: ['Backups', 'Integrations', 'Email Setup', 'Payment Gateway']
      },
      {
        title: 'Support & Escalations',
        description: 'Handle tickets and system escalations',
        access: ['Support Tickets', 'Escalations']
      }
    ],
    permissions: [
      'Create user accounts',
      'Modify user roles',
      'Configure system settings',
      'Access audit logs',
      'Manage backups',
      'View all user data',
      'Reset passwords',
      'View system analytics'
    ]
  },
  dean: {
    role: 'dean',
    label: 'Dean',
    description: 'Faculty-level academic administrator',
    responsibilities: [
      {
        title: 'Program Management',
        description: 'Create and manage academic programs',
        access: ['Program Listings', 'Program Details', 'GPA Rules']
      },
      {
        title: 'Result Approval',
        description: 'Review and approve course results from departments',
        access: ['Course Approvals', 'Result Verification']
      },
      {
        title: 'Faculty Analytics',
        description: 'Monitor faculty performance and student results',
        access: ['Faculty Reports', 'Performance Metrics', 'Grade Distribution']
      },
      {
        title: 'Department Coordination',
        description: 'Oversee department operations and HODs',
        access: ['Department Overview', 'HOD Supervision']
      }
    ],
    permissions: [
      'View all faculty results',
      'Approve course results',
      'Return results for revision',
      'View faculty reports',
      'Manage programs',
      'View student transcripts'
    ]
  },
  hod: {
    role: 'hod',
    label: 'Head of Department',
    description: 'Department-level academic administrator',
    responsibilities: [
      {
        title: 'Lecturer Supervision',
        description: 'Monitor lecturer result submissions and status',
        access: ['Lecturer List', 'Submission Status', 'Course Assignment']
      },
      {
        title: 'Result Review & Approval',
        description: 'Review lecturer results and approve for dean',
        access: ['Results Review', 'Approval Workflow']
      },
      {
        title: 'Department Reports',
        description: 'Generate and view department analytics',
        access: ['Department Analytics', 'Performance Reports']
      },
      {
        title: 'Course Management',
        description: 'Assign courses to lecturers',
        access: ['Course Assignment', 'Lecturer Allocation']
      }
    ],
    permissions: [
      'View department results',
      'Approve lecturer submissions',
      'Return results to lecturers',
      'Assign courses',
      'View department analytics',
      'Generate department reports'
    ]
  },
  examofficer: {
    role: 'examofficer',
    label: 'Exam Officer',
    description: 'Results compilation and publication officer',
    responsibilities: [
      {
        title: 'Results Compilation',
        description: 'Compile approved results from all departments',
        access: ['Compilation Dashboard', 'Department Results', 'Upload Management']
      },
      {
        title: 'Result Publication',
        description: 'Publish final results to students',
        access: ['Publish Control', 'Publication Schedule', 'Result Verification']
      },
      {
        title: 'Transcript Management',
        description: 'Generate and manage student transcripts',
        access: ['Transcript Generation', 'Transcript Requests', 'Transcript Distribution']
      },
      {
        title: 'Exception Handling',
        description: 'Manage result exceptions and anomalies',
        access: ['Exception Dashboard', 'Grade Discrepancies', 'Late Submissions']
      },
      {
        title: 'Senate Reporting',
        description: 'Prepare reports for senate meetings',
        access: ['Senate Reports', 'Performance Analytics', 'Grade Distribution']
      }
    ],
    permissions: [
      'Compile all results',
      'Publish results',
      'Generate transcripts',
      'View all student data',
      'Handle exceptions',
      'Create senate reports',
      'Access result analytics'
    ]
  },
  lecturer: {
    role: 'lecturer',
    label: 'Lecturer',
    description: 'Course instructor and grade provider',
    responsibilities: [
      {
        title: 'Grade Entry',
        description: 'Enter and manage student grades',
        access: ['Result Entry Dashboard', 'Grade Forms', 'Excel Upload']
      },
      {
        title: 'Result Submission',
        description: 'Submit course results for departmental review',
        access: ['Draft Management', 'Submission Workflow', 'Status Tracking']
      },
      {
        title: 'Feedback Management',
        description: 'Respond to feedback and corrections from HOD/Dean',
        access: ['Feedback Dashboard', 'Correction Forms']
      },
      {
        title: 'Analytics',
        description: 'View course and student analytics',
        access: ['Course Analytics', 'Grade Distribution', 'Performance Metrics']
      }
    ],
    permissions: [
      'Enter grades',
      'Submit results',
      'View assigned courses',
      'Upload Excel results',
      'Save drafts',
      'View course analytics',
      'Download result slips'
    ]
  },
  student: {
    role: 'student',
    label: 'Student',
    description: 'Student account with result access',
    responsibilities: [
      {
        title: 'Result Viewing',
        description: 'View your published course results',
        access: ['My Results', 'Semester View', 'Grade Details']
      },
      {
        title: 'Transcript Access',
        description: 'Access and download your academic transcript',
        access: ['Transcript View', 'Transcript Download', 'Transcript Requests']
      },
      {
        title: 'Academic Progress',
        description: 'Monitor your academic standing and progress',
        access: ['GPA Tracking', 'Progress Report', 'Academic Standing']
      },
      {
        title: 'Notifications',
        description: 'Receive result and academic notifications',
        access: ['Notification Center', 'Result Alerts']
      }
    ],
    permissions: [
      'View my results',
      'Download transcript',
      'View GPA',
      'Request official transcript',
      'Receive notifications',
      'View academic standing'
    ]
  }
};

export default function UserRoleProfile() {
  const currentRole = getUserRole();
  const profile = currentRole ? roleProfiles[currentRole] : null;
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  if (!profile) {
    return (
      <div className="admin-page">
        <div className="page-header">
          <h1>My Role & Responsibilities</h1>
          <p>Unable to load role information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>👤 My Role & Responsibilities</h1>
          <p>View your assigned role and permissions</p>
        </div>
      </div>

      {/* Role Overview */}
      <div className="status-card" style={{ marginBottom: '2rem', borderLeft: '4px solid #667eea' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>{profile.label}</h2>
            <p style={{ margin: '0', color: '#666' }}>{profile.description}</p>
          </div>
          <div>
            <h3 style={{ marginTop: '0', marginBottom: '1rem' }}>Key Permissions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {profile.permissions.map((perm, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <span style={{ color: '#4CAF50' }}>✓</span>
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsibilities Section */}
      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>📋 Key Responsibilities</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {profile.responsibilities.map((resp, idx) => (
            <div
              key={idx}
              className="status-card"
              onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: '0' }}>{resp.title}</h3>
                <span style={{ fontSize: '1.5rem' }}>{expandedSection === idx ? '▼' : '▶'}</span>
              </div>

              <p style={{ margin: '0 0 1rem 0', color: '#666' }}>{resp.description}</p>

              {expandedSection === idx && (
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginTop: '1rem'
                }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#333' }}>Access to:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {resp.access.map((access, accessIdx) => (
                      <div key={accessIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#2196F3' }}>📌</span>
                        <span style={{ fontSize: '0.95rem' }}>{access}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Information */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#E8F4F8', borderRadius: '8px', borderLeft: '4px solid #2196F3' }}>
        <h3 style={{ marginTop: '0', color: '#0277BD' }}>ℹ️ Standard Workflow</h3>
        <p style={{ margin: '0.5rem 0', color: '#555' }}>
          As a <strong>{profile.label}</strong>, you are part of the results management workflow that ensures:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem', color: '#555' }}>
          <li>Quality control and accuracy of academic results</li>
          <li>Secure and authorized data access</li>
          <li>Proper approval and verification workflows</li>
          <li>Complete audit trails of all actions</li>
          <li>Timely and transparent result publication</li>
        </ul>
      </div>

      {/* Contact & Support */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#FFF3CD', borderRadius: '8px', borderLeft: '4px solid #FF9800' }}>
        <h3 style={{ marginTop: '0', color: '#F57C00' }}>📞 Need Help?</h3>
        <p style={{ margin: '0.5rem 0', color: '#555' }}>
          If you have questions about your role or need additional access, please:
        </p>
        <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem', color: '#555' }}>
          <li><strong>Contact System Admin</strong> - For access or permission changes</li>
          <li><strong>Contact Your Department Head</strong> - For role-related queries</li>
          <li><strong>View Help Center</strong> - For tutorials and FAQs</li>
        </ul>
      </div>
    </div>
  );
}
