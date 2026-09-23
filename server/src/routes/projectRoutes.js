import { Router } from 'express';
import {
  createProject,
  deleteProject,
  listAllProjects,
  listPublishedProjects,
  updateProject,
} from '../controllers/projectController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/published', listPublishedProjects);
router.get('/', requireAdmin, listAllProjects);
router.post('/', requireAdmin, createProject);
router.patch('/:id', requireAdmin, updateProject);
router.delete('/:id', requireAdmin, deleteProject);

export default router;
