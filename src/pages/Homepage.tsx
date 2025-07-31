
import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">LexiAI</div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Signup</Link>
        </nav>
      </header>
      <section className="hero">
        <h1>Smart Legal Search Across Indian Courts</h1>
        <p>Real-time, structured case data from High & District Courts.</p>
        <div className="cta-buttons">
          <Link to="/search" className="btn-primary">Search Now</Link>
          <Link to="/how-it-works" className="btn-secondary">See How It Works</Link>
        </div>
      </section>
      <section className="features">
        <div className="feature-card">🔍 Smart Case Search</div>
        <div className="feature-card">🏛️ Multi-Court Support</div>
        <div className="feature-card">📊 Analytics & Tracking</div>
        <div className="feature-card">🔐 Secure Access</div>
      </section>
    </div>
  );
};

export default Homepage;

