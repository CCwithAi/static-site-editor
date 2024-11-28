import { Router } from 'express';
import {
  getSiteConfig,
  updateSiteConfig,
  generateSitemap,
  previewSite,
  exportSite
} from '../controllers/site.controller';

const router = Router();

// Site configuration
router.get('/config', getSiteConfig);
router.put('/config', updateSiteConfig);

// Site management
router.post('/sitemap', generateSitemap);
router.get('/preview', previewSite);
router.get('/export', exportSite);

export default router;
