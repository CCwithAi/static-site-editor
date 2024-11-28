import axios from 'axios';
import { logger } from '../utils/logger';
import { storageService } from './storage.service';

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

class GitHubAuthService {
  private clientId: string;
  private scope: string;

  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID || '';
    this.scope = 'repo';
  }

  async initiateDeviceFlow(): Promise<DeviceCodeResponse> {
    try {
      const response = await axios.post(
        'https://github.com/login/device/code',
        {
          client_id: this.clientId,
          scope: this.scope
        },
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to initiate device flow:', error);
      throw new Error('Failed to initiate GitHub authentication');
    }
  }

  async pollForToken(deviceCode: string, interval: number): Promise<string> {
    const poll = async (): Promise<string> => {
      try {
        const response = await axios.post<TokenResponse>(
          'https://github.com/login/oauth/access_token',
          {
            client_id: this.clientId,
            device_code: deviceCode,
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
          },
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        if (response.data.access_token) {
          // Save token to local storage
          await storageService.updateSettings({
            ...(await storageService.getSettings()),
            githubToken: response.data.access_token
          });
          return response.data.access_token;
        }
        
        throw new Error('Authorization pending');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          throw new Error('Authorization pending');
        }
        throw error;
      }
    };

    return new Promise((resolve, reject) => {
      const attemptPoll = async () => {
        try {
          const token = await poll();
          resolve(token);
        } catch (error) {
          if (error instanceof Error && error.message === 'Authorization pending') {
            setTimeout(attemptPoll, interval * 1000);
          } else {
            reject(error);
          }
        }
      };

      attemptPoll();
    });
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const githubAuthService = new GitHubAuthService();
