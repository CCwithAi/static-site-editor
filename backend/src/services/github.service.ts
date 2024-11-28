import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';
import { logger } from '../utils/logger';
import { storageService } from './storage.service';

interface CommitFile {
  path: string;
  content: string;
  message: string;
}

class GitHubService {
  private octokit: Octokit | null = null;
  private owner: string = '';
  private repo: string = '';

  async initialize() {
    const settings = await storageService.getSettings<{ githubToken: string }>();
    if (settings.githubToken) {
      this.octokit = new Octokit({ auth: settings.githubToken });
    }
  }

  async commitFile({ path, content, message }: CommitFile) {
    if (!this.octokit) {
      throw new Error('GitHub not initialized');
    }

    try {
      // Get the current file (if it exists)
      let sha: string | undefined;
      try {
        const { data } = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path,
        });

        if (!Array.isArray(data)) {
          sha = data.sha;
        }
      } catch (error) {
        // File doesn't exist yet, that's okay
      }

      // Create or update file
      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message,
        content: Base64.encode(content),
        sha,
        branch: 'main'
      });

      logger.info(`Successfully committed ${path}`);
    } catch (error) {
      logger.error('Failed to commit file:', error);
      throw new Error('Failed to commit file to GitHub');
    }
  }

  async publishPost(title: string, content: string, images: string[]) {
    if (!this.octokit) {
      throw new Error('GitHub not initialized');
    }

    try {
      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Upload images first
      const imagePromises = images.map(async (imagePath) => {
        const fileName = imagePath.split('/').pop();
        await this.commitFile({
          path: `assets/images/${slug}/${fileName}`,
          content: await this.readFileAsBase64(imagePath),
          message: `Add image: ${fileName}`
        });
        return `assets/images/${slug}/${fileName}`;
      });

      const uploadedImages = await Promise.all(imagePromises);

      // Replace local image paths with uploaded paths in content
      let updatedContent = content;
      images.forEach((localPath, index) => {
        updatedContent = updatedContent.replace(
          localPath,
          uploadedImages[index]
        );
      });

      // Commit the post
      await this.commitFile({
        path: `blog/${slug}.md`,
        content: updatedContent,
        message: `Add blog post: ${title}`
      });

      return slug;
    } catch (error) {
      logger.error('Failed to publish post:', error);
      throw new Error('Failed to publish post to GitHub');
    }
  }

  private async readFileAsBase64(filePath: string): Promise<string> {
    // Implementation to read file as base64
    // This is a placeholder - actual implementation needed
    return '';
  }

  async setRepository(owner: string, repo: string) {
    this.owner = owner;
    this.repo = repo;
    await storageService.updateSettings({
      ...(await storageService.getSettings()),
      githubOwner: owner,
      githubRepo: repo
    });
  }
}

export const githubService = new GitHubService();
