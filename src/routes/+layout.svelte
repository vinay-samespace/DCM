<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { Toaster } from 'svelte-french-toast';
    import { authService } from '$lib/services/auth';
    import '../app.css';

    onMount(() => {
        if (browser && !authService.isAuthenticated()) {
            goto(`${base}/auth/signin`);
        }
    });
</script>

<div class="app">
    <main>
        <slot />
    </main>
</div>

{#if browser}
    <Toaster 
        position="bottom-right"
        toastOptions={{
            duration: 4000,
            style: 'background: #333; color: white;',
            success: {
                style: 'background: #059669; color: white;',
            },
            error: {
                style: 'background: #DC2626; color: white;',
            }
        }}
    />
{/if}

<style>
    .app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #f3f4f6;
    }

    main {
        flex: 1;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    @media (max-width: 640px) {
        main {
            padding: 0 0.5rem;
        }
    }
</style>