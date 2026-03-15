import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, type CreditRequest } from '../services/api';
import { initSocket, onEvent } from '../realtime/socketClient';

export default function CreditRequestDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<{ creditRequest?: CreditRequest; history?: unknown[] } | CreditRequest | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await api.creditRequests.get(id);
        setData(res);
      } catch (err) {
        // ignore
      }
    })();
  }, [id]);

  useEffect(() => {
    initSocket();
    function isCreditRequest(x: unknown): x is CreditRequest {
      return !!x && typeof x === 'object' && 'id' in (x as Record<string, unknown>) && typeof ((x as Record<string, unknown>).id) === 'string';
    }

    function unwrapPayload(p: unknown): CreditRequest | null {
      if (!p) return null;
      if (isCreditRequest(p)) return p as CreditRequest;
      if (typeof p === 'object' && p !== null && 'creditRequest' in (p as Record<string, unknown>)) {
        const inner = (p as Record<string, unknown>)['creditRequest'];
        if (isCreditRequest(inner)) return inner as CreditRequest;
      }
      return null;
    }

    const handleStatus = (payload: unknown) => {
      const cr = unwrapPayload(payload);
      if (!cr || !id) return;
      if (cr.id === id) {
        // eslint-disable-next-line no-console
        console.debug('[detail] status_changed for current id, refetching');
        (async () => {
          try {
            const res = await api.creditRequests.get(id);
            setData(res);
          } catch (_) {
            // ignore
          }
        })();
      }
    };

    const off = onEvent('credit_request.status_changed', handleStatus);
    const offAlt = onEvent('credit_request_status_changed', handleStatus);
    return () => {
      off();
      offAlt();
    };
  }, [id]);

  return (
    <div>
      <h2>Credit Request {id}</h2>
      {!data ? <p>Loading...</p> : (
        <div>
          <p>Applicant: {data.creditRequest?.applicant_name ?? data.applicant_name}</p>
          <p>Status: {data.creditRequest?.status ?? data.status}</p>
        </div>
      )}
    </div>
  );
}
