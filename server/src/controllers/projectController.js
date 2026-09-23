import { randomUUID } from 'node:crypto';
import { Project } from '../models/Project.js';

let memoryProjects = [];

// This function returns published projects for the public portfolio.
export async function listPublishedProjects(_request, response) {
  if (Project.db.readyState === 1) {
    const projects = await Project.find({ status: 'published' }).sort({ createdAt: -1 });
    return response.json(projects);
  }

  return response.json(memoryProjects.filter((project) => project.status === 'published'));
}

// This function returns every project for the private admin project manager.
export async function listAllProjects(_request, response) {
  if (Project.db.readyState === 1) {
    const projects = await Project.find().sort({ createdAt: -1 });
    return response.json(projects);
  }

  return response.json(memoryProjects);
}

// This function creates a project and keeps drafts out of the public endpoint.
export async function createProject(request, response) {
  if (Project.db.readyState === 1) {
    const project = await Project.create(request.body);
    return response.status(201).json(project);
  }

  const project = { _id: randomUUID(), ...request.body, createdAt: new Date().toISOString() };
  memoryProjects = [project, ...memoryProjects];
  return response.status(201).json(project);
}

// This function updates project content or publication status from the admin panel.
export async function updateProject(request, response) {
  if (Project.db.readyState === 1) {
    const project = await Project.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    if (!project) return response.status(404).json({ message: 'Project not found.' });
    return response.json(project);
  }

  const projectIndex = memoryProjects.findIndex((project) => project._id === request.params.id);
  if (projectIndex === -1) return response.status(404).json({ message: 'Project not found.' });
  memoryProjects[projectIndex] = { ...memoryProjects[projectIndex], ...request.body };
  return response.json(memoryProjects[projectIndex]);
}

// This function removes a project after the owner confirms deletion in the dashboard.
export async function deleteProject(request, response) {
  if (Project.db.readyState === 1) {
    const project = await Project.findByIdAndDelete(request.params.id);
    if (!project) return response.status(404).json({ message: 'Project not found.' });
    return response.status(204).send();
  }

  const previousLength = memoryProjects.length;
  memoryProjects = memoryProjects.filter((project) => project._id !== request.params.id);
  if (memoryProjects.length === previousLength) return response.status(404).json({ message: 'Project not found.' });
  return response.status(204).send();
}
