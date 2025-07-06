// API utility functions for backend integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export interface CaseSearchResult {
  id: string | number
  title: string
  court: string
  date: string
  summary: string
  relevance: number
  citation?: string
  tags?: string[]
  caseNumber?: string
  courtName?: string
  plaintiff?: string
  defendant?: string
  judgeName?: string
  caseType?: string
  caseStatus?: string
}

export class ApiService {
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return response.text() as T
  }

  static async searchCases(query: string): Promise<CaseSearchResult[]> {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('lexiai_token')
      if (!token) {
        throw new Error('Authentication required')
      }
      
      const response = await this.request<any>(`/search/cases?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Transform backend response to frontend format
      if (response.cases) {
        return response.cases.map((case_: any) => ({
          id: case_.id,
          title: case_.title,
          court: case_.courtName || case_.court,
          date: case_.decisionDate || case_.filingDate || case_.date,
          summary: case_.caseSummary || case_.description || case_.summary,
          relevance: Math.floor(Math.random() * 100), // Temporary relevance scoring
          citation: case_.legalCitation || case_.citation,
          tags: case_.keywords ? case_.keywords.split(',').map((tag: string) => tag.trim()) : [],
          caseNumber: case_.caseNumber,
          courtName: case_.courtName,
          plaintiff: case_.plaintiff,
          defendant: case_.defendant,
          judgeName: case_.judgeName,
          caseType: case_.caseType,
          caseStatus: case_.caseStatus
        }))
      }
      
      return []
    } catch (error) {
      console.error('Backend search failed:', error)
      throw error
    }
  }

  static async getCaseById(id: string): Promise<CaseSearchResult> {
    try {
      return await this.request<CaseSearchResult>(`/cases/${id}`)
    } catch (error) {
      console.error('Failed to fetch case:', error)
      throw error
    }
  }

  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      return await this.request<{ status: string; timestamp: string }>('/health')
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }
}

// Mock data fallback
export const mockCaseResults: CaseSearchResult[] = [
  {
    id: 1,
    title: 'Smith v. Johnson Manufacturing Inc.',
    court: 'Superior Court of California',
    date: '2023-12-15',
    summary: 'A landmark case involving breach of contract and damages in manufacturing agreements. The court ruled in favor of the plaintiff, establishing important precedent for commercial contract disputes.',
    relevance: 95,
    citation: '2023 Cal. Super. 1234',
    tags: ['Breach of Contract', 'Manufacturing', 'Damages']
  },
  {
    id: 2,
    title: 'Tech Solutions Corp v. DataFlow Systems',
    court: 'Federal District Court (Northern District of California)',
    date: '2023-11-28',
    summary: 'Intellectual property dispute involving software licensing and trade secrets. The court granted preliminary injunction protecting proprietary algorithms.',
    relevance: 88,
    citation: '2023 N.D. Cal. 5678',
    tags: ['Trade Secrets', 'Software', 'IP']
  },
  {
    id: 3,
    title: 'Green Energy Partners v. State Regulatory Board',
    court: 'State Supreme Court',
    date: '2023-10-20',
    summary: 'Environmental law case challenging renewable energy regulations. Court upheld state authority to regulate green energy projects.',
    relevance: 82,
    citation: '2023 State Sup. 9012',
    tags: ['Environmental Law', 'Renewable Energy']
  }
]
