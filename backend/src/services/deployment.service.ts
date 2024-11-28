import path from 'path';
import fs from 'fs-extra';
import { GitHubService } from './github.service';
import { StorageService } from './storage.service';

export class DeploymentService {
  private githubService: GitHubService;
  private storageService: StorageService;
  private bufferPath: string;
  private publicPath: string;

  constructor(
    githubService: GitHubService,
    storageService: StorageService,
    basePath: string
  ) {
    this.githubService = githubService;
    this.storageService = storageService;
    this.bufferPath = path.join(basePath, 'resources', 'static', 'buffer');
    this.publicPath = path.join(basePath, 'resources', 'static', 'public');
  }

  async deploy(siteName: string): Promise<void> {
    try {
      // Step 1: Clone repository into buffer
      await this.githubService.cloneToBuffer(this.bufferPath);

      // Step 2: Build the site
      await this.buildSite(siteName);

      // Step 3: Copy built files to public directory
      const sitePublicPath = path.join(this.publicPath, siteName);
      await this.copyToPublic(sitePublicPath);

      // Step 4: Commit and push changes
      await this.githubService.commitAndPush(
        this.bufferPath,
        'Update site content'
      );

      // Clean up
      await fs.remove(this.bufferPath);
    } catch (error) {
      console.error('Deployment failed:', error);
      // Clean up on error
      await fs.remove(this.bufferPath);
      throw error;
    }
  }

  private async buildSite(siteName: string): Promise<void> {
    try {
      // Get all posts from storage
      const posts = await this.storageService.getAllPosts();
      
      // Create necessary directories
      const buildDir = path.join(this.bufferPath, '_site');
      await fs.ensureDir(buildDir);

      // Process each post
      for (const post of posts) {
        const postPath = path.join(buildDir, `${post.slug}.html`);
        await fs.writeFile(postPath, this.generateHTML(post));
      }

      // Copy assets
      const assetsDir = path.join(this.bufferPath, 'assets');
      if (await fs.pathExists(assetsDir)) {
        await fs.copy(assetsDir, path.join(buildDir, 'assets'));
      }

      // Generate index page
      await this.generateIndexPage(buildDir, posts);
    } catch (error) {
      console.error('Build failed:', error);
      throw error;
    }
  }

  private async copyToPublic(publicPath: string): Promise<void> {
    const buildDir = path.join(this.bufferPath, '_site');
    await fs.ensureDir(publicPath);
    await fs.copy(buildDir, publicPath);
  }

  private generateHTML(post: any): string {
    // Basic HTML template - can be enhanced with themes
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${post.title}</title>
          <link rel="stylesheet" href="/assets/styles.css">
        </head>
        <body>
          <article>
            <h1>${post.title}</h1>
            <div class="content">
              ${post.content}
            </div>
          </article>
        </body>
      </html>
    `;
  }

  private async generateIndexPage(buildDir: string, posts: any[]): Promise<void> {
    const indexContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Blog</title>
          <link rel="stylesheet" href="/assets/styles.css">
        </head>
        <body>
          <h1>Blog Posts</h1>
          <ul>
            ${posts
              .map(
                post => `
                <li>
                  <a href="/${post.slug}.html">${post.title}</a>
                  <span class="date">${new Date(post.date).toLocaleDateString()}</span>
                </li>
              `
              )
              .join('')}
          </ul>
        </body>
      </html>
    `;

    await fs.writeFile(path.join(buildDir, 'index.html'), indexContent);
  }

  // Additional utility methods
  async previewBuild(siteName: string): Promise<string> {
    const previewDir = path.join(this.bufferPath, '_preview', siteName);
    await this.buildSite(siteName);
    await this.copyToPublic(previewDir);
    return previewDir;
  }

  async cleanPreview(siteName: string): Promise<void> {
    const previewDir = path.join(this.bufferPath, '_preview', siteName);
    await fs.remove(previewDir);
  }
}
