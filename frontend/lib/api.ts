import axios from 'axios'

let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Fix: Handle Render internal hostnames that miss the domain
if (!rawApiUrl.includes('localhost') && !rawApiUrl.includes('.')) {
  rawApiUrl += '.onrender.com';
}

const API_URL = rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ChatMessage {
  message: string
  userId: string
  conversationId?: string
  apiKey?: string
  modelName?: string
}

export interface ChatResponse {
  success: boolean
  response: string
  conversationId: string
}

export interface Memory {
  key: string
  value: string
  context?: Record<string, any>
}

export interface Config {
  key: string
  value: string
}

export interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export const chatApi = {
  sendMessage: async (data: ChatMessage): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat', data)
    return response.data
  },

  getHistory: async (conversationId: string) => {
    const response = await api.get(`/api/chat/history/${conversationId}`)
    return response.data.messages
  },
}

export const memoryApi = {
  save: async (userId: string, key: string, value: string, context?: Record<string, any>) => {
    const response = await api.post('/api/memory', { userId, key, value, context })
    return response.data
  },

  get: async (userId: string, key?: string) => {
    const response = await api.get(`/api/memory/${userId}${key ? `?key=${key}` : ''}`)
    return response.data.memories
  },

  delete: async (userId: string, key: string) => {
    const response = await api.delete(`/api/memory/${userId}/${key}`)
    return response.data
  },
}

export const configApi = {
  save: async (userId: string, key: string, value: string) => {
    const response = await api.post('/api/config', { userId, key, value })
    return response.data
  },

  get: async (userId: string, key?: string) => {
    const response = await api.get(`/api/config/${userId}${key ? `?key=${key}` : ''}`)
    return response.data.configs
  },

  delete: async (userId: string, key: string) => {
    const response = await api.delete(`/api/config/${userId}/${key}`)
    return response.data
  },
}

export const conversationsApi = {
  list: async (userId: string) => {
    const response = await api.get(`/api/conversations/${userId}`)
    return response.data.conversations
  },

  delete: async (conversationId: string) => {
    const response = await api.delete(`/api/conversations/${conversationId}`)
    return response.data
  },
}

export default api
