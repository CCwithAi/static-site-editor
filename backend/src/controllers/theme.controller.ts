import { Request, Response } from 'express';
import { ThemeConfig, ThemeCreateDTO } from '../interfaces/theme.interface';
import { AppError } from '../middleware/errorHandler';

// In-memory storage for themes (replace with MongoDB later)
let themes: ThemeConfig[] = [];

// Get all themes
export const getThemes = async (req: Request, res: Response) => {
  res.json({ themes });
};

// Get single theme
export const getTheme = async (req: Request, res: Response) => {
  const theme = themes.find(t => t.id === req.params.id);
  if (!theme) {
    throw new AppError(404, 'Theme not found');
  }
  res.json({ theme });
};

// Create new theme
export const createTheme = async (req: Request, res: Response) => {
  const themeData: ThemeCreateDTO = req.body;
  
  const newTheme: ThemeConfig = {
    id: Date.now().toString(),
    name: themeData.name,
    description: themeData.description,
    version: '1.0.0',
    author: themeData.author,
    styles: {
      global: '/* Add your global styles here */',
      components: {}
    },
    templates: {
      default: '<!DOCTYPE html>\n<html>\n<head>\n<title>{{title}}</title>\n</head>\n<body>\n{{content}}\n</body>\n</html>'
    },
    created: new Date(),
    modified: new Date()
  };

  themes.push(newTheme);
  res.status(201).json({ theme: newTheme });
};

// Update theme
export const updateTheme = async (req: Request, res: Response) => {
  const themeIndex = themes.findIndex(t => t.id === req.params.id);
  if (themeIndex === -1) {
    throw new AppError(404, 'Theme not found');
  }

  const updatedTheme = {
    ...themes[themeIndex],
    ...req.body,
    modified: new Date()
  };

  themes[themeIndex] = updatedTheme;
  res.json({ theme: updatedTheme });
};

// Delete theme
export const deleteTheme = async (req: Request, res: Response) => {
  const themeIndex = themes.findIndex(t => t.id === req.params.id);
  if (themeIndex === -1) {
    throw new AppError(404, 'Theme not found');
  }

  themes = themes.filter(t => t.id !== req.params.id);
  res.status(204).send();
};

// Apply theme to site
export const applyTheme = async (req: Request, res: Response) => {
  const theme = themes.find(t => t.id === req.params.id);
  if (!theme) {
    throw new AppError(404, 'Theme not found');
  }

  // Here we would apply the theme to the site
  // For now, just return success
  res.json({ message: 'Theme applied successfully' });
};

// Update theme styles
export const updateThemeStyles = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { styles } = req.body;

  const themeIndex = themes.findIndex(t => t.id === id);
  if (themeIndex === -1) {
    throw new AppError(404, 'Theme not found');
  }

  themes[themeIndex] = {
    ...themes[themeIndex],
    styles: {
      ...themes[themeIndex].styles,
      ...styles
    },
    modified: new Date()
  };

  res.json({ theme: themes[themeIndex] });
};

// Update theme template
export const updateThemeTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { templateName, content } = req.body;

  const themeIndex = themes.findIndex(t => t.id === id);
  if (themeIndex === -1) {
    throw new AppError(404, 'Theme not found');
  }

  themes[themeIndex] = {
    ...themes[themeIndex],
    templates: {
      ...themes[themeIndex].templates,
      [templateName]: content
    },
    modified: new Date()
  };

  res.json({ theme: themes[themeIndex] });
};
