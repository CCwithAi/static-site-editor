import { Router } from 'express';
import { ollamaService } from '../services/ollama.service';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get list of available models
router.get('/models', async (req, res) => {
  try {
    const models = await ollamaService.listModels();
    res.json({ models });
  } catch (error) {
    throw new AppError(500, 'Failed to fetch Ollama models');
  }
});

// Get current model
router.get('/model/current', async (req, res) => {
  try {
    const currentModel = await ollamaService.getCurrentModel();
    res.json({ currentModel });
  } catch (error) {
    throw new AppError(500, 'Failed to get current model');
  }
});

// Set current model
router.post('/model/set', async (req, res) => {
  const { modelName } = req.body;
  
  if (!modelName) {
    throw new AppError(400, 'Model name is required');
  }

  try {
    await ollamaService.setCurrentModel(modelName);
    res.json({ message: 'Model updated successfully', currentModel: modelName });
  } catch (error) {
    throw new AppError(500, 'Failed to set model');
  }
});

// Check model health
router.get('/model/:modelName/health', async (req, res) => {
  const { modelName } = req.params;
  
  try {
    const isHealthy = await ollamaService.checkModelHealth(modelName);
    res.json({ modelName, isHealthy });
  } catch (error) {
    throw new AppError(500, 'Failed to check model health');
  }
});

export default router;
