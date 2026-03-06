import { request } from './api';

export async function fetchAssessmentQuestions() {
  return request('/assessments/questions');
}

export async function submitAssessment(answers) {
  return request('/assessments/submit', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}
