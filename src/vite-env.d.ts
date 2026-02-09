interface ImportMetaEnv {
    // API Backend
    readonly VITE_API_URL: string;

    // Supabase
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;

    // App Info
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;

    // Contact Info
    readonly VITE_CONTACT_PHONE: string;
    readonly VITE_CONTACT_EMAIL: string;
    readonly VITE_CONTACT_WHATSAPP: string;

    // Google Maps (opcional)
    readonly VITE_GOOGLE_MAPS_API_KEY?: string;

    // Environment
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}