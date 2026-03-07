import { request } from './api';

function mapTimelineItem(item) {
  return {
    id: item.id,
    title: item.title || '',
    dueDate: item.due_date || '',
    category: item.category || 'General',
    notes: item.notes || '',
    status: item.status || 'pending',
    createdAt: item.created_at || '',
    updatedAt: item.updated_at || '',
  };
}

export async function fetchTimelineItems() {
  const data = await request('/timeline');
  return data.map(mapTimelineItem);
}

export async function fetchImportantTimeline() {
  const data = await request('/timeline/important');
  return data.map((item) => ({
    id: item.id,
    title: item.title || '',
    date: item.date || '',
    category: item.category || 'general',
    source: item.source || '',
    notes: item.notes || '',
  }));
}

export async function createTimelineItem(payload) {
  const data = await request('/timeline', {
    method: 'POST',
    body: JSON.stringify({
      title: payload.title,
      due_date: payload.dueDate || null,
      category: payload.category || null,
      notes: payload.notes || null,
      status: payload.status || 'pending',
    }),
  });
  return mapTimelineItem(data);
}

export async function updateTimelineItem(id, payload) {
  const data = await request(`/timeline/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: payload.title,
      due_date: payload.dueDate,
      category: payload.category,
      notes: payload.notes,
      status: payload.status,
    }),
  });
  return mapTimelineItem(data);
}

export async function deleteTimelineItem(id) {
  await request(`/timeline/${id}`, { method: 'DELETE' });
}
