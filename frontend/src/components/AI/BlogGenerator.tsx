import React, { useState } from 'react';
import axios from 'axios';
import { ModelSelector } from './ModelSelector';

interface BlogGeneratorProps {
  onContentGenerated: (content: string) => void;
}

interface PromptTemplate {
  name: string;
  prompt: string;
}

export const BlogGenerator: React.FC<BlogGeneratorProps> = ({ onContentGenerated }) => {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('blog-post');
  const [customPrompt, setCustomPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const promptTemplates: PromptTemplate[] = [
    {
      name: 'blog-post',
      prompt: 'Write a detailed blog post about [topic]. Include an introduction, main points, and conclusion.'
    },
    {
      name: 'technical-guide',
      prompt: 'Create a technical guide about [topic] with code examples and best practices.'
    },
    {
      name: 'news-article',
      prompt: 'Write a news article about [topic] with recent developments and industry impact.'
    }
  ];

  const generateContent = async () => {
    if (!topic) {
      setError('Please enter a topic');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const selectedPrompt = promptTemplates.find(t => t.name === selectedTemplate)?.prompt || customPrompt;
      const finalPrompt = selectedPrompt.replace('[topic]', topic);

      const response = await axios.post('/api/ai/generate', {
        prompt: finalPrompt
      });

      onContentGenerated(response.data.content);
    } catch (error) {
      setError('Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">AI Blog Generator</h2>
      
      <div className="mb-6">
        <ModelSelector />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Blog Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your blog topic"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Template</label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {promptTemplates.map((template) => (
            <option key={template.name} value={template.name}>
              {template.name}
            </option>
          ))}
          <option value="custom">Custom Prompt</option>
        </select>
      </div>

      {selectedTemplate === 'custom' && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Custom Prompt</label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Enter your custom prompt. Use [topic] as a placeholder for the topic."
          />
        </div>
      )}

      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={generateContent}
        disabled={generating}
        className={`w-full py-2 px-4 rounded ${
          generating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {generating ? 'Generating...' : 'Generate Blog Post'}
      </button>
    </div>
  );
};
