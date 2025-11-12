/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXAMPLE_API_URL: string;
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
