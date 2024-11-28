import { Router } from 'express';
import {
  deployToGithubPages,
  syncWithGithub,
  getDeploymentStatus,
  configureGithubRepo
} from '../controllers/github.controller';

const router = Router();

// GitHub Pages deployment
router.post('/deploy', deployToGithubPages);
router.get('/deploy/status', getDeploymentStatus);

// Repository management
router.post('/sync', syncWithGithub);
router.post('/config', configureGithubRepo);

export default router;
