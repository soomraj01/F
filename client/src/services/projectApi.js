const apiBaseUrl = import.meta.env.VITE_API_URL || (window.location.hostname.endsWith('vercel.app') ? 'https://server-virid-one-67.vercel.app/api' : 'http://localhost:5000/api');

function normalizeProject(project) {
  return { ...project, id: project.id || project._id };
}

// This function removes client-only identity and display fields before MongoDB validates a project.
function databasePayload(project) {
  const { id, _id, updatedAt, createdAt, ...payload } = project;
  return payload;
}

// This function preserves the backend's useful error message for the admin form.
async function parseResponse(response, fallbackMessage) {
  let data = {};
  try { data = await response.json(); } catch { /* The server may return an empty error response. */ }
  if (!response.ok) {
    const error = new Error(data.message || `${fallbackMessage} (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return data;
}

// This function turns browser network failures into an actionable admin message.
async function requestJson(url, options, fallbackMessage) {
  try {
    const response = await fetch(url, options);
    return parseResponse(response, fallbackMessage);
  } catch (error) {
    if (error instanceof TypeError) throw new Error('The backend could not be reached. Check the deployed API URL and try again.');
    throw error;
  }
}

// This function loads published projects publicly or all projects for the authenticated admin.
export async function fetchProjects(includeDrafts = false) {
  return (await requestJson(`${apiBaseUrl}/projects${includeDrafts ? '' : '/published'}`, { credentials: 'include' }, 'Could not load portfolio projects.')).map(normalizeProject);
}

// This function creates a project in the shared backend database.
export async function createRemoteProject(project) {
  return normalizeProject(await requestJson(`${apiBaseUrl}/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(databasePayload(project)) }, 'Could not create project.'));
}

// This function updates a shared project, including its published or draft status.
export async function updateRemoteProject(project) {
  return normalizeProject(await requestJson(`${apiBaseUrl}/projects/${project.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(databasePayload(project)) }, 'Could not update project.'));
}

// This function removes a project from the shared backend database.
export async function deleteRemoteProject(projectId) {
  await requestJson(`${apiBaseUrl}/projects/${projectId}`, { method: 'DELETE', credentials: 'include' }, 'Could not delete project.');
}
