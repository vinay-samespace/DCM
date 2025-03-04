import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // Alias configuration
        alias: {
            '$lib': './src/lib',
            '$lib/*': './src/lib/*'
        },
        
        // Base path for your DCM app
        paths: {
            base: '/apps/dcm'
        },

        // Adapter configuration
        adapter: adapter()
    }
};

export default config;