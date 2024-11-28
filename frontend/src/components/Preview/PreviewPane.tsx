import React, { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface PreviewPaneProps {
  content: string;
  title: string;
  images: string[];
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  content,
  title,
  images
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  const sanitizedHtml = DOMPurify.sanitize(marked(content));

  return (
    <div className="preview-container h-full">
      <div className="preview-toolbar bg-gray-100 p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Preview</h3>
        <div className="view-toggles">
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-4 py-2 rounded-l ${
              viewMode === 'desktop' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <i className="fas fa-desktop"></i>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-4 py-2 rounded-r ${
              viewMode === 'mobile' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <i className="fas fa-mobile-alt"></i>
          </button>
        </div>
      </div>
      
      <div className={`preview-frame ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
        <div className="preview-content bg-white p-8 shadow-lg min-h-screen">
          <article className="prose lg:prose-xl mx-auto">
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </article>
        </div>
      </div>
    </div>
  );
};
