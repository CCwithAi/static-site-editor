import { Router } from 'express';
import {
  getThemes,
  getTheme,
  createTheme,
  updateTheme,
  deleteTheme,
  applyTheme,
  updateThemeStyles,
  updateThemeTemplate
} from '../controllers/theme.controller';

const router = Router();

// Theme management
router.get('/', getThemes);
router.get('/:id', getTheme);
router.post('/', createTheme);
router.put('/:id', updateTheme);
router.delete('/:id', deleteTheme);

// Theme customization
router.post('/:id/apply', applyTheme);
router.put('/:id/styles', updateThemeStyles);
router.put('/:id/templates/:templateName', updateThemeTemplate);

export default router;
