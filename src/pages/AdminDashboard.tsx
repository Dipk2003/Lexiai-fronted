
import React, { useState, useEffect } from "react";
import { apiService } from '../services/api';
import "./AdminDashboard.css";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSearches: number;
  searchesToday: number;
  totalCases: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalSearches: 0,
    searchesToday: 0,
    totalCases: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsData = await apiService.getAdminStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <div className="admin-dashboard loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="logo">Admin</div>
        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Users</a>
          <a href="#">Search Analytics</a>
          <a href="#">Scraper Config</a>
          <a href="#">System Logs</a>
          <a href="#">Logout</a>
        </nav>
      </aside>
      <main className="main-content">
        <h2>Dashboard</h2>
        <div className="stats">
          <div className="stat-card">
            <h4>Total Users</h4>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h4>Active Users</h4>
            <p>{stats.activeUsers}</p>
          </div>
          <div className="stat-card">
            <h4>Total Searches</h4>
            <p>{stats.totalSearches}</p>
          </div>
          <div className="stat-card">
            <h4>Searches Today</h4>
            <p>{stats.searchesToday}</p>
          </div>
          <div className="stat-card">
            <h4>Total Cases</h4>
            <p>{stats.totalCases}</p>
          </div>
        </div>
        <div className="charts">
          <div className="chart-box">
            <h4>Daily Search Volume</h4>
            <div className="chart-placeholder">[Line Chart]</div>
          </div>
          <div className="chart-box">
            <h4>Search Distribution by Court</h4>
            <div className="chart-placeholder">[Pie Chart]</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
