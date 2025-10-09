/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_CALLBACK_URL: string;
  // hier kannst du weitere VITE_ Variablen hinzufügen
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
