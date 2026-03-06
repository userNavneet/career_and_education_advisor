import { request } from './api';

function mapCareer(item) {
  return {
    id: item.id,
    title: item.title,
    field: item.field || '',
    description: item.description || '',
    averageSalary: item.average_salary || '',
    education: item.education_required || '',
    skills: item.skills || [],
    growthRate: item.growth_rate || '',
    demandLevel: item.demand_level || '',
    image: item.image_url || '',
  };
}

export async function fetchCareers({ q = '', field = '', skill = '' } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (field && field !== 'all') params.set('field', field);
  if (skill) params.set('skill', skill);
  const data = await request(`/careers?${params.toString()}`);
  return data.map(mapCareer);
}
