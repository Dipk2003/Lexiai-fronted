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

  // User Case Management Endpoints
  async getUserCases(params?: any): Promise<any[]> {
    const response = await this.api.get('/cases', { params });
    return response.data;
  }

  async getUserCaseById(id: string): Promise<any> {
    const response = await this.api.get(`/cases/${id}`);
    return response.data;
  }

  async createUserCase(caseData: any): Promise<any> {
    const response = await this.api.post('/cases', caseData);
    return response.data;
  }

  async updateUserCase(id: string, caseData: any): Promise<any> {
    const response = await this.api.put(`/cases/${id}`, caseData);
    return response.data;
  }

  async deleteUserCase(id: string): Promise<void> {
    await this.api.delete(`/cases/${id}`);
  }

  async archiveUserCase(id: string): Promise<any> {
    const response = await this.api.patch(`/cases/${id}/archive`);
    return response.data;
  }

  async updateCaseStatus(id: string, status: string): Promise<any> {
    const response = await this.api.patch(`/cases/${id}/status?status=${status}`);
    return response.data;
  }

  async searchUserCases(keyword: string): Promise<any[]> {
    const response = await this.api.get(`/cases/search?keyword=${keyword}`);
    return response.data;
  }

  async getUpcomingHearings(startDate?: string, endDate?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await this.api.get(`/cases/upcoming-hearings?${params.toString()}`);
    return response.data;
  }

  async getCaseStatistics(): Promise<any> {
    const response = await this.api.get('/cases/statistics');
    return response.data;
  }

  async getFirmCases(): Promise<any[]> {
    const response = await this.api.get('/cases/firm');
    return response.data;
  }

  async getFirmCaseStatistics(): Promise<any> {
    const response = await this.api.get('/cases/firm/statistics');
    return response.data;
  }

  // Document Management Endpoints
  async getDocumentsByCase(caseId: string): Promise<any[]> {
    const response = await this.api.get(`/documents/case/${caseId}`);
    return response.data;
  }

  async getDocumentById(id: string): Promise<any> {
    const response = await this.api.get(`/documents/${id}`);
    return response.data;
  }

  async uploadDocument(file: File, caseId: string, metadata: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);
    
    if (metadata.name) formData.append('name', metadata.name);
    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.documentType) formData.append('documentType', metadata.documentType);
    if (metadata.accessLevel) formData.append('accessLevel', metadata.accessLevel);
    if (metadata.tags) formData.append('tags', metadata.tags);
    
    const response = await this.api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateDocument(id: string, metadata: any): Promise<any> {
    const response = await this.api.put(`/documents/${id}`, metadata);
    return response.data;
  }

  async deleteDocument(id: string): Promise<void> {
    await this.api.delete(`/documents/${id}`);
  }

  async downloadDocument(id: string): Promise<Blob> {
    const response = await this.api.get(`/documents/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async searchDocuments(keyword: string, caseId?: string): Promise<any[]> {
    const params = new URLSearchParams({ keyword });
    if (caseId) params.append('caseId', caseId);
    
    const response = await this.api.get(`/documents/search?${params.toString()}`);
    return response.data;
  }

  async getAllLawyerDocuments(): Promise<any[]> {
    const response = await this.api.get('/documents/lawyer/all');
    return response.data;
  }

  async getFirmWideDocuments(): Promise<any[]> {
    const response = await this.api.get('/documents/firm/shared');
    return response.data;
  }

  async updateDocumentAccessLevel(id: string, accessLevel: string): Promise<any> {
    const response = await this.api.patch(`/documents/${id}/access-level?accessLevel=${accessLevel}`);
    return response.data;
  }

  async getDocumentStatistics(): Promise<any> {
    const response = await this.api.get('/documents/statistics');
    return response.data;
  }

  // Case Research Endpoints
  async searchCases(query: any): Promise<any> {
    const response = await this.api.post('/search/cases', query);
    return response.data;
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

  async updateSettings(settings: any): Promise<void> {
    const response: AxiosResponse<string> = 
      await this.api.post('/user/settings', settings);
    
    return response.data;
  }

  async getSettings(): Promise<any> {
    const response = await this.api.get('/user/settings');
    return response.data;
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

  // Admin Endpoints
  async getAdminStats(): Promise<any> {
    const response = await this.api.get('/admin/dashboard/stats');
    return response.data;
  }

  async getSearchVolume(days: number = 7): Promise<any[]> {
    const response = await this.api.get(`/admin/analytics/search-volume?days=${days}`);
    return response.data;
  }

  async getCourtDistribution(): Promise<any[]> {
    const response = await this.api.get('/admin/analytics/court-distribution');
    return response.data;
  }

  async getAdminUsers(page: number = 0, size: number = 50): Promise<any[]> {
    const response = await this.api.get(`/admin/users?page=${page}&size=${size}`);
    return response.data;
  }

  async toggleUserStatus(userId: string): Promise<void> {
    await this.api.post(`/admin/users/${userId}/toggle-status`);
  }

  async getSystemLogs(limit: number = 100): Promise<any[]> {
    const response = await this.api.get(`/admin/system/logs?limit=${limit}`);
    return response.data;
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
