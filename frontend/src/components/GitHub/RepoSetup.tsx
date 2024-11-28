import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RepoSetupProps {
  onSetupComplete: () => void;
}

interface Repository {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
}

export const RepoSetup: React.FC<RepoSetupProps> = ({ onSetupComplete }) => {
  const [step, setStep] = useState<'auth' | 'select' | 'configure'>('auth');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [newRepoName, setNewRepoName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);

  // Initiate GitHub device flow
  const startAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/github/auth/device');
      setAuthCode(response.data.user_code);
      setVerificationUrl(response.data.verification_uri);
      
      // Start polling for token
      pollForToken(response.data.device_code, response.data.interval);
    } catch (error) {
      setError('Failed to start authentication');
    } finally {
      setLoading(false);
    }
  };

  // Poll for token completion
  const pollForToken = async (deviceCode: string, interval: number) => {
    try {
      const response = await axios.post('/api/github/auth/token', { device_code: deviceCode });
      if (response.data.access_token) {
        setStep('select');
        fetchRepositories();
      }
    } catch (error) {
      // If still pending, continue polling
      if (error.response?.status === 403) {
        setTimeout(() => pollForToken(deviceCode, interval), interval * 1000);
      } else {
        setError('Authentication failed');
      }
    }
  };

  // Fetch user's repositories
  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/github/repos');
      setRepositories(response.data.repositories);
    } catch (error) {
      setError('Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  // Create new repository
  const createRepository = async () => {
    try {
      setLoading(true);
      await axios.post('/api/github/repos', {
        name: newRepoName,
        description: 'Created with Static Site Editor',
        auto_init: true
      });
      await fetchRepositories();
      setNewRepoName('');
    } catch (error) {
      setError('Failed to create repository');
    } finally {
      setLoading(false);
    }
  };

  // Configure selected repository
  const configureRepository = async () => {
    try {
      setLoading(true);
      await axios.post('/api/github/repos/configure', {
        repository: selectedRepo
      });
      onSetupComplete();
    } catch (error) {
      setError('Failed to configure repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {step === 'auth' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Connect to GitHub</h2>
          {!authCode ? (
            <button
              onClick={startAuth}
              disabled={loading}
              className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800"
            >
              {loading ? 'Connecting...' : 'Connect with GitHub'}
            </button>
          ) : (
            <div className="text-center space-y-4">
              <p>Enter this code on GitHub:</p>
              <div className="text-3xl font-mono bg-gray-100 p-4 rounded">
                {authCode}
              </div>
              <a
                href={verificationUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Click here to open GitHub
              </a>
            </div>
          )}
        </div>
      )}

      {step === 'select' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Select Repository</h2>
          
          <div className="space-y-4">
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a repository</option>
              {repositories.map((repo) => (
                <option key={repo.full_name} value={repo.full_name}>
                  {repo.full_name}
                </option>
              ))}
            </select>

            <div className="text-center">or</div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
                placeholder="New repository name"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={createRepository}
                disabled={!newRepoName || loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create New
              </button>
            </div>
          </div>

          <button
            onClick={configureRepository}
            disabled={!selectedRepo || loading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loading ? 'Configuring...' : 'Configure Repository'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
