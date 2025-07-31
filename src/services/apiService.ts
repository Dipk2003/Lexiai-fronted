import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  User, 
  LoginForm, 
  Case,
  Document,
  ResearchCase,
  DashboardStats,
  Task,
  Calendar,
  Client,
  SearchFilters,
  CaseForm,
  ClientForm,
  TaskForm,
} from '../types/enhanced';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = 30000;

// Response interfaces matching backend DTOs
interface AuthResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  firmName: string;
  token: string;
  success: boolean;
  message: string;
}

interface CaseSearchResponse {
  cases: BackendCase[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  success: boolean;
  message: string;
}

interface BackendCase {
  id: number;
  title: string;
  caseNumber: string;
  courtName: string;
  caseType: string;
  plaintiff: string;
  defendant: string;
  judgeName: string;
  decisionDate: string;
  filingDate: string;
  caseSummary: string;
  legalCitation: string;
  caseStatus: string;
  keywords: string;
  fullText: string;
  createdDate: string;
  updatedDate: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  specialization?: string;
  barNumber?: string;
  yearsOfExperience?: number;
  firmName: string;
  firmEmail: string;
  firmPhone?: string;
  firmAddress?: string;
  firmCity: string;
  firmState: string;
  firmCountry: string;
}

interface SearchHistoryItem {
  id: number;
  query: string;
  searchType: string;
  resultCount: number;
  searchDate: string;
}

interface UserSettings {
  notifications: {
    email: boolean;
    desktop: boolean;
    research: boolean;
  };
  preferences: {
    theme: string;
    language: string;
    defaultSortBy: string;
  };
}

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
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

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        
        // Enhanced error handling
        if (error.response?.data) {
          const errorData = error.response.data as any;
          throw new Error(errorData.message || errorData.error || 'An error occurred');
        }
        
        throw new Error(error.message || 'Network error occurred');
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

