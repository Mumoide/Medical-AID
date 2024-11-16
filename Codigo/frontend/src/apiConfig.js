const isLocal = window.location.hostname === 'localhost';

const API_BASE_URL = isLocal
  ? 'https://localhost:3001' // For local development
  : 'https://190.21.45.46:3001'; // For remote access

export default API_BASE_URL;