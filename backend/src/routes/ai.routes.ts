import { Router } from 'express';
import {
  generateContent,
  getPromptTemplates,
  savePromptTemplate,
  generateSEOMetadata,
  scheduleContentGeneration
} from '../controllers/ai.controller';

const router = Router();

// Content generation
router.post('/generate', generateContent);
router.post('/generate/seo', generateSEOMetadata);

// Prompt templates
router.get('/prompts', getPromptTemplates);
router.post('/prompts', savePromptTemplate);

// Content scheduling
router.post('/schedule', scheduleContentGeneration);

export default router;
