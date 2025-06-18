interface ApiConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: ApiConfig = {
  // 환경 변수 우선, 없으면 기본값 (로컬 개발)
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

export default config;
export const API_URL = config.apiUrl;

// 디버깅용 (개발 환경에서만)
if (import.meta.env.DEV) {
  console.log(`🔗 API URL: ${config.apiUrl}`);
}