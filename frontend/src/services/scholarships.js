import { request } from './api';

function mapScholarship(item) {
  return {
    id: item.id,
    name: item.name,
    provider: item.provider || '',
    amount: item.amount || '',
    deadline: item.deadline || '',
    eligibility: item.eligibility || '',
    category: item.category || 'General',
    description: item.description || '',
    applicationLink: item.application_link || '',
  };
}

export async function fetchScholarships({ q = '', category = '' } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category && category !== 'all') params.set('category', category);
  const data = await request(`/scholarships?${params.toString()}`);
  return data.map(mapScholarship);
}
