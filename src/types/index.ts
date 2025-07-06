// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'lawyer' | 'paralegal' | 'admin';
  firm: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Case Research Types
export interface CaseDocument {
  id: string;
  title: string;
  court: string;
  date: string;
  judges: string[];
  summary: string;
  fullText: string;
  citation: string;
  relevanceScore: number;
  category: string;
  tags: string[];
  url?: string;
}

export interface SearchQuery {
  query: string;
  filters: {
    court?: string;
    dateRange?: {
      start: string;
      end: string;
    };
    category?: string;
    tags?: string[];
  };
  sortBy: 'relevance' | 'date' | 'court';
  page: number;
  limit: number;
}

export interface SearchResult {
  documents: CaseDocument[];
  total: number;
  page: number;
  totalPages: number;
  query: string;
}

// Research Session Types
export interface ResearchSession {
  id: string;
  title: string;
  description: string;
  queries: SearchQuery[];
  savedCases: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Analytics Types
export interface AnalyticsData {
  totalSearches: number;
  totalCases: number;
  recentActivity: {
    date: string;
    searches: number;
    casesViewed: number;
  }[];
  topQueries: {
    query: string;
    count: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  firm: string;
  email: string;
}

export interface SettingsForm {
  notifications: {
    email: boolean;
    desktop: boolean;
    research: boolean;
  };
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    defaultSortBy: 'relevance' | 'date' | 'court';
  };
}

// Navigation Types
export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  badge?: number;
}

// Component Props Types
export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
