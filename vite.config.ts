import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    // Path aliases (para usar @/... en imports)
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@domain': path.resolve(__dirname, './src/domain'),
            '@data': path.resolve(__dirname, './src/data'),
            '@presentation': path.resolve(__dirname, './src/presentation'),
            '@ui': path.resolve(__dirname, './src/ui'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@types': path.resolve(__dirname, './src/types'),
            '@config': path.resolve(__dirname, './src/config'),
        },
    },

    // Server config
    server: {
        port: 5173,
        host: true, // Para acceder desde la red local
        open: true, // Abrir navegador automáticamente
    },

    // Build config
    build: {
        outDir: 'dist',
        sourcemap: true,
        // Optimizaciones
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'supabase': ['@supabase/supabase-js'],
                    'axios': ['axios'],
                },
            },
        },
    },

    // Environment variables prefix
    envPrefix: 'VITE_',
})