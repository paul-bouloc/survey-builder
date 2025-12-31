// src/shared/api/http/axios.ts
import axios from 'axios'

export const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})
