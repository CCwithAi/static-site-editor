import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Model {
  name: string;
  modified_at: string;
  size: number;
  details: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export const ModelSelector: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
    fetchCurrentModel();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get('/api/ollama/models');
      setModels(response.data.models);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch models');
      setLoading(false);
    }
  };

  const fetchCurrentModel = async () => {
    try {
      const response = await axios.get('/api/ollama/model/current');
      setCurrentModel(response.data.currentModel);
    } catch (error) {
      setError('Failed to fetch current model');
    }
  };

  const handleModelChange = async (modelName: string) => {
    try {
      setLoading(true);
      await axios.post('/api/ollama/model/set', { modelName });
      setCurrentModel(modelName);
      setError(null);
    } catch (error) {
      setError('Failed to change model');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3 mt-4">
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select AI Model
        </label>
        <select
          value={currentModel}
          onChange={(e) => handleModelChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          disabled={loading}
        >
          {models.map((model) => (
            <option key={model.name} value={model.name}>
              {model.name} ({model.details.parameter_size})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}

      {currentModel && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700">Current Model Info</h3>
          {models.map((model) => {
            if (model.name === currentModel) {
              return (
                <div key={model.name} className="mt-2 text-sm text-gray-600">
                  <p>Family: {model.details.family}</p>
                  <p>Size: {model.details.parameter_size}</p>
                  <p>Quantization: {model.details.quantization_level}</p>
                  <p>Last Modified: {new Date(model.modified_at).toLocaleDateString()}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};