  // Authentication APIs
  async login(credentials: LoginForm): Promise<{ user: User; token: string }> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
      
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
    } catch (error) {
      throw this.handleError(error, 'Login failed');
    }
  }

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    firmName: string;
    firmEmail: string;
    firmPhone?: string;
    firmAddress?: string;
    firmCity: string;
    firmState: string;
  }): Promise<void> {
    try {
      const registerRequest: RegisterRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        firmName: data.firmName,
        firmEmail: data.firmEmail,
        firmPhone: data.firmPhone,
        firmAddress: data.firmAddress,
        firmCity: data.firmCity,
        firmState: data.firmState,
        firmCountry: 'India', // Default
      };

      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', registerRequest);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      throw this.handleError(error, 'Registration failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get('/auth/me');
      const lawyer = response.data;
      
      return {
        id: lawyer.id.toString(),
        email: lawyer.email,
        firstName: lawyer.firstName,
        lastName: lawyer.lastName,
        role: 'lawyer' as const,
        firm: lawyer.firm?.name || 'Unknown Firm',
        isActive: lawyer.isActive,
        createdAt: lawyer.createdDate || new Date().toISOString(),
        updatedAt: lawyer.updatedDate || new Date().toISOString()
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch user data');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearToken();
    }
  }

  // Case Research APIs
  async searchCases(query: string, filters: SearchFilters = {}): Promise<ResearchCase[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: '0',
        size: '20'
      });

      if (filters.court) params.append('courtName', filters.court);
      if (filters.caseType) params.append('caseType', filters.caseType);
      
      const response: AxiosResponse<CaseSearchResponse> = await this.api.get(`/search/cases?${params}`);
      
      if (response.data.success) {
        return response.data.cases.map(this.mapBackendCaseToResearchCase);
      }
      
      throw new Error(response.data.message || 'Search failed');
    } catch (error) {
      throw this.handleError(error, 'Case search failed');
    }
  }

  async getCaseById(id: string): Promise<ResearchCase> {
    try {
      const response = await this.api.get(`/search/cases/${id}`);
      return this.mapBackendCaseToResearchCase(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch case details');
    }
  }

  async getPopularCases(limit: number = 10): Promise<ResearchCase[]> {
    try {
      const response = await this.api.get(`/search/cases/popular?limit=${limit}`);
      return response.data.map(this.mapBackendCaseToResearchCase);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch popular cases');
    }
  }

  async getRecentCases(limit: number = 10): Promise<ResearchCase[]> {
    try {
      const response = await this.api.get(`/search/cases/recent?limit=${limit}`);
      return response.data.map(this.mapBackendCaseToResearchCase);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch recent cases');
    }
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      const response = await this.api.get(`/search/suggestions?query=${encodeURIComponent(query)}`);
      return response.data || [];
    } catch (error) {
      console.warn('Failed to fetch search suggestions:', error);
      return [];
    }
  }

  // User Profile APIs
  async getUserProfile(): Promise<User> {
    try {
      const response = await this.api.get('/user/profile');
      const lawyer = response.data;
      
      return {
        id: lawyer.id.toString(),
        email: lawyer.email,
        firstName: lawyer.firstName,
        lastName: lawyer.lastName,
        role: 'lawyer' as const,
        firm: lawyer.firm?.name || 'Unknown Firm',
        isActive: lawyer.isActive,
        createdAt: lawyer.createdDate || new Date().toISOString(),
        updatedAt: lawyer.updatedDate || new Date().toISOString()
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch user profile');
    }
  }

  async updateUserProfile(data: Partial<User>): Promise<User> {
    try {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: '', // Add if needed
        specialization: '', // Add if needed
        barNumber: '', // Add if needed
        yearsOfExperience: 0, // Add if needed
      };

      const response = await this.api.put('/user/profile', updateData);
      return this.mapBackendUserToUser(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to update profile');
    }
  }

  async getSearchHistory(limit: number = 50): Promise<SearchHistoryItem[]> {
    try {
      const response = await this.api.get(`/user/search-history?limit=${limit}`);
      return response.data || [];
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch search history');
    }
  }

  async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await this.api.get('/user/settings');
      return response.data || {
        notifications: { email: true, desktop: false, research: true },
        preferences: { theme: 'light', language: 'en', defaultSortBy: 'relevance' }
      };
    } catch (error) {
      console.warn('Failed to fetch user settings:', error);
      return {
        notifications: { email: true, desktop: false, research: true },
        preferences: { theme: 'light', language: 'en', defaultSortBy: 'relevance' }
      };
    }
  }

  async updateUserSettings(settings: UserSettings): Promise<void> {
    try {
      await this.api.post('/user/settings', settings);
    } catch (error) {
      throw this.handleError(error, 'Failed to update settings');
    }
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Try to fetch real dashboard stats from backend
      const response = await this.api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.warn('Dashboard stats endpoint not available, using mock data:', error);
      // Fallback to mock data if endpoint doesn't exist
      return {
        totalCases: 127,
        activeCases: 89,
        completedCases: 38,
        upcomingHearings: 12,
        pendingTasks: 24,
        monthlyRevenue: 125000,
        billableHours: 186,
        clientSatisfaction: 94,
      };
    }
  }

  // Case Management APIs - these would be for user's own cases (not research cases)
  async getUserCases(params: { 
    limit?: number; 
    offset?: number; 
    sortBy?: string; 
    sortOrder?: 'asc' | 'desc' 
  } = {}): Promise<{ cases: Case[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await this.api.get(`/cases?${queryParams}`);
      return {
        cases: response.data.cases || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.warn('User cases endpoint not available:', error);
      return { cases: [], total: 0 };
    }
  }

  // Dashboard API with convenience methods
  dashboard = {
    getStats: () => this.getDashboardStats(),
  };

  // Calendar API with convenience methods
  calendar = {
    getEvents: () => this.getCalendarEvents(),
    createEvent: (eventData: any) => this.createCalendarEvent(eventData),
    updateEvent: (id: string, eventData: any) => this.updateCalendarEvent(id, eventData),
    deleteEvent: (id: string) => this.deleteCalendarEvent(id),
  };

  // Individual calendar management methods
  async getCalendarEvents(): Promise<Calendar[]> {
    try {
      const response = await this.api.get('/calendar/events');
      return response.data;
    } catch (error) {
      console.warn('Calendar events endpoint not available:', error);
      return [];
    }
  }

  async createCalendarEvent(eventData: any): Promise<Calendar> {
    try {
      const response = await this.api.post('/calendar/events', eventData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create event');
    }
  }

  async updateCalendarEvent(id: string, eventData: any): Promise<Calendar> {
    try {
      const response = await this.api.put(`/calendar/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update event');
    }
  }

  async deleteCalendarEvent(id: string): Promise<void> {
    try {
      await this.api.delete(`/calendar/events/${id}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete event');
    }
  }

  // Documents API with convenience methods
  documents = {
    getByCaseId: (caseId: string) => this.getDocumentsByCaseId(caseId),
    upload: (caseId: string, file: File) => this.uploadDocument(caseId, file),
    download: (documentId: string) => this.downloadDocument(documentId),
    delete: (documentId: string) => this.deleteDocument(documentId),
  };

  // Individual document management methods
async getDocumentsByCaseId(caseId: string): Promise<Document[]> {
    try {
      const response = await this.api.get(`/cases/${caseId}/documents`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch documents');
    }
  }

  async uploadDocument(caseId: string, file: File): Promise<Document> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.api.post(`/cases/${caseId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to upload document');
    }
  }

async downloadDocument(documentId: string): Promise<Blob> {
    try {
      const response = await this.api.get(`/documents/${documentId}/download`, {
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to download document');
    }
  }

  async deleteDocument(documentId: string): Promise<void> {
    try {
      await this.api.delete(`/documents/${documentId}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete document');
    }
  }

  // Cases API with convenience methods  
  cases = {
    search: (params: { limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) => 
      this.getUserCases(params),
    getAll: () => this.getUserCases({ limit: 1000 }),
    getById: (id: string) => this.getCaseById(id),
    create: (caseData: CaseForm) => this.createCase(caseData),
    update: (id: string, caseData: Partial<CaseForm>) => this.updateCase(id, caseData),
    delete: (id: string) => this.deleteCase(id),
  };

  // Individual case management methods
  async getCaseById(id: string): Promise<Case> {
    try {
      const response = await this.api.get(`/cases/${id}`);
      return this.mapBackendCaseToCase(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch case details');
    }
  }

  async createCase(caseData: CaseForm): Promise<Case> {
    try {
      const response = await this.api.post('/cases', caseData);
      return this.mapBackendCaseToCase(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to create case');
    }
  }

  async updateCase(id: string, caseData: Partial<CaseForm>): Promise<Case> {
    try {
      const response = await this.api.put(`/cases/${id}`, caseData);
      return this.mapBackendCaseToCase(response.data);
    } catch (error) {
      throw this.handleError(error, 'Failed to update case');
    }
  }

  async deleteCase(id: string): Promise<void> {
    try {
      await this.api.delete(`/cases/${id}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete case');
    }
  }

  // Utility methods
  private mapBackendCaseToResearchCase(backendCase: BackendCase): ResearchCase {
    return {
      id: backendCase.id.toString(),
      title: backendCase.title,
      court: backendCase.courtName,
      date: backendCase.decisionDate || backendCase.filingDate,
      citation: backendCase.legalCitation || `${backendCase.caseNumber}`,
      judges: backendCase.judgeName ? [backendCase.judgeName] : [],
      summary: backendCase.caseSummary || 'No summary available',
      fullText: backendCase.fullText || 'Full text not available',
      relevanceScore: Math.floor(Math.random() * 40) + 60, // Mock relevance scoring
      category: backendCase.caseType || 'General',
      tags: backendCase.keywords ? backendCase.keywords.split(',').map(k => k.trim()) : [],
      similar: [], // Would need separate API call
    };
  }

  private mapBackendCaseToCase(backendCase: any): Case {
    return {
      id: backendCase.id.toString(),
      caseNumber: backendCase.caseNumber,
      title: backendCase.title,
      description: backendCase.description || backendCase.caseSummary,
      clientName: backendCase.clientName || backendCase.plaintiff,
      clientEmail: backendCase.clientEmail || '',
      clientPhone: backendCase.clientPhone || '',
      caseType: backendCase.caseType,
      status: backendCase.status || backendCase.caseStatus,
      priority: backendCase.priority || 'MEDIUM',
      court: backendCase.court || backendCase.courtName,
      judge: backendCase.judge || backendCase.judgeName,
      opposingParty: backendCase.opposingParty || backendCase.defendant,
      opposingCounsel: backendCase.opposingCounsel || '',
      dateCreated: backendCase.dateCreated || backendCase.createdDate,
      dateUpdated: backendCase.dateUpdated || backendCase.updatedDate,
      nextHearing: backendCase.nextHearing,
      estimatedValue: backendCase.estimatedValue,
      tags: backendCase.tags || (backendCase.keywords ? backendCase.keywords.split(',').map((k: string) => k.trim()) : []),
      documents: backendCase.documents || [],
      notes: backendCase.notes || [],
      timeline: backendCase.timeline || [],
      assignedLawyers: backendCase.assignedLawyers || [],
    };
  }

  private mapBackendUserToUser(backendUser: any): User {
    return {
      id: backendUser.id.toString(),
      email: backendUser.email,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      role: 'lawyer' as const,
      firm: backendUser.firm?.name || 'Unknown Firm',
      isActive: backendUser.isActive,
      createdAt: backendUser.createdDate || new Date().toISOString(),
      updatedAt: backendUser.updatedDate || new Date().toISOString()
    };
  }

  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error(defaultMessage);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.api.get('/public/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend health check failed');
    }
  }

  // Email availability check
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await this.api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      return false;
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;
