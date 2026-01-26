import React, { useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "result",
      title: "Results Published",
      message: "Your 2024/2025 semester 1 results have been published.",
      icon: "📋",
      date: "2026-01-26",
      read: false,
    },
    {
      id: 2,
      type: "announcement",
      title: "Upcoming Examination",
      message: "Final examinations for 2nd semester will commence from February 15, 2026.",
      icon: "📢",
      date: "2026-01-25",
      read: false,
    },
    {
      id: 3,
      type: "deadline",
      title: "Course Registration Deadline",
      message: "Please complete your course registration before February 10, 2026.",
      icon: "⏰",
      date: "2026-01-24",
      read: true,
    },
    {
      id: 4,
      type: "system",
      title: "System Maintenance",
      message: "The portal will be under maintenance on February 1, 2026 from 2 AM - 6 AM.",
      icon: "🔧",
      date: "2026-01-23",
      read: true,
    },
    {
      id: 5,
      type: "academic",
      title: "Scholarship Award",
      message: "Congratulations! You have been awarded the Merit Scholarship for the 2024/2025 session.",
      icon: "🏆",
      date: "2026-01-22",
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type) => {
    switch(type) {
      case "result": return "#2196f3";
      case "announcement": return "#ff9800";
      case "deadline": return "#f44336";
      case "system": return "#9c27b0";
      case "academic": return "#4caf50";
      default: return "#666";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0 }}>🔔 Notifications</h1>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All notifications read'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              padding: "10px 16px",
              background: "#2a5298",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.95em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e3c72")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2a5298")}
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={{
          background: "white",
          padding: "60px 20px",
          borderRadius: "8px",
          textAlign: "center",
          color: "#999",
        }}>
          <p style={{ fontSize: "1.2em", marginBottom: "10px" }}>📭 No notifications yet</p>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                background: "white",
                border: `1px solid ${notif.read ? "#eee" : getTypeColor(notif.type)}`,
                borderLeft: `4px solid ${getTypeColor(notif.type)}`,
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                opacity: notif.read ? 0.7 : 1,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ fontSize: "2em", minWidth: "40px", textAlign: "center" }}>
                  {notif.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1em", fontWeight: 600, color: "#333" }}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        background: getTypeColor(notif.type),
                        borderRadius: "50%",
                      }} />
                    )}
                  </div>
                  <p style={{ margin: "8px 0", color: "#666", fontSize: "0.95em" }}>
                    {notif.message}
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8em", color: "#999" }}>
                    {new Date(notif.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#e3f2fd",
                        color: "#2196f3",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85em",
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#bbdefb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#e3f2fd")}
                    >
                      ✓ Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    style={{
                      padding: "6px 12px",
                      background: "#ffebee",
                      color: "#f44336",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.85em",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#ffcdd2")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#ffebee")}
                  >
                    ✕ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
