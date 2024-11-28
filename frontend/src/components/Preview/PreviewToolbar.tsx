import React from 'react';

interface PreviewToolbarProps {
  viewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
  onRefresh?: () => void;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  viewMode,
  onViewModeChange,
  onRefresh
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
      <div className="flex space-x-2">
        <button
          onClick={() => onViewModeChange('desktop')}
          className={`px-3 py-1 rounded ${
            viewMode === 'desktop'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <i className="fas fa-desktop mr-2"></i>
          Desktop
        </button>
        <button
          onClick={() => onViewModeChange('mobile')}
          className={`px-3 py-1 rounded ${
            viewMode === 'mobile'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <i className="fas fa-mobile-alt mr-2"></i>
          Mobile
        </button>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-2 text-gray-600 hover:text-gray-800"
          title="Refresh preview"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      )}
    </div>
  );
};
