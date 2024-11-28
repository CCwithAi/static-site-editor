import React, { useState } from 'react';
import axios from 'axios';

interface EditorToolbarProps {
  postId: string;
  onSave: () => Promise<void>;
  onPreview: () => void;
  isDirty: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  postId,
  onSave,
  onPreview,
  isDirty
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    try {
      await onSave();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setPublishStatus('publishing');
      
      // First ensure content is saved
      if (isDirty) {
        await onSave();
      }

      // Trigger the deployment process
      await axios.post('/api/deploy', { postId });
      
      setPublishStatus('success');
    } catch (error) {
      console.error('Failed to publish:', error);
      setPublishStatus('error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="editor-toolbar flex items-center space-x-4 p-4 border-b bg-white">
      <div className="text-gray-600">
        Editing: <span className="font-mono">{postId}</span>
      </div>

      <div className="flex-1"></div>

      <button
        onClick={handleSave}
        disabled={!isDirty || isPublishing}
        className={`flex items-center px-4 py-2 rounded ${
          isDirty
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        <i className="fas fa-save mr-2"></i>
        Save
      </button>

      <button
        onClick={onPreview}
        disabled={isPublishing}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
      >
        <i className="fas fa-eye mr-2"></i>
        Preview
      </button>

      <button
        onClick={handlePublish}
        disabled={isPublishing || publishStatus === 'publishing'}
        className={`flex items-center px-4 py-2 rounded ${
          isPublishing
            ? 'bg-gray-300 cursor-not-allowed'
            : publishStatus === 'success'
            ? 'bg-green-500 text-white'
            : publishStatus === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        <i className={`fas fa-${
          isPublishing ? 'spinner fa-spin' : 
          publishStatus === 'success' ? 'check' : 
          publishStatus === 'error' ? 'exclamation-circle' : 
          'upload'
        } mr-2`}></i>
        {isPublishing ? 'Publishing...' : 'Publish'}
      </button>

      {publishStatus === 'success' && (
        <div className="text-green-500 flex items-center">
          <i className="fas fa-check mr-2"></i>
          Published successfully!
        </div>
      )}

      {publishStatus === 'error' && (
        <div className="text-red-500 flex items-center">
          <i className="fas fa-exclamation-circle mr-2"></i>
          Failed to publish
        </div>
      )}
    </div>
  );
};
