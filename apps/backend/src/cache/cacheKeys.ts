export const creditRequestsListKey = (filters?: { country_code?: string; status?: string }) => {
  const parts: string[] = ['credit_requests:list'];
  if (filters?.country_code) parts.push(`country:${filters.country_code}`);
  if (filters?.status) parts.push(`status:${filters.status}`);
  return parts.join(':');
};

export const creditRequestByIdKey = (id: string) => `credit_requests:by_id:${id}`;
