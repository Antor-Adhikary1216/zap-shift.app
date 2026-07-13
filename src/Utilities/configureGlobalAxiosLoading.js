import axios from 'axios'
import { startGlobalLoading } from './globalLoading'

axios.interceptors.request.use((config) => {
  if (config.skipGlobalLoading) return config
  config.completeGlobalLoading = startGlobalLoading(config.loadingMessage || 'Processing your request...')
  return config
}, (error) => Promise.reject(error))

axios.interceptors.response.use((response) => {
  response.config.completeGlobalLoading?.()
  return response
}, (error) => {
  error.config?.completeGlobalLoading?.()
  return Promise.reject(error)
})
