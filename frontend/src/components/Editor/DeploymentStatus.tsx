import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface DeploymentStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message?: string;
}

interface DeploymentStatusProps {
  isDeploying: boolean;
  postId: string;
}

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  isDeploying,
  postId
}) => {
  const [steps, setSteps] = useState<DeploymentStep[]>([
    {
      id: 'clone',
      title: 'Cloning repository into buffer',
      status: 'pending'
    },
    {
      id: 'build',
      title: 'Building site in buffer',
      status: 'pending'
    },
    {
      id: 'copy',
      title: 'Copying public folder',
      status: 'pending'
    },
    {
      id: 'push',
      title: 'Pushing changes to repository',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    if (!isDeploying) return;

    const pollStatus = async () => {
      try {
        const response = await axios.get(`/api/deploy/status/${postId}`);
        setSteps(response.data.steps);

        // Continue polling if deployment is not complete
        if (response.data.status === 'in_progress') {
          setTimeout(pollStatus, 2000);
        }
      } catch (error) {
        console.error('Failed to fetch deployment status:', error);
      }
    };

    pollStatus();
  }, [isDeploying, postId]);

  if (!isDeploying) return null;

  return (
    <div className="deployment-status fixed inset-x-0 bottom-0 bg-white border-t shadow-lg p-4">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-medium mb-4">Deployment Progress</h3>
        
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div className="w-6 h-6 mr-3">
                {step.status === 'running' && (
                  <i className="fas fa-spinner fa-spin text-blue-500"></i>
                )}
                {step.status === 'completed' && (
                  <i className="fas fa-check-circle text-green-500"></i>
                )}
                {step.status === 'error' && (
                  <i className="fas fa-exclamation-circle text-red-500"></i>
                )}
                {step.status === 'pending' && (
                  <i className="fas fa-circle text-gray-300"></i>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <span className={`font-medium ${
                    step.status === 'running' ? 'text-blue-500' :
                    step.status === 'completed' ? 'text-green-500' :
                    step.status === 'error' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  
                  {step.status === 'running' && (
                    <span className="ml-2 text-sm text-gray-500">
                      in progress...
                    </span>
                  )}
                </div>
                
                {step.message && (
                  <p className="text-sm text-gray-500 mt-1">
                    {step.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Your site will be available at: 
          <a 
            href={`https://${postId}.github.io`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500 hover:underline"
          >
            https://{postId}.github.io
          </a>
        </div>
      </div>
    </div>
  );
};
