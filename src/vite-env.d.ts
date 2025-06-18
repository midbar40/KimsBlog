/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  // 추가 환경 변수가 있다면 여기에 정의
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}