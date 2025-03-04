import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    
    server: {
        host: "0.0.0.0",
        port: 9911,
        allowedHosts: ["vk.ss.dev"],
        proxy: {
            '/api/dcm': {
                target: 'https://as2.ss.dev',
                changeOrigin: true,
                secure: false,
                ws: true
            }
        }
    }
});