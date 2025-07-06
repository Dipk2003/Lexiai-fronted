import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  LoginForm, 
  CaseDocument, 
  SearchQuery, 
  SearchResult, 
  ResearchSession, 
  AnalyticsData,
  ApiResponse,
  ProfileForm,
  SettingsForm
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token Management
  private getToken(): string | null {
    if (this.token) return this.token;
    const token = localStorage.getItem('lexiai_token');
    if (token) {
      this.token = token;
      return token;
    }
    return null;
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('lexiai_token', token);
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('lexiai_token');
  }

  // Authentication Endpoints
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    const response = await this.api.post('/auth/login', credentials);
    
    if (response.data.success) {
      this.setToken(response.data.token);
      const user: User = {
        id: response.data.id.toString(),
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: 'lawyer' as const,
        firm: response.data.firmName,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return { user, token: response.data.token };
    }
    throw new Error(response.data.message || 'Login failed');
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/auth/me');
    
    // Backend returns Lawyer object directly
    const lawyer = response.data;
    const user: User = {
      id: lawyer.id.toString(),
      email: lawyer.email,
      firstName: lawyer.firstName,
      lastName: lawyer.lastName,
      role: 'lawyer' as const,
      firm: lawyer.firm?.name || 'Unknown Firm',
      isActive: lawyer.isActive,
      createdAt: lawyer.createdAt || new Date().toISOString(),
      updatedAt: lawyer.updatedAt || new Date().toISOString()
    };
    return user;
  }

  async refreshToken(): Promise<string> {
    const response: AxiosResponse<ApiResponse<{ token: string }>> = 
      await this.api.post('/auth/refresh');
    
    if (response.data.success) {
      this.setToken(response.data.data.token);
      return response.data.data.token;
    }
    throw new Error(response.data.message);
  }

  // Case Research Endpoints
  async searchCases(query: SearchQuery): Promise<SearchResult> {
    const response: AxiosResponse<ApiResponse<SearchResult>> = 
      await this.api.post('/research/search', query);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  async getCaseById(id: string): Promise<CaseDocument> {
    const response: AxiosResponse<ApiResponse<CaseDocument>> = 
      await this.api.get(`/research/cases/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  async getSimilarCases(id: string): Promise<CaseDocument[]> {
    const response: AxiosResponse<ApiResponse<CaseDocument[]>> = 
      await this.api.get(`/research/cases/${id}/similar`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  async saveCaseToSession(caseId: string, sessionId: string): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = 
      await this.api.post(`/research/sessions/${sessionId}/cases`, { caseId });
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  }

  // Research Session Endpoints
  async createResearchSession(title: string, description: string): Promise<ResearchSession> {
    const response: AxiosResponse<ApiResponse<ResearchSession>> = 
      await this.api.post('/research/sessions', { title, description });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  async getResearchSessions(): Promise<ResearchSession[]> {
    const response: AxiosResponse<ApiResponse<ResearchSession[]>> = 
      await this.api.get('/research/sessions');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  async getResearchSession(id: string): Promise<ResearchSession> {
    const response: AxiosResponse<ApiResponse<ResearchSession>> = 
      await this.api.get(`/research/sessions/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  async updateResearchSession(id: string, updates: Partial<ResearchSession>): Promise<ResearchSession> {
    const response: AxiosResponse<ApiResponse<ResearchSession>> = 
      await this.api.patch(`/research/sessions/${id}`, updates);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  async deleteResearchSession(id: string): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = 
      await this.api.delete(`/research/sessions/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  }

  // Analytics Endpoints
  async getAnalytics(): Promise<AnalyticsData> {
    const response: AxiosResponse<ApiResponse<AnalyticsData>> = 
      await this.api.get('/analytics/dashboard');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  // User Profile Endpoints
  async updateProfile(profile: ProfileForm): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = 
      await this.api.patch('/users/profile', profile);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  async updateSettings(settings: SettingsForm): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = 
      await this.api.patch('/users/settings', settings);
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  }

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response: AxiosResponse<ApiResponse<{ avatarUrl: string }>> = 
      await this.api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
    if (response.data.success) {
      return response.data.data.avatarUrl;
    }
    throw new Error(response.data.message);
  }

  // Court and Category Endpoints
  async getCourts(): Promise<string[]> {
    const response: AxiosResponse<ApiResponse<string[]>> = 
      await this.api.get('/metadata/courts');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  async getCategories(): Promise<string[]> {
    const response: AxiosResponse<ApiResponse<string[]>> = 
      await this.api.get('/metadata/categories');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response: AxiosResponse<ApiResponse<{ status: string; timestamp: string }>> = 
      await this.api.get('/health');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
