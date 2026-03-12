import React from 'react';
import { Link } from 'react-router-dom';

export default function CreditRequestsPage() {
  return (
    <div>
      <h2>Credit Requests</h2>
      <p>Placeholder list. Backend integration will be added later.</p>
      <ul>
        <li>
          <Link to="/credit-requests/1">Sample credit request #1</Link>
        </li>
      </ul>
    </div>
  );
}
