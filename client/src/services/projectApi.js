const apiBaseUrl = import.meta.env.VITE_API_URL || (window.location.hostname.endsWith('vercel.app') ? 'https://server-virid-one-67.vercel.app/api' : 'http://localhost:5000/api');

function normalizeProject(project) {
  return { ...project, id: project.id || project._id };
}

// This function loads published projects publicly or all projects for the authenticated admin.
export async function fetchProjects(includeDrafts = false) {
  const response = await fetch(`${apiBaseUrl}/projects${includeDrafts ? '' : '/published'}`, { credentials: 'include' });
  if (!response.ok) throw new Error('Could not load portfolio projects.');
  return (await response.json()).map(normalizeProject);
}

// This function creates a project in the shared backend database.
export async function createRemoteProject(project) {
  const response = await fetch(`${apiBaseUrl}/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(project) });
  if (!response.ok) throw new Error('Could not create project.');
  return normalizeProject(await response.json());
}

// This function updates a shared project, including its published or draft status.
export async function updateRemoteProject(project) {
  const response = await fetch(`${apiBaseUrl}/projects/${project.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(project) });
  if (!response.ok) throw new Error('Could not update project.');
  return normalizeProject(await response.json());
}

// This function removes a project from the shared backend database.
export async function deleteRemoteProject(projectId) {
  const response = await fetch(`${apiBaseUrl}/projects/${projectId}`, { method: 'DELETE', credentials: 'include' });
  if (!response.ok) throw new Error('Could not delete project.');
}
