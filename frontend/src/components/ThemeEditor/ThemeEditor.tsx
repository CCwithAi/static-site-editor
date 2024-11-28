import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

interface ThemeEditorProps {
  themeId: string;
}

interface ThemeData {
  id: string;
  name: string;
  styles: {
    global: string;
    components: Record<string, string>;
  };
  templates: Record<string, string>;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ themeId }) => {
  const [theme, setTheme] = useState<ThemeData | null>(null);
  const [activeTab, setActiveTab] = useState<'styles' | 'templates'>('styles');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    loadTheme();
  }, [themeId]);

  const loadTheme = async () => {
    try {
      const response = await axios.get(`/api/themes/${themeId}`);
      setTheme(response.data.theme);
      setCode(response.data.theme.styles.global);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (!value) return;
    setCode(value);
  };

  const handleSave = async () => {
    if (!theme) return;

    try {
      if (activeTab === 'styles') {
        await axios.put(`/api/themes/${themeId}/styles`, {
          styles: { global: code }
        });
      } else {
        await axios.put(`/api/themes/${themeId}/templates/${selectedTemplate}`, {
          templateName: selectedTemplate,
          content: code
        });
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  if (!theme) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex border-b p-4 space-x-4">
        <button
          onClick={() => {
            setActiveTab('styles');
            setCode(theme.styles.global);
          }}
          className={`px-4 py-2 rounded ${
            activeTab === 'styles' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Styles
        </button>
        <button
          onClick={() => {
            setActiveTab('templates');
            setCode(theme.templates[selectedTemplate] || '');
          }}
          className={`px-4 py-2 rounded ${
            activeTab === 'templates' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Templates
        </button>
        {activeTab === 'templates' && (
          <select
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value);
              setCode(theme.templates[e.target.value] || '');
            }}
            className="border rounded px-2"
          >
            {Object.keys(theme.templates).map((templateName) => (
              <option key={templateName} value={templateName}>
                {templateName}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleSave}
          className="ml-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Changes
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={activeTab === 'styles' ? 'css' : 'html'}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
};
