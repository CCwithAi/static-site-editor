# Static Site Editor with AI Integration

A powerful local static site editor with integrated AI capabilities, WYSIWYG editing, and GitHub Pages deployment.

## Features

### Core Features
- WYSIWYG editor with HTML, CSS & JS support
- Local AI Support via Ollama
- Theme system with customization
- GitHub Pages integration
- Live preview server
- SEO and sitemap generation

### AI Features
- Local Ollama integration
- Custom prompt templates
- Content scheduling
- Auto-generation rules
- SEO optimization

### Editor Features
- Split view (Visual/Code)
- Asset management
- Version history
- Auto-save
- Media uploads
- Code highlighting

### Theme System
- Theme marketplace
- Custom CSS injection
- Template inheritance
- Mobile responsiveness

### Deployment
- GitHub Pages integration
- Build optimization
- Cache management
- Automated deployment

## Tech Stack

### Frontend
- React (Next.js framework)
- TinyMCE for WYSIWYG editing
- Monaco Editor for code editing
- Tailwind CSS for styling
- TypeScript for type safety

### Backend (Local)
- Node.js with Express
- MongoDB for local storage
- Ollama for AI integration
- Sharp for image processing
- Node-Git for GitHub integration

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB
- Ollama installed locally
- Git

### Installation
1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Start development server

## Project Structure

```
static-site-editor/
├── frontend/                 # Next.js frontend application
│   ├── components/          # React components
│   ├── pages/              # Next.js pages
│   ├── styles/             # Global styles
│   └── public/             # Static assets
├── backend/                 # Express backend server
│   ├── api/                # API routes
│   ├── services/           # Business logic
│   ├── models/             # Database models
│   └── utils/              # Helper functions
├── config/                 # Configuration files
└── docs/                   # Documentation
```

## Configuration

The application requires the following environment variables:
- `GITHUB_TOKEN` - GitHub personal access token
- `MONGODB_URI` - MongoDB connection string
- `OLLAMA_ENDPOINT` - Local Ollama endpoint
- `SITE_URL` - Your site URL

## Development

```bash
# Start frontend development server
npm run dev:frontend

# Start backend server
npm run dev:backend

# Run both concurrently
npm run dev
```

## Contributing
Contributions are welcome! Please read our contributing guidelines.

## License
MIT License
