import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface MediaUploaderProps {
  onUpload: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUpload,
  acceptedTypes = ['image/*', 'video/*'],
  maxSize = 10485760 // 10MB
}) => {
  const [uploads, setUploads] = useState<Array<{ file: File; progress: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    // Filter out files that are too large
    const validFiles = acceptedFiles.filter(file => file.size <= maxSize);
    const invalidFiles = acceptedFiles.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      setError(`${invalidFiles.length} file(s) exceeded the size limit of ${maxSize / 1024 / 1024}MB`);
    }

    // Add new files to uploads with 0 progress
    setUploads(prev => [
      ...prev,
      ...validFiles.map(file => ({ file, progress: 0 }))
    ]);

    // Trigger the upload
    onUpload(validFiles);
  }, [maxSize, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxSize
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="media-uploader">
      <div
        {...getRootProps()}
        className={`dropzone border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
          <div>
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg">Drag & drop files here, or click to select files</p>
                <p className="text-sm text-gray-500">
                  Supported formats: {acceptedTypes.join(', ')}
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: {formatBytes(maxSize)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      {uploads.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Uploads</h3>
          {uploads.map((upload, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{upload.file.name}</span>
                  <span>{formatBytes(upload.file.size)}</span>
                </div>
                <div className="mt-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  ></div>
                </div>
              </div>
              {upload.progress === 100 && (
                <i className="fas fa-check text-green-500"></i>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
