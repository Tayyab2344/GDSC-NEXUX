/**
 * API Configuration
 * 
 * In development, it defaults to localhost:3000.
 * In production (Render), it should be provided via VITE_API_URL environment variable.
 */

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

export { API_BASE_URL };
