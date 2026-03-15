import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api, type CreditRequest } from '../services/api';
import { initSocket, onEvent } from '../realtime/socketClient';

interface CreditRequest {
  id: string;
  applicant_name: string;
  status: string;
}

export default function CreditRequestsPage() {
  const [items, setItems] = useState<CreditRequest[]>([]);

  const load = useCallback(async () => {
    // eslint-disable-next-line no-console
    console.debug('[page] load.start');
    try {
      const res = await api.creditRequests.list();
      if (res && Array.isArray(res.data)) {
        setItems(res.data);
        // eslint-disable-next-line no-console
        console.debug('[page] load.ok', res.data.length);
      } else {
        setItems([]);
        // eslint-disable-next-line no-console
        console.debug('[page] load.ok', 0);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.debug('[page] load.error', err);
    }
  }, []);

  useEffect(() => {
    load();
    initSocket();

    const handleCreated = (payload: unknown) => {
      // eslint-disable-next-line no-console
      console.debug('[socket] event credit_request.created', payload);
      // simplest, reliable approach: refetch list
      load();
    };

    const handleStatus = (payload: unknown) => {
      // eslint-disable-next-line no-console
      console.debug('[socket] event credit_request.status_changed', payload);
      load();
    };

    const offCreated = onEvent('credit_request.created', handleCreated);
    const offCreatedAlt = onEvent('credit_request_created', handleCreated);
    const offStatus = onEvent('credit_request.status_changed', handleStatus);
    const offStatusAlt = onEvent('credit_request_status_changed', handleStatus);

    return () => {
      offCreated();
      offCreatedAlt();
      offStatus();
      offStatusAlt();
    };
  }, [load]);

  return (
    <div>
      <h2>Credit Requests</h2>
      {items.length === 0 ? <p>No credit requests yet.</p> : null}
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <Link to={`/credit-requests/${it.id}`}>{it.applicant_name} — {it.status}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
