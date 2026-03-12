import React from 'react';
import { useParams } from 'react-router-dom';

export default function CreditRequestDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h2>Credit Request {id}</h2>
      <p>Detail placeholder. Integration pending.</p>
    </div>
  );
}
