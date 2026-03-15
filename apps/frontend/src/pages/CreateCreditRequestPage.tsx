import React, { useState } from 'react';
import { api } from '../services/api';

export default function CreateCreditRequestPage() {
  const [form, setForm] = useState({ country_code: 'PT', applicant_name: '', document_number: '', monthly_income: '', requested_amount: '', currency: 'EUR' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        country_code: form.country_code,
        applicant_name: form.applicant_name,
        document_number: form.document_number,
        monthly_income: Number(form.monthly_income),
        requested_amount: Number(form.requested_amount),
        currency: form.currency
      };
      await api.creditRequests.create(payload);
      setSuccess('Credit request created');
      setForm({ country_code: form.country_code, applicant_name: '', document_number: '', monthly_income: '', requested_amount: '', currency: form.currency });
    } catch (err: any) {
      setError(err?.message || 'Failed to create');
    }
  };

  return (
    <div>
      <h2>Create Credit Request</h2>
      <form onSubmit={submit}>
        <div>
          <label>Country code</label>
          <input value={form.country_code} onChange={(e) => onChange('country_code', e.target.value)} />
        </div>
        <div>
          <label>Applicant name</label>
          <input value={form.applicant_name} onChange={(e) => onChange('applicant_name', e.target.value)} />
        </div>
        <div>
          <label>Document number</label>
          <input value={form.document_number} onChange={(e) => onChange('document_number', e.target.value)} />
        </div>
        <div>
          <label>Monthly income</label>
          <input value={form.monthly_income} onChange={(e) => onChange('monthly_income', e.target.value)} />
        </div>
        <div>
          <label>Requested amount</label>
          <input value={form.requested_amount} onChange={(e) => onChange('requested_amount', e.target.value)} />
        </div>
        <div>
          <label>Currency</label>
          <input value={form.currency} onChange={(e) => onChange('currency', e.target.value)} />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}
      {success ? <div style={{ color: 'green' }}>{success}</div> : null}
    </div>
  );
}
