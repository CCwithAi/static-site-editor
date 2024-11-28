import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';

interface DraftPost {
  id: string;
  title: string;
  content: string;
  created: Date;
  modified: Date;
  images: string[];
}

class StorageService {
  private basePath: string;
  private draftsPath: string;
  private settingsPath: string;

  constructor() {
    this.basePath = path.join(process.cwd(), 'local-storage');
    this.draftsPath = path.join(this.basePath, 'drafts');
    this.settingsPath = path.join(this.basePath, 'settings.json');
    this.initStorage();
  }

  private async initStorage() {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
      await fs.mkdir(this.draftsPath, { recursive: true });
      
      // Create settings file if it doesn't exist
      try {
        await fs.access(this.settingsPath);
      } catch {
        await fs.writeFile(this.settingsPath, JSON.stringify({
          githubToken: '',
          lastSync: null,
          currentTheme: 'default'
        }));
      }
    } catch (error) {
      logger.error('Failed to initialize storage:', error);
    }
  }

  async saveDraft(draft: DraftPost): Promise<void> {
    const draftPath = path.join(this.draftsPath, `${draft.id}.json`);
    await fs.writeFile(draftPath, JSON.stringify(draft, null, 2));
  }

  async getDraft(id: string): Promise<DraftPost | null> {
    try {
      const draftPath = path.join(this.draftsPath, `${id}.json`);
      const content = await fs.readFile(draftPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  async listDrafts(): Promise<DraftPost[]> {
    const files = await fs.readdir(this.draftsPath);
    const drafts = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const content = await fs.readFile(
            path.join(this.draftsPath, file),
            'utf-8'
          );
          return JSON.parse(content);
        })
    );
    return drafts;
  }

  async deleteDraft(id: string): Promise<void> {
    const draftPath = path.join(this.draftsPath, `${id}.json`);
    await fs.unlink(draftPath);
  }

  async getSettings<T>(): Promise<T> {
    const content = await fs.readFile(this.settingsPath, 'utf-8');
    return JSON.parse(content);
  }

  async updateSettings(settings: any): Promise<void> {
    await fs.writeFile(this.settingsPath, JSON.stringify(settings, null, 2));
  }
}

export const storageService = new StorageService();
