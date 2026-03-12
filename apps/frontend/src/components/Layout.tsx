import React from 'react';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="container">
      <nav className="nav">
        <Link to="/">Credit Requests</Link>
        <Link to="/credit-requests/create">Create</Link>
        <Link to="/login">Login</Link>
      </nav>
      <div className="card">{children}</div>
    </div>
  );
};

export default Layout;
