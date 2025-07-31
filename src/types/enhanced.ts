// Enhanced type definitions for Legal Case Management Platform

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  caseType: CaseType;
  status: CaseStatus;
  priority: Priority;
  court: string;
  judge?: string;
  opposingParty?: string;
  opposingCounsel?: string;
  dateCreated: string;
  dateUpdated: string;
  nextHearing?: string;
  filingDate?: string;
  estimatedValue?: number;
  tags: string[];
  documents: Document[];
  notes: Note[];
  timeline: TimelineEvent[];
  assignedLawyers: User[];
}

export interface Document {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  caseId?: string;
  version: number;
  isPublic: boolean;
  isConfidential: boolean;
  metadata?: Record<string, any>;
}

export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isPrivate: boolean;
  tags: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: EventType;
  author: string;
  relatedDocuments?: string[];
}

export interface Firm {
  id: string;
  name: string;
  logo?: string;
  address: Address;
  phone: string;
  email: string;
  website?: string;
  registrationNumber: string;
  lawyers: User[];
  settings: FirmSettings;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FirmSettings {
  timeZone: string;
  currency: string;
  dateFormat: string;
  billableHourRate: number;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
}

export interface ResearchCase {
  id: string;
  title: string;
  court: string;
  date: string;
  citation: string;
  judges: string[];
  summary: string;
  fullText: string;
  relevanceScore: number;
  category: string;
  tags: string[];
  similar: ResearchCase[];
}

export interface SearchFilters {
  court?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  category?: string;
  tags?: string[];
  caseType?: CaseType;
  status?: CaseStatus;
  priority?: Priority;
}

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  upcomingHearings: number;
  pendingTasks: number;
  monthlyRevenue: number;
  billableHours: number;
  clientSatisfaction: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  caseId?: string;
  assignedTo: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  estimatedHours: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Calendar {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  type: CalendarEventType;
  caseId?: string;
  location?: string;
  attendees: string[];
  reminders: Reminder[];
}

export interface Reminder {
  id: string;
  type: ReminderType;
  time: number; // minutes before event
  sent: boolean;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  company?: string;
  dateOfBirth?: string;
  cases: string[];
  documents: Document[];
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface BillingEntry {
  id: string;
  caseId: string;
  lawyerId: string;
  date: string;
  hours: number;
  description: string;
  rate: number;
  total: number;
  billable: boolean;
  invoiced: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  caseId: string;
  entries: BillingEntry[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

// Enums
export enum CaseType {
  CRIMINAL = 'Criminal',
  CIVIL = 'Civil',
  CORPORATE = 'Corporate',
  FAMILY = 'Family',
  IMMIGRATION = 'Immigration',
  INTELLECTUAL_PROPERTY = 'Intellectual Property',
  LABOR = 'Labor',
  REAL_ESTATE = 'Real Estate',
  TAX = 'Tax',
  OTHER = 'Other'
}

export enum CaseStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  CLOSED = 'Closed',
  ARCHIVED = 'Archived'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum DocumentType {
  PDF = 'PDF',
  WORD = 'WORD',
  EXCEL = 'EXCEL', 
  POWERPOINT = 'POWERPOINT',
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  SPREADSHEET = 'SPREADSHEET',
  CONTRACT = 'Contract',
  EVIDENCE = 'Evidence',
  CORRESPONDENCE = 'Correspondence',
  COURT_FILING = 'Court Filing',
  RESEARCH = 'Research',
  INVOICE = 'Invoice',
  OTHER = 'Other'
}

export enum EventType {
  HEARING = 'Hearing',
  DEADLINE = 'Deadline',
  MEETING = 'Meeting',
  FILING = 'Filing',
  CORRESPONDENCE = 'Correspondence',
  OTHER = 'Other'
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum CalendarEventType {
  HEARING = 'Hearing',
  MEETING = 'Meeting',
  DEADLINE = 'Deadline',
  CONSULTATION = 'Consultation',
  COURT_APPEARANCE = 'Court Appearance',
  DEPOSITION = 'Deposition',
  OTHER = 'Other'
}

export enum ReminderType {
  EMAIL = 'Email',
  SMS = 'SMS',
  PUSH = 'Push Notification',
  IN_APP = 'In-App Notification'
}

export enum InvoiceStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled'
}

// Form Types
export interface CaseForm {
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  caseType: CaseType;
  priority: Priority;
  court: string;
  judge?: string;
  opposingParty?: string;
  opposingCounsel?: string;
  nextHearing?: string;
  estimatedValue?: number;
  tags: string[];
}

export interface ClientForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: Partial<Address>;
}

export interface TaskForm {
  title: string;
  description: string;
  caseId?: string;
  assignedTo: string;
  dueDate: string;
  priority: Priority;
  estimatedHours: number;
}

// Component Props
export interface PageProps {
  title?: string;
  children: React.ReactNode;
}

export interface TableColumn<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => string | React.ReactNode;
}

export interface FilterProps<T> {
  filters: T;
  onFiltersChange: (filters: T) => void;
  onClear: () => void;
}

export interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  filters?: any;
  onSearch?: () => void;
}
