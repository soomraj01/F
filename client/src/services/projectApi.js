const apiBaseUrl = import.meta.env.VITE_API_URL || (window.location.hostname.endsWith('vercel.app') ? 'https://server-virid-one-67.vercel.app/api' : 'http://localhost:5000/api');

function normalizeProject(project) {
  return { ...project, id: project.id || project._id };
}

// This function preserves the backend's useful error message for the admin form.
async function parseResponse(response, fallbackMessage) {
  let data = {};
  try { data = await response.json(); } catch { /* The server may return an empty error response. */ }
  if (!response.ok) throw new Error(data.message || `${fallbackMessage} (HTTP ${response.status}).`);
  return data;
}

// This function loads published projects publicly or all projects for the authenticated admin.
export async function fetchProjects(includeDrafts = false) {
  const response = await fetch(`${apiBaseUrl}/projects${includeDrafts ? '' : '/published'}`, { credentials: 'include' });
  return (await parseResponse(response, 'Could not load portfolio projects.')).map(normalizeProject);
}

// This function creates a project in the shared backend database.
export async function createRemoteProject(project) {
  const response = await fetch(`${apiBaseUrl}/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(project) });
  return normalizeProject(await parseResponse(response, 'Could not create project.'));
}

// This function updates a shared project, including its published or draft status.
export async function updateRemoteProject(project) {
  const response = await fetch(`${apiBaseUrl}/projects/${project.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(project) });
  return normalizeProject(await parseResponse(response, 'Could not update project.'));
}

// This function removes a project from the shared backend database.
export async function deleteRemoteProject(projectId) {
  const response = await fetch(`${apiBaseUrl}/projects/${projectId}`, { method: 'DELETE', credentials: 'include' });
  await parseResponse(response, 'Could not delete project.');
}
