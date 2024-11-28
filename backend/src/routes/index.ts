import { Express } from 'express';
import siteRoutes from './site.routes';
import editorRoutes from './editor.routes';
import aiRoutes from './ai.routes';
import githubRoutes from './github.routes';
import themeRoutes from './theme.routes';

export const setupRoutes = (app: Express) => {
  app.use('/api/site', siteRoutes);
  app.use('/api/editor', editorRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/github', githubRoutes);
  app.use('/api/themes', themeRoutes);
};
