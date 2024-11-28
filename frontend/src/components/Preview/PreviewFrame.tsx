import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface PreviewFrameProps {
  content: string;
  viewMode: 'desktop' | 'mobile';
  customStyles?: string;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  content,
  viewMode,
  customStyles = ''
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Convert markdown to HTML and sanitize
    const htmlContent = DOMPurify.sanitize(marked(content));

    // Base styles for the preview
    const baseStyles = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        color: #333;
        padding: 2rem;
        max-width: ${viewMode === 'mobile' ? '100%' : '800px'};
        margin: 0 auto;
      }
      h1, h2, h3, h4, h5, h6 {
        margin: 2rem 0 1rem;
        line-height: 1.25;
      }
      h1 { font-size: 2.5rem; }
      h2 { font-size: 2rem; }
      h3 { font-size: 1.75rem; }
      p, ul, ol {
        margin-bottom: 1.5rem;
      }
      img {
        max-width: 100%;
        height: auto;
        margin: 2rem 0;
        border-radius: 8px;
      }
      pre {
        background: #f6f8fa;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        margin: 1.5rem 0;
      }
      code {
        font-family: monospace;
        font-size: 0.9em;
        padding: 0.2em 0.4em;
        background: #f6f8fa;
        border-radius: 3px;
      }
      blockquote {
        border-left: 4px solid #ddd;
        padding-left: 1rem;
        margin: 1.5rem 0;
        color: #666;
      }
      a {
        color: #0366d6;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      ${customStyles}
    `;

    // Write the content to the iframe
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${baseStyles}</style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `);
    doc.close();
  }, [content, viewMode, customStyles]);

  return (
    <iframe
      ref={iframeRef}
      title="Preview"
      className={`w-full h-full border-0 bg-white ${
        viewMode === 'mobile' ? 'max-w-[375px]' : 'w-full'
      }`}
    />
  );
};
